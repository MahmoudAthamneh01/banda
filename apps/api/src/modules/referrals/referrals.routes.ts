import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { getMyReferralCode, getReferralHistory, getReferralStats } from './referrals.controller';

const router = Router();

router.get('/my-code', authenticate, getMyReferralCode);
router.get('/stats', authenticate, getReferralStats);
router.get('/history', authenticate, getReferralHistory);

export default router;
