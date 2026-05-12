import { Request, Response } from 'express';
import { prisma } from '../../lib/db';
import { z } from 'zod';
import { AuthRequest } from '../../middleware/auth.middleware';
import { RFQStatus, RfqBidStatus } from '@prisma/client';

const CreateRFQSchema = z.object({
    productName: z.string().min(1),
    quantity: z.number().int().positive(),
    targetPrice: z.number().positive().optional(),
    sourceUrl: z.string().url().optional(),
    sourceSku: z.string().optional(),
    description: z.string().max(4000).optional(),
    category: z.string().max(80).optional(),
    deadline: z.coerce.date().optional(),
});

const CreateBidSchema = z.object({
    pricePerUnit: z.coerce.number().positive(),
    deliveryDays: z.coerce.number().int().positive(),
    message: z.string().max(1000).optional(),
});

const AwardBidSchema = z.object({
    bidId: z.string().uuid(),
});

function isAdminRole(role: string) {
    return ['ADMIN', 'OWNER'].includes(role);
}

export const createRFQ = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const data = CreateRFQSchema.parse(req.body);

        const rfq = await prisma.rfq.create({
            data: {
                userId,
                productName: data.productName,
                quantity: data.quantity,
                targetPrice: data.targetPrice,
                sourceUrl: data.sourceUrl,
                sourceSku: data.sourceSku,
                description: data.description,
                category: data.category,
                deadline: data.deadline,
                status: RFQStatus.SUBMITTED,
            },
        });

        res.json(rfq);
    } catch (error) {
        console.error('Create RFQ error:', error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation Error', details: error.errors });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const listMyRFQs = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const rfqs = await prisma.rfq.findMany({
            where: { userId },
            include: {
                bids: {
                    include: {
                        maker: {
                            select: {
                                id: true,
                                email: true,
                                username: true,
                                profile: true,
                            },
                        },
                    },
                },
            },
            orderBy: { updatedAt: 'desc' }
        });
        res.json(rfqs);
    } catch (error) {
        console.error('List RFQ error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const listRFQs = async (req: AuthRequest, res: Response) => {
    try {
        const rfqs = await prisma.rfq.findMany({
            where: isAdminRole(req.user!.role) ? {} : { userId: req.user!.userId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        username: true,
                        profile: true,
                    },
                },
                bids: true,
            },
            orderBy: { updatedAt: 'desc' },
        });

        res.json({ rfqs });
    } catch (error) {
        console.error('List RFQs error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getRFQById = async (req: AuthRequest, res: Response) => {
    try {
        const rfq = await prisma.rfq.findUnique({
            where: { id: req.params.id },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        username: true,
                        profile: true,
                    },
                },
                bids: {
                    include: {
                        maker: {
                            select: {
                                id: true,
                                email: true,
                                username: true,
                                profile: true,
                            },
                        },
                    },
                },
            },
        });

        if (!rfq) {
            return res.status(404).json({ error: 'RFQ not found', code: 'RFQ_NOT_FOUND' });
        }

        const canView = rfq.userId === req.user!.userId || isAdminRole(req.user!.role);
        if (!canView) {
            return res.status(403).json({ error: 'Forbidden', code: 'AUTH_FORBIDDEN' });
        }

        res.json({ rfq });
    } catch (error) {
        console.error('Get RFQ error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createBid = async (req: AuthRequest, res: Response) => {
    try {
        const data = CreateBidSchema.parse(req.body);
        const rfq = await prisma.rfq.findUnique({ where: { id: req.params.id } });

        if (!rfq) {
            return res.status(404).json({ error: 'RFQ not found', code: 'RFQ_NOT_FOUND' });
        }

        if (rfq.userId === req.user!.userId) {
            return res.status(400).json({ error: 'Cannot bid on your own RFQ', code: 'RFQ_OWN_BID' });
        }

        const totalPrice = data.pricePerUnit * rfq.quantity;
        const bid = await prisma.rfqBid.create({
            data: {
                rfqId: rfq.id,
                makerId: req.user!.userId,
                pricePerUnit: data.pricePerUnit,
                totalPrice,
                deliveryDays: data.deliveryDays,
                message: data.message,
                status: RfqBidStatus.SUBMITTED,
            },
            include: {
                maker: {
                    select: {
                        id: true,
                        email: true,
                        username: true,
                        profile: true,
                    },
                },
            },
        });

        await prisma.rfq.update({
            where: { id: rfq.id },
            data: { status: RFQStatus.QUOTED },
        });

        res.status(201).json({ bid });
    } catch (error) {
        console.error('Create bid error:', error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation Error', details: error.errors });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const awardBid = async (req: AuthRequest, res: Response) => {
    try {
        const data = AwardBidSchema.parse(req.body);
        const rfq = await prisma.rfq.findUnique({
            where: { id: req.params.id },
            include: { bids: true },
        });

        if (!rfq) {
            return res.status(404).json({ error: 'RFQ not found', code: 'RFQ_NOT_FOUND' });
        }

        if (rfq.userId !== req.user!.userId && !isAdminRole(req.user!.role)) {
            return res.status(403).json({ error: 'Forbidden', code: 'AUTH_FORBIDDEN' });
        }

        const selectedBid = rfq.bids.find((bid) => bid.id === data.bidId);
        if (!selectedBid) {
            return res.status(404).json({ error: 'Bid not found', code: 'RFQ_BID_NOT_FOUND' });
        }

        const result = await prisma.$transaction(async (tx) => {
            await tx.rfqBid.updateMany({
                where: { rfqId: rfq.id },
                data: { status: RfqBidStatus.REJECTED },
            });
            const bid = await tx.rfqBid.update({
                where: { id: data.bidId },
                data: { status: RfqBidStatus.ACCEPTED },
            });
            const updatedRfq = await tx.rfq.update({
                where: { id: rfq.id },
                data: { status: RFQStatus.ACCEPTED },
                include: { bids: true },
            });

            return { rfq: updatedRfq, bid };
        });

        res.json(result);
    } catch (error) {
        console.error('Award bid error:', error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation Error', details: error.errors });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
