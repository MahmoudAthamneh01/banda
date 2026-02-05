import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { createRFQ, listMyRFQs } from './rfq.controller';

const router = Router();

router.post('/create', authenticate, createRFQ);
router.get('/my', authenticate, listMyRFQs);

export default router;
