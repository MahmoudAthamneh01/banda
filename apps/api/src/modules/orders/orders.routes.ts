import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import {
    confirmReceipt,
    createOrder,
    getOrderById,
    listOrders,
    shipOrder,
} from './orders.controller';

const router = Router();

router.get('/', authenticate, listOrders);
router.post('/', authenticate, createOrder);
router.get('/:id', authenticate, getOrderById);
router.post('/:id/ship', authenticate, shipOrder);
router.post('/:id/confirm-receipt', authenticate, confirmReceipt);

export default router;
