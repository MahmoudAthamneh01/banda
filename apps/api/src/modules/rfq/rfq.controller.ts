import { Request, Response } from 'express';
import { prisma } from '../../lib/db';
import { z } from 'zod';
import { AuthRequest } from '../../middleware/auth.middleware';

const CreateRFQSchema = z.object({
    productName: z.string().min(1),
    quantity: z.number().int().positive(),
    targetPrice: z.number().positive().optional(),
    sourceUrl: z.string().url().optional(),
    sourceSku: z.string().optional(),
});

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
                status: 'DRAFT',
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
            orderBy: { updatedAt: 'desc' }
        });
        res.json(rfqs);
    } catch (error) {
        console.error('List RFQ error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
