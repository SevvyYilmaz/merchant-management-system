import express from 'express';
import { getResiduals, createResidual, updateResidual, deleteResidual } from '../controllers/residualController.js';

const router = express.Router();

router.get('/', getResiduals);
router.post('/', createResidual);
router.put('/:id', updateResidual);
router.delete('/:id', deleteResidual);

export default router;