import { Response } from 'express';
import {
    LedgerDirection,
    OrderStatus,
    Prisma,
    TransactionStatus,
    TransactionType,
    WalletType,
} from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../lib/db';
import { AuthRequest } from '../../middleware/auth.middleware';
import { awardOrderReferralRewards, getOrCreateWallet } from '../referrals/referral.service';

class ApiError extends Error {
    constructor(
        public status: number,
        public code: string,
        message: string,
    ) {
        super(message);
    }
}

const CreateOrderSchema = z.object({
    items: z
        .array(
            z.object({
                productId: z.string().uuid().optional(),
                sku: z.string().min(1).optional(),
                name: z.string().min(1).max(180).optional(),
                quantity: z.coerce.number().int().positive(),
                unitPrice: z.coerce.number().positive().optional(),
                makerId: z.string().uuid().optional(),
            }),
        )
        .min(1),
    currency: z.string().min(3).max(3).default('CNY'),
    metadata: z.record(z.unknown()).optional(),
});

const ListOrdersSchema = z.object({
    status: z.nativeEnum(OrderStatus).optional(),
    side: z.enum(['buyer', 'maker']).optional(),
    take: z.coerce.number().int().positive().max(100).default(25),
    skip: z.coerce.number().int().min(0).default(0),
});

const orderInclude = {
    items: true,
    transactions: {
        include: {
            ledgerEntries: true,
        },
    },
    referralRewards: true,
    buyer: {
        select: {
            id: true,
            email: true,
            username: true,
            profile: true,
        },
    },
    maker: {
        select: {
            id: true,
            email: true,
            username: true,
            profile: true,
        },
    },
} as const;

type NormalizedOrderItem = {
    productId?: string;
    sku?: string;
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
    makerId?: string | null;
};

function roundMoney(value: number) {
    return Math.round((value + Number.EPSILON) * 100) / 100;
}

function isAdminRole(role: string) {
    return ['ADMIN', 'OWNER'].includes(role);
}

function canAccessOrder(
    user: { userId: string; role: string },
    order: { buyerId: string; makerId: string | null },
) {
    return isAdminRole(user.role) || order.buyerId === user.userId || order.makerId === user.userId;
}

async function normalizeItems(
    tx: Prisma.TransactionClient,
    input: z.infer<typeof CreateOrderSchema>,
): Promise<NormalizedOrderItem[]> {
    const normalized: NormalizedOrderItem[] = [];

    for (const item of input.items) {
        const product = item.productId
            ? await tx.product.findUnique({ where: { id: item.productId } })
            : item.sku
              ? await tx.product.findUnique({ where: { sku: item.sku } })
              : null;

        if (product) {
            if (product.status !== 'ACTIVE') {
                throw new ApiError(400, 'PRODUCT_NOT_ACTIVE', `Product ${product.sku} is not active`);
            }
            if (product.stock < item.quantity) {
                throw new ApiError(400, 'PRODUCT_STOCK_LOW', `Insufficient stock for ${product.sku}`);
            }

            const unitPrice = Number(product.price);
            normalized.push({
                productId: product.id,
                sku: product.sku,
                name: product.name,
                quantity: item.quantity,
                unitPrice,
                total: roundMoney(unitPrice * item.quantity),
                makerId: product.makerId,
            });
            continue;
        }

        if (!item.name || !item.unitPrice) {
            throw new ApiError(400, 'ORDER_ITEM_INVALID', 'Manual order items need name and unitPrice');
        }

        normalized.push({
            sku: item.sku,
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: roundMoney(item.unitPrice * item.quantity),
            makerId: item.makerId ?? null,
        });
    }

    return normalized;
}

