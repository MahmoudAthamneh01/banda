import {
    LedgerDirection,
    Prisma,
    ReferralRewardType,
    ReferralStatus,
    TransactionStatus,
    TransactionType,
    WalletType,
} from '@prisma/client';

const REFERRAL_REWARD_CONFIG = {
    signupReward: 10,
    firstOrderReward: 50,
    tierRates: [0.03, 0.015, 0.005],
    maxRewardPerReferralEdge: 2000,
    maxTotalEarnings: 50000,
};

export async function getOrCreateWallet(
    tx: Prisma.TransactionClient,
    userId: string | null,
    type: WalletType,
    currency: string,
) {
    const wallet = await tx.wallet.findFirst({
        where: {
            userId,
            type,
            currency,
        },
    });

    if (wallet) {
        return wallet;
    }

    return tx.wallet.create({
        data: {
            userId: userId ?? undefined,
            type,
            currency,
        },
    });
}

function roundMoney(value: number) {
    return Math.round((value + Number.EPSILON) * 100) / 100;
}

async function rewardTotals(tx: Prisma.TransactionClient, referralId: string, referrerId: string) {
    const [edgeTotal, referrerTotal] = await Promise.all([
        tx.referralReward.aggregate({
            where: { referralId },
            _sum: { amount: true },
        }),
        tx.referralReward.aggregate({
            where: {
                referral: {
                    referrerId,
                },
            },
            _sum: { amount: true },
        }),
    ]);

    return {
        edgeTotal: Number(edgeTotal._sum.amount ?? 0),
        referrerTotal: Number(referrerTotal._sum.amount ?? 0),
    };
}

async function awardReferralReward(params: {
    tx: Prisma.TransactionClient;
    referralId: string;
    referrerId: string;
    orderId?: string;
    sourceRefereeId: string;
    level: number;
    type: ReferralRewardType;
    requestedAmount: number;
    currency: string;
    metadata?: Prisma.InputJsonObject;
}) {
    const amount = roundMoney(params.requestedAmount);
    if (amount <= 0) {
        return 0;
    }

    const totals = await rewardTotals(params.tx, params.referralId, params.referrerId);
    const edgeRemaining = Math.max(0, REFERRAL_REWARD_CONFIG.maxRewardPerReferralEdge - totals.edgeTotal);
    const referrerRemaining = Math.max(0, REFERRAL_REWARD_CONFIG.maxTotalEarnings - totals.referrerTotal);
    const allowedAmount = roundMoney(Math.min(amount, edgeRemaining, referrerRemaining));

    if (allowedAmount <= 0) {
        return 0;
    }

    const systemWallet = await getOrCreateWallet(params.tx, null, WalletType.SYSTEM, params.currency);
    const referrerWallet = await getOrCreateWallet(
        params.tx,
        params.referrerId,
        WalletType.FIAT,
        params.currency,
    );

    const transaction = await params.tx.transaction.create({
        data: {
            userId: params.referrerId,
            orderId: params.orderId,
            type: TransactionType.REFERRAL_REWARD,
            status: TransactionStatus.COMPLETED,
            amount: allowedAmount,
            currency: params.currency,
            metadata: {
                referralId: params.referralId,
                sourceRefereeId: params.sourceRefereeId,
                level: params.level,
                rewardType: params.type,
                ...params.metadata,
            },
        },
    });

    await params.tx.wallet.update({
        where: { id: systemWallet.id },
        data: { balance: { decrement: allowedAmount } },
    });
    await params.tx.wallet.update({
        where: { id: referrerWallet.id },
        data: { balance: { increment: allowedAmount } },
    });
    await params.tx.ledgerEntry.createMany({
        data: [
            {
                transactionId: transaction.id,
                walletId: systemWallet.id,
                direction: LedgerDirection.DEBIT,
                amount: allowedAmount,
                currency: params.currency,
                reasonCode: `REFERRAL_${params.type}`,
                metadata: {
                    referralId: params.referralId,
                    sourceRefereeId: params.sourceRefereeId,
                    level: params.level,
                },
            },
            {
                transactionId: transaction.id,
                walletId: referrerWallet.id,
                direction: LedgerDirection.CREDIT,
                amount: allowedAmount,
                currency: params.currency,
                reasonCode: `REFERRAL_${params.type}`,
                metadata: {
                    referralId: params.referralId,
                    sourceRefereeId: params.sourceRefereeId,
                    level: params.level,
                },
            },
        ],
    });

    await params.tx.referralReward.create({
        data: {
            referralId: params.referralId,
            orderId: params.orderId,
            transactionId: transaction.id,
            level: params.level,
            type: params.type,
            amount: allowedAmount,
            currency: params.currency,
            metadata: {
                sourceRefereeId: params.sourceRefereeId,
                requestedAmount: amount,
                ...params.metadata,
            },
        },
    });

    return allowedAmount;
}

export async function awardSignupReferralReward(params: {
    tx: Prisma.TransactionClient;
    referralId: string;
    referrerId: string;
    refereeId: string;
    currency?: string;
}) {
    return awardReferralReward({
        tx: params.tx,
        referralId: params.referralId,
        referrerId: params.referrerId,
        sourceRefereeId: params.refereeId,
        level: 1,
        type: ReferralRewardType.SIGNUP,
        requestedAmount: REFERRAL_REWARD_CONFIG.signupReward,
        currency: params.currency ?? 'CNY',
    });
}

async function buildReferralChain(tx: Prisma.TransactionClient, refereeId: string) {
    const chain: Array<{ id: string; referrerId: string; refereeId: string }> = [];
    let currentRefereeId = refereeId;

    for (let level = 1; level <= REFERRAL_REWARD_CONFIG.tierRates.length; level += 1) {
        const referral = await tx.referral.findUnique({
            where: { refereeId: currentRefereeId },
            select: {
                id: true,
                referrerId: true,
                refereeId: true,
                status: true,
            },
        });

        if (!referral || referral.status !== ReferralStatus.ACTIVE) {
            break;
        }

        chain.push(referral);
        currentRefereeId = referral.referrerId;
    }

    return chain;
}

export async function awardOrderReferralRewards(params: {
    tx: Prisma.TransactionClient;
    orderId: string;
    buyerId: string;
    subtotal: number;
    currency: string;
    isFirstOrder: boolean;
}) {
    const chain = await buildReferralChain(params.tx, params.buyerId);
    let totalAwarded = 0;

    for (const [index, referral] of chain.entries()) {
        const level = index + 1;
        const rate = REFERRAL_REWARD_CONFIG.tierRates[index] ?? 0;

        if (level === 1 && params.isFirstOrder) {
            totalAwarded += await awardReferralReward({
                tx: params.tx,
                referralId: referral.id,
                referrerId: referral.referrerId,
                orderId: params.orderId,
                sourceRefereeId: params.buyerId,
                level,
                type: ReferralRewardType.FIRST_ORDER,
                requestedAmount: REFERRAL_REWARD_CONFIG.firstOrderReward,
                currency: params.currency,
            });
        }

        totalAwarded += await awardReferralReward({
            tx: params.tx,
            referralId: referral.id,
            referrerId: referral.referrerId,
            orderId: params.orderId,
            sourceRefereeId: params.buyerId,
            level,
            type: ReferralRewardType.COMMISSION,
            requestedAmount: params.subtotal * rate,
            currency: params.currency,
            metadata: {
                rate,
            },
        });
    }

    return roundMoney(totalAwarded);
}
