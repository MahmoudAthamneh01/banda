import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/db';
import { AuthRequest } from '../../middleware/auth.middleware';

const UpdateUserSchema = z.object({
    username: z.string().min(3).max(40).optional(),
    phone: z.string().min(5).max(30).optional(),
    profile: z
        .object({
            displayName: z.string().min(1).max(120).optional(),
            bio: z.string().max(1000).optional(),
            avatarUrl: z.string().url().optional(),
            locale: z.string().min(2).max(10).optional(),
            country: z.string().min(2).max(80).optional(),
            city: z.string().min(1).max(80).optional(),
        })
        .optional(),
});

function canManageUser(currentUserId: string, currentRole: string, targetUserId: string) {
    return currentUserId === targetUserId || ['ADMIN', 'OWNER'].includes(currentRole);
}

const userSelect = {
    id: true,
    email: true,
    username: true,
    phone: true,
    role: true,
    tier: true,
    socialTier: true,
    referralCode: true,
    createdAt: true,
    profile: true,
    wallets: true,
} as const;

const publicUserSelect = {
    id: true,
    username: true,
    role: true,
    tier: true,
    socialTier: true,
    createdAt: true,
    profile: true,
    products: {
        where: { status: 'ACTIVE' },
        take: 12,
        orderBy: { createdAt: 'desc' },
        include: { media: true },
    },
} as const;

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.userId },
            select: userSelect,
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found', code: 'USER_NOT_FOUND' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ error: 'Internal Server Error', code: 'INTERNAL_ERROR' });
    }
};

export const getUserById = async (req: AuthRequest, res: Response) => {
    try {
        const includePrivate = req.user
            ? canManageUser(req.user.userId, req.user.role, req.params.id)
            : false;

        const user = await prisma.user.findUnique({
            where: { id: req.params.id },
            select: includePrivate ? userSelect : publicUserSelect,
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found', code: 'USER_NOT_FOUND' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Internal Server Error', code: 'INTERNAL_ERROR' });
    }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
    try {
        if (!canManageUser(req.user!.userId, req.user!.role, req.params.id)) {
            return res.status(403).json({ error: 'Forbidden', code: 'AUTH_FORBIDDEN' });
        }

        const data = UpdateUserSchema.parse(req.body);

        const user = await prisma.user.update({
            where: { id: req.params.id },
            data: {
                username: data.username,
                phone: data.phone,
                profile: data.profile
                    ? {
                          upsert: {
                              create: data.profile,
                              update: data.profile,
                          },
                      }
                    : undefined,
            },
            select: userSelect,
        });

        res.json({ user });
    } catch (error) {
        console.error('Update user error:', error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation Error', details: error.errors });
        }
        res.status(500).json({ error: 'Internal Server Error', code: 'INTERNAL_ERROR' });
    }
};
