import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { getCurrentUser, getUserById, updateUser } from './users.controller';

const router = Router();

router.get('/me', authenticate, getCurrentUser);
router.get('/:id', getUserById);
router.patch('/:id', authenticate, updateUser);

export default router;
