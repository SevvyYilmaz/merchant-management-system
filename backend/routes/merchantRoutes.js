import express from 'express';
import {
  getMerchants,
  getMerchantById,
  createMerchant,
  updateMerchant,
  deleteMerchant
} from '../controllers/merchantController.js';

import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Protect all routes with token verification
router.use(authenticateUser);

// 📋 Get all merchants (Admins see all, users see assigned ones)
router.get('/', getMerchants);

// 📄 Get one merchant by ID
router.get('/:id', getMerchantById);

// ➕ Create new merchant (Admin only)
router.post('/', authorizeRoles('admin'), createMerchant);

// ✏️ Update merchant (Admin only)
router.put('/:id', authorizeRoles('admin'), updateMerchant);

// 🗑️ Delete merchant (Admin only)
router.delete('/:id', authorizeRoles('admin'), deleteMerchant);

export default router;
