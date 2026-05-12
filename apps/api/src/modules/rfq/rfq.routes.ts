import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import {
    awardBid,
    createBid,
    createRFQ,
    getRFQById,
    listMyRFQs,
    listRFQs,
} from './rfq.controller';

const router = Router();

router.get('/', authenticate, listRFQs);
router.post('/', authenticate, createRFQ);
router.post('/create', authenticate, createRFQ);
router.get('/my', authenticate, listMyRFQs);
router.get('/:id', authenticate, getRFQById);
router.post('/:id/bids', authenticate, createBid);
router.post('/:id/award', authenticate, awardBid);

export default router;
