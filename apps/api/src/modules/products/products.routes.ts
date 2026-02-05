import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { importProduct, getFeed } from './products.controller';

const router = Router();

router.post('/import', authenticate, importProduct);
router.get('/feed', getFeed); // Public endpoint

export default router;
