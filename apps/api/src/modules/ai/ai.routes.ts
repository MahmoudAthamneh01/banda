import { Router } from 'express';
import { chat, listConversations } from './ai.controller';

const router = Router();

router.post('/chat', chat);
router.get('/conversations', listConversations);

export default router;
