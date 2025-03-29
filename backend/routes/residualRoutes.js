import express from 'express';
import {
  createResidual,
  getResidualsByMerchant,
  getResidualsByMonth,
  updateResidual,
  deleteResidual
} from '../controllers/residualController.js';

const router = express.Router();

router.post('/', createResidual);
router.get('/merchant/:merchantId', getResidualsByMerchant);
router.get('/month/:month', getResidualsByMonth);
router.put('/:id', updateResidual);
router.delete('/:id', deleteResidual);

export default router;
