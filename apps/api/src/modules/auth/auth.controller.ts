import { Request, Response } from 'express';
import { prisma } from '../../lib/db';
import { signToken } from '../../lib/jwt';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    username: z.string().optional(),
});

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, username } = RegisterSchema.parse(req.body);

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists', code: 'AUTH_USER_EXISTS' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                username,
                wallets: {
                    create: {
                        type: 'FIAT',
                        currency: 'CNY',
                    }
                }
            },
        });

        const token = signToken({ userId: user.id, email: user.email, role: user.role });

        res.json({ user: { id: user.id, email: user.email, role: user.role }, token });
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
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials', code: 'AUTH_INVALID_CREDS' });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid credentials', code: 'AUTH_INVALID_CREDS' });
        }

        const token = signToken({ userId: user.id, email: user.email, role: user.role });
        res.json({ user: { id: user.id, email: user.email, role: user.role }, token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal Server Error', code: 'INTERNAL_ERROR' });
    }
};
