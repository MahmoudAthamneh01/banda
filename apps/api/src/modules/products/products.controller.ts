import { Request, Response } from 'express';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/db';
import { AuthRequest } from '../../middleware/auth.middleware';

const ImportSchema = z.object({
    url: z.string().url(),
});

const ListProductsSchema = z.object({
    q: z.string().optional(),
    category: z.string().optional(),
    makerId: z.string().uuid().optional(),
    status: z.string().optional(),
    take: z.coerce.number().int().positive().max(100).default(24),
    skip: z.coerce.number().int().min(0).default(0),
});

const ProductInputSchema = z.object({
    sku: z.string().min(2).max(80).optional(),
    name: z.string().min(1).max(180),
    description: z.string().max(4000).optional(),
    price: z.coerce.number().positive(),
    currency: z.string().min(3).max(3).default('CNY'),
    category: z.string().max(80).optional(),
    stock: z.coerce.number().int().min(0).default(0),
    status: z.string().default('ACTIVE'),
    media: z
        .array(
            z.object({
                url: z.string().min(1),
                alt: z.string().optional(),
            }),
        )
        .optional(),
    metadata: z.record(z.unknown()).optional(),
});

function generateSku() {
    return `BC-${randomUUID().slice(0, 8).toUpperCase()}`;
}

export const importProduct = async (req: Request, res: Response) => {
    try {
        const { url } = ImportSchema.parse(req.body);

        // Mock Scraper Delay
        // await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock Data Return
        const mockProduct = {
            name: 'High Quality Wireless Headphones Noise Cancelling',
            price: '145.00',
            moq: 500,
            sku: 'BANDA-XE9-2024',
            supplier: 'Shenzhen Tech Factory',
            images: []
        };

        res.json(mockProduct);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Invalid URL', details: error.errors });
        }
        res.status(500).json({ error: 'Import failed' });
    }
};

export const getFeed = async (req: Request, res: Response) => {
    // Mock "Sovereign Boxes" (Live Investment Opportunities)
    const feed = [
        {
            id: 'box-1',
            title: 'Wireless Audio Batch #240',
            roi: 12.5,
            duration: '45 Days',
            progress: 65,
            targetAmount: 50000,
            image: '/mock/headphones.jpg',
            maker: 'AudioTech Ltd',
            tags: ['Electronics', 'High Yield']
        },
        {
            id: 'box-2',
            title: 'Eco-Friendly Bamboo Cutlery',
            roi: 8.2,
            duration: '30 Days',
            progress: 90,
            targetAmount: 20000,
            image: '/mock/bamboo.jpg',
            maker: 'GreenLiving',
            tags: ['Eco', 'Fast Turnaround']
        },
        {
            id: 'box-3',
            title: 'Smart Home LED Strips',
            roi: 15.0,
            duration: '60 Days',
            progress: 20,
            targetAmount: 100000,
            image: '/mock/led.jpg',
            maker: 'BrightFuture',
            tags: ['Home', 'Smart Tech']
        }
    ];

    res.json(feed);
};

export const listProducts = async (req: Request, res: Response) => {
    try {
        const query = ListProductsSchema.parse(req.query);

        const products = await prisma.product.findMany({
            where: {
                makerId: query.makerId,
                status: query.status || 'ACTIVE',
                category: query.category,
                OR: query.q
                    ? [
                          { name: { contains: query.q, mode: 'insensitive' } },
                          { sku: { contains: query.q, mode: 'insensitive' } },
                          { description: { contains: query.q, mode: 'insensitive' } },
                      ]
                    : undefined,
            },
            include: {
                media: true,
                maker: {
                    select: {
                        id: true,
                        username: true,
                        profile: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            skip: query.skip,
            take: query.take,
        });

        res.json({ products });
    } catch (error) {
        console.error('List products error:', error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation Error', details: error.errors });
        }
        res.status(500).json({ error: 'Internal Server Error', code: 'INTERNAL_ERROR' });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: req.params.id },
            include: {
                media: true,
                maker: {
                    select: {
                        id: true,
                        username: true,
                        role: true,
                        profile: true,
                    },
                },
            },
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found', code: 'PRODUCT_NOT_FOUND' });
        }

        res.json({ product });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ error: 'Internal Server Error', code: 'INTERNAL_ERROR' });
    }
};

export const createProduct = async (req: AuthRequest, res: Response) => {
    try {
        const input = ProductInputSchema.parse(req.body);
        const userId = req.user!.userId;

        const product = await prisma.product.create({
            data: {
                makerId: userId,
                sku: input.sku || generateSku(),
                name: input.name,
                description: input.description,
                price: input.price,
                currency: input.currency,
                category: input.category,
                stock: input.stock,
                status: input.status,
                metadata: input.metadata as Prisma.InputJsonObject | undefined,
                media: input.media
                    ? {
                          create: input.media.map((item) => ({
                              ownerId: userId,
                              type: 'PRODUCT',
                              url: item.url,
                              alt: item.alt,
                          })),
                      }
                    : undefined,
            },
            include: {
                media: true,
                maker: {
                    select: {
                        id: true,
                        username: true,
                        profile: true,
                    },
                },
            },
        });

        res.status(201).json({ product });
    } catch (error) {
        console.error('Create product error:', error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation Error', details: error.errors });
        }
        res.status(500).json({ error: 'Internal Server Error', code: 'INTERNAL_ERROR' });
    }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
    try {
        const input = ProductInputSchema.partial().parse(req.body);
        const existing = await prisma.product.findUnique({ where: { id: req.params.id } });

        if (!existing) {
            return res.status(404).json({ error: 'Product not found', code: 'PRODUCT_NOT_FOUND' });
        }

        const canEdit =
            existing.makerId === req.user!.userId || ['ADMIN', 'OWNER'].includes(req.user!.role);

        if (!canEdit) {
            return res.status(403).json({ error: 'Forbidden', code: 'AUTH_FORBIDDEN' });
        }

        const product = await prisma.product.update({
            where: { id: req.params.id },
            data: {
                sku: input.sku,
                name: input.name,
                description: input.description,
                price: input.price,
                currency: input.currency,
                category: input.category,
                stock: input.stock,
                status: input.status,
                metadata: input.metadata as Prisma.InputJsonObject | undefined,
            },
            include: {
                media: true,
                maker: {
                    select: {
                        id: true,
                        username: true,
                        profile: true,
                    },
                },
            },
        });

        res.json({ product });
    } catch (error) {
        console.error('Update product error:', error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation Error', details: error.errors });
        }
        res.status(500).json({ error: 'Internal Server Error', code: 'INTERNAL_ERROR' });
    }
};
