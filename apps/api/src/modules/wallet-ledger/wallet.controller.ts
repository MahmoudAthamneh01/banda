import { Response } from 'express';
import { z } from 'zod';
import { LedgerDirection, TransactionStatus, TransactionType, WalletType } from '@prisma/client';
import { prisma } from '../../lib/db';
import { AuthRequest } from '../../middleware/auth.middleware';

const DepositSchema = z.object({
    amount: z.coerce.number().positive(),
    currency: z.string().min(3).max(10).default('CNY'),
});

export const listWallets = async (req: AuthRequest, res: Response) => {
    try {
        const wallets = await prisma.wallet.findMany({
            where: { userId: req.user!.userId },
            include: {
                ledgerEntries: {
                    orderBy: { createdAt: 'desc' },
                    take: 20,
                    include: {
                        transaction: true,
                    },
                },
            },
            orderBy: [{ currency: 'asc' }, { type: 'asc' }],
        });

        res.json({ wallets });
    } catch (error) {
        console.error('List wallets error:', error);
        res.status(500).json({ error: 'Internal Server Error', code: 'INTERNAL_ERROR' });
    }
};

export const listLedger = async (req: AuthRequest, res: Response) => {
    try {
        const entries = await prisma.ledgerEntry.findMany({
            where: {
                wallet: {
                    userId: req.user!.userId,
                },
            },
            include: {
                wallet: true,
                transaction: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 100,
        });

        res.json({ entries });
    } catch (error) {
        console.error('List ledger error:', error);
        res.status(500).json({ error: 'Internal Server Error', code: 'INTERNAL_ERROR' });
    }
};

export const demoDeposit = async (req: AuthRequest, res: Response) => {
    try {
        const input = DepositSchema.parse(req.body);

        const result = await prisma.$transaction(async (tx) => {
            let wallet = await tx.wallet.findFirst({
                where: {
                    userId: req.user!.userId,
                    type: WalletType.FIAT,
                    currency: input.currency,
                },
            });

            if (!wallet) {
                wallet = await tx.wallet.create({
                    data: {
                        userId: req.user!.userId,
                        type: WalletType.FIAT,
                        currency: input.currency,
                    },
                });
            }

            const transaction = await tx.transaction.create({
                data: {
                    userId: req.user!.userId,
                    type: TransactionType.DEPOSIT,
                    status: TransactionStatus.COMPLETED,
                    amount: input.amount,
                    currency: input.currency,
                    metadata: {
                        source: 'demo-deposit',
                    },
                },
            });

            const updatedWallet = await tx.wallet.update({
                where: { id: wallet.id },
                data: { balance: { increment: input.amount } },
            });

            await tx.ledgerEntry.create({
                data: {
                    transactionId: transaction.id,
                    walletId: wallet.id,
                    direction: LedgerDirection.CREDIT,
                    amount: input.amount,
                    currency: input.currency,
                    reasonCode: 'DEMO_DEPOSIT',
                },
            });

            return { wallet: updatedWallet, transaction };
        });

        res.status(201).json(result);
    } catch (error) {
        console.error('Demo deposit error:', error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation Error', details: error.errors });
        }
        res.status(500).json({ error: 'Internal Server Error', code: 'INTERNAL_ERROR' });
    }
};
