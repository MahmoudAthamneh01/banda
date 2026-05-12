import { Request, Response } from 'express';
import { prisma } from '../../lib/db';
import { signToken } from '../../lib/jwt';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { Role } from '@prisma/client';
import { AuthRequest } from '../../middleware/auth.middleware';
import { awardSignupReferralReward } from '../referrals/referral.service';

const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    username: z.string().min(3).max(40).optional(),
    name: z.string().min(1).max(120).optional(),
    phone: z.string().min(5).max(30).optional(),
    role: z.string().optional(),
    referralCode: z.string().min(1).optional(),
});

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

const PUBLIC_REGISTRATION_ROLES = new Set<Role>([
    Role.USER,
    Role.BUYER,
    Role.MAKER,
    Role.INVESTOR,
]);

function normalizeRegistrationRole(value?: string): Role {
    const requested = value?.trim().toUpperCase();
    if (requested && requested in Role && PUBLIC_REGISTRATION_ROLES.has(requested as Role)) {
        return requested as Role;
    }

    return Role.USER;
}

function publicUser(user: {
    id: string;
    email: string;
    username: string | null;
    phone?: string | null;
    role: Role;
    referralCode?: string;
    profile?: unknown;
    wallets?: unknown;
}) {
    return {
        id: user.id,
        email: user.email,
        username: user.username,
        phone: user.phone ?? null,
        role: user.role,
        referralCode: user.referralCode,
        profile: user.profile,
        wallets: user.wallets,
    };
}

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, username, name, phone, role, referralCode } = RegisterSchema.parse(req.body);

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists', code: 'AUTH_USER_EXISTS' });
        }

        if (phone) {
            const existingPhone = await prisma.user.findUnique({ where: { phone } });
            if (existingPhone) {
                return res.status(400).json({ error: 'Phone already exists', code: 'AUTH_PHONE_EXISTS' });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const normalizedRole = normalizeRegistrationRole(role);

        const referrer = referralCode
            ? await prisma.user.findUnique({ where: { referralCode } })
            : null;

        const user = await prisma.$transaction(async (tx) => {
            const created = await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    username,
                    phone,
                    role: normalizedRole,
                    profile: {
                        create: {
                            displayName: name || username || email.split('@')[0],
                        },
                    },
                    wallets: {
                        create: [
                            {
                                type: 'FIAT',
                                currency: 'CNY',
                                balance: 10000,
                            },
                            {
                                type: 'POINTS',
                                currency: 'POINTS',
                                balance: 0,
                            },
                        ],
                    },
                },
                include: {
                    profile: true,
                    wallets: true,
                },
            });

            if (referrer && referrer.id !== created.id) {
                const referral = await tx.referral.create({
                    data: {
                        referrerId: referrer.id,
                        refereeId: created.id,
                        code: referrer.referralCode,
                    },
                });
                await awardSignupReferralReward({
                    tx,
                    referralId: referral.id,
                    referrerId: referrer.id,
                    refereeId: created.id,
                });
            }

            await tx.auditLog.create({
                data: {
                    userId: created.id,
                    action: 'AUTH_REGISTER',
                    resource: 'User',
                    ip: req.ip,
                    legalConsent: true,
                },
            });

            return created;
        });

        const token = signToken({ userId: user.id, email: user.email, role: user.role });

        res.status(201).json({ user: publicUser(user), token });
    } catch (error) {
        console.error('Register error:', error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation Error', details: error.errors });
        }
        res.status(500).json({ error: 'Internal Server Error', code: 'INTERNAL_ERROR' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = LoginSchema.parse(req.body);

        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                profile: true,
                wallets: true,
            },
        });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials', code: 'AUTH_INVALID_CREDS' });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid credentials', code: 'AUTH_INVALID_CREDS' });
        }

        const token = signToken({ userId: user.id, email: user.email, role: user.role });
        res.json({ user: publicUser(user), token });
    } catch (error) {
        console.error('Login error:', error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation Error', details: error.errors });
        }
        res.status(500).json({ error: 'Internal Server Error', code: 'INTERNAL_ERROR' });
    }
};

export const me = async (req: AuthRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.userId },
            include: {
                profile: true,
                wallets: true,
                referredBy: {
                    include: {
                        referrer: {
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

        if (!user) {
            return res.status(404).json({ error: 'User not found', code: 'AUTH_USER_NOT_FOUND' });
        }

        res.json({ user: publicUser(user) });
    } catch (error) {
        console.error('Me error:', error);
        res.status(500).json({ error: 'Internal Server Error', code: 'INTERNAL_ERROR' });
    }
};
