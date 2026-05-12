import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import {
    createProduct,
    getFeed,
    getProductById,
    importProduct,
    listProducts,
    updateProduct,
} from './products.controller';

const router = Router();

router.get('/', listProducts);
router.get('/feed', getFeed); // Public endpoint
router.get('/:id', getProductById);
router.post('/', authenticate, createProduct);
router.patch('/:id', authenticate, updateProduct);
router.post('/import', authenticate, importProduct);

export default router;