export const createOrder = async (req: AuthRequest, res: Response) => {
    try {
        const input = CreateOrderSchema.parse(req.body);
        const userId = req.user!.userId;

        const order = await prisma.$transaction(async (tx) => {
            const items = await normalizeItems(tx, input);
            const makerIds = [...new Set(items.map((item) => item.makerId).filter(Boolean))] as string[];

            if (makerIds.length > 1) {
                throw new ApiError(400, 'ORDER_MULTIPLE_MAKERS', 'One order can only contain one maker');
            }

            const makerId = makerIds[0] ?? null;
            const subtotal = roundMoney(items.reduce((sum, item) => sum + item.total, 0));
            const platformFeeRate = 0.1;
            const platformFeeAmount = roundMoney(subtotal * platformFeeRate);
            const total = subtotal;

            const buyerWallet = await getOrCreateWallet(tx, userId, WalletType.FIAT, input.currency);
            if (Number(buyerWallet.balance) < total) {
                throw new ApiError(402, 'WALLET_INSUFFICIENT_FUNDS', 'Insufficient wallet balance');
            }

            const priorOrders = await tx.order.count({
                where: {
                    buyerId: userId,
                    status: { not: OrderStatus.DRAFT },
                },
            });

            const createdOrder = await tx.order.create({
                data: {
                    buyerId: userId,
                    makerId,
                    status: OrderStatus.PAID,
                    amountSubtotal: subtotal,
                    amountTotal: total,
                    platformFeeRate,
                    platformFeeAmount,
                    referralAmount: 0,
                    currency: input.currency,
                    metadata: input.metadata as Prisma.InputJsonObject | undefined,
                    items: {
                        create: items.map((item) => ({
                            productId: item.productId,
                            sku: item.sku,
                            name: item.name,
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                            total: item.total,
                        })),
                    },
                },
            });

            for (const item of items) {
                if (item.productId) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: { stock: { decrement: item.quantity } },
                    });
                }
            }

            const systemWallet = await getOrCreateWallet(tx, null, WalletType.SYSTEM, input.currency);
            const makerWallet = makerId
                ? await getOrCreateWallet(tx, makerId, WalletType.FIAT, input.currency)
                : null;
            const makerNet = makerWallet ? roundMoney(total - platformFeeAmount) : 0;
            const systemGross = makerWallet ? platformFeeAmount : total;

            const paymentTransaction = await tx.transaction.create({
                data: {
                    userId,
                    orderId: createdOrder.id,
                    type: TransactionType.ORDER_PAYMENT,
                    status: TransactionStatus.COMPLETED,
                    amount: total,
                    currency: input.currency,
                    metadata: {
                        paymentMode: 'wallet-demo',
                    },
                },
            });

            await tx.wallet.update({
                where: { id: buyerWallet.id },
                data: { balance: { decrement: total } },
            });
            await tx.wallet.update({
                where: { id: systemWallet.id },
                data: { balance: { increment: systemGross } },
            });

            const ledgerEntries: Prisma.LedgerEntryCreateManyInput[] = [
                {
                    transactionId: paymentTransaction.id,
                    walletId: buyerWallet.id,
                    direction: LedgerDirection.DEBIT,
                    amount: total,
                    currency: input.currency,
                    reasonCode: 'ORDER_PAYMENT',
                },
                {
                    transactionId: paymentTransaction.id,
                    walletId: systemWallet.id,
                    direction: LedgerDirection.CREDIT,
                    amount: systemGross,
                    currency: input.currency,
                    reasonCode: makerWallet ? 'PLATFORM_FEE' : 'ORDER_PAYMENT_UNASSIGNED_MAKER',
                },
            ];

            if (makerWallet && makerNet > 0) {
                await tx.wallet.update({
                    where: { id: makerWallet.id },
                    data: { balance: { increment: makerNet } },
                });
                ledgerEntries.push({
                    transactionId: paymentTransaction.id,
                    walletId: makerWallet.id,
                    direction: LedgerDirection.CREDIT,
                    amount: makerNet,
                    currency: input.currency,
                    reasonCode: 'MAKER_PAYOUT',
                });
            }

            await tx.ledgerEntry.createMany({ data: ledgerEntries });

            const referralAmount = await awardOrderReferralRewards({
                tx,
                orderId: createdOrder.id,
                buyerId: userId,
                subtotal,
                currency: input.currency,
                isFirstOrder: priorOrders === 0,
            });

            if (referralAmount > 0) {
                await tx.order.update({
                    where: { id: createdOrder.id },
                    data: { referralAmount },
                });
            }

            return tx.order.findUniqueOrThrow({
                where: { id: createdOrder.id },
                include: orderInclude,
            });
        });

        res.status(201).json({ order });
    } catch (error) {
        console.error('Create order error:', error);
        if (error instanceof ApiError) {
            return res.status(error.status).json({ error: error.message, code: error.code });
        }
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation Error', details: error.errors });
        }
        res.status(500).json({ error: 'Internal Server Error', code: 'INTERNAL_ERROR' });
    }
};

