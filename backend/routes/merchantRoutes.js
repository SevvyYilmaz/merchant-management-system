import express from 'express';
import { getMerchants, createMerchant, updateMerchant, deleteMerchant } from '../controllers/merchantController.js';

const router = express.Router();

router.get('/', getMerchants);
router.post('/', createMerchant);
router.put('/:id', updateMerchant);
router.delete('/:id', deleteMerchant);

export default router;