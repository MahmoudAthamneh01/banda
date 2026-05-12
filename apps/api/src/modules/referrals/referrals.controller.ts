import { Response } from 'express';
import { prisma } from '../../lib/db';
import { AuthRequest } from '../../middleware/auth.middleware';

export const getMyReferralCode = async (req: AuthRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.userId },
            select: {
                referralCode: true,
            },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found', code: 'USER_NOT_FOUND' });
        }

        res.json({
            code: user.referralCode,
            sharePath: `/auth/register?ref=${encodeURIComponent(user.referralCode)}`,
        });
    } catch (error) {
        console.error('Referral code error:', error);
        res.status(500).json({ error: 'Internal Server Error', code: 'INTERNAL_ERROR' });
    }
};

export const getReferralStats = async (req: AuthRequest, res: Response) => {
    try {
        const referrals = await prisma.referral.findMany({
            where: { referrerId: req.user!.userId },
            include: {
                rewards: true,
            },
        });

        const rewardTotal = referrals.reduce(
            (sum, referral) =>
                sum + referral.rewards.reduce((innerSum, reward) => innerSum + Number(reward.amount), 0),
            0,
        );

        res.json({
            referralsCount: referrals.length,
            activeReferralsCount: referrals.filter((referral) => referral.status === 'ACTIVE').length,
            rewardTotal,
            rewardsCount: referrals.reduce((sum, referral) => sum + referral.rewards.length, 0),
        });
    } catch (error) {
        console.error('Referral stats error:', error);
        res.status(500).json({ error: 'Internal Server Error', code: 'INTERNAL_ERROR' });
    }
};

export const getReferralHistory = async (req: AuthRequest, res: Response) => {
    try {
        const referrals = await prisma.referral.findMany({
            where: { referrerId: req.user!.userId },
            include: {
                referee: {
                    select: {
                        id: true,
                        email: true,
                        username: true,
                        role: true,
                        profile: true,
                    },
                },
                rewards: {
                    orderBy: { createdAt: 'desc' },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json({ referrals });
    } catch (error) {
        console.error('Referral history error:', error);
        res.status(500).json({ error: 'Internal Server Error', code: 'INTERNAL_ERROR' });
    }
};