export const listOrders = async (req: AuthRequest, res: Response) => {
    try {
        const query = ListOrdersSchema.parse(req.query);
        const user = req.user!;

        const ownershipWhere = isAdminRole(user.role)
            ? {}
            : query.side === 'buyer'
              ? { buyerId: user.userId }
              : query.side === 'maker'
                ? { makerId: user.userId }
                : { OR: [{ buyerId: user.userId }, { makerId: user.userId }] };

        const orders = await prisma.order.findMany({
            where: {
                ...ownershipWhere,
                status: query.status,
            },
            include: orderInclude,
            orderBy: { updatedAt: 'desc' },
            skip: query.skip,
            take: query.take,
        });

        res.json({ orders });
    } catch (error) {
        console.error('List orders error:', error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation Error', details: error.errors });
        }
        res.status(500).json({ error: 'Internal Server Error', code: 'INTERNAL_ERROR' });
    }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
    try {
        const order = await prisma.order.findUnique({
            where: { id: req.params.id },
            include: orderInclude,
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found', code: 'ORDER_NOT_FOUND' });
        }

        if (!canAccessOrder(req.user!, order)) {
            return res.status(403).json({ error: 'Forbidden', code: 'AUTH_FORBIDDEN' });
        }

        res.json({ order });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ error: 'Internal Server Error', code: 'INTERNAL_ERROR' });
    }
};

export const shipOrder = async (req: AuthRequest, res: Response) => {
    try {
        const existing = await prisma.order.findUnique({ where: { id: req.params.id } });
        if (!existing) {
            return res.status(404).json({ error: 'Order not found', code: 'ORDER_NOT_FOUND' });
        }

        const canShip = existing.makerId === req.user!.userId || isAdminRole(req.user!.role);
        if (!canShip) {
            return res.status(403).json({ error: 'Forbidden', code: 'AUTH_FORBIDDEN' });
        }

        const order = await prisma.order.update({
            where: { id: req.params.id },
            data: { status: OrderStatus.SHIPPED },
            include: orderInclude,
        });

        res.json({ order });
    } catch (error) {
        console.error('Ship order error:', error);
        res.status(500).json({ error: 'Internal Server Error', code: 'INTERNAL_ERROR' });
    }
};

export const confirmReceipt = async (req: AuthRequest, res: Response) => {
    try {
        const existing = await prisma.order.findUnique({ where: { id: req.params.id } });
        if (!existing) {
            return res.status(404).json({ error: 'Order not found', code: 'ORDER_NOT_FOUND' });
        }

        const canConfirm = existing.buyerId === req.user!.userId || isAdminRole(req.user!.role);
        if (!canConfirm) {
            return res.status(403).json({ error: 'Forbidden', code: 'AUTH_FORBIDDEN' });
        }

        const order = await prisma.order.update({
            where: { id: req.params.id },
            data: { status: OrderStatus.DELIVERED },
            include: orderInclude,
        });

        res.json({ order });
    } catch (error) {
        console.error('Confirm receipt error:', error);
        res.status(500).json({ error: 'Internal Server Error', code: 'INTERNAL_ERROR' });
    }
};
