import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { demoDeposit, listLedger, listWallets } from './wallet.controller';

const router = Router();

router.get('/', authenticate, listWallets);
router.get('/ledger', authenticate, listLedger);
router.post('/deposit-demo', authenticate, demoDeposit);

export default router;
