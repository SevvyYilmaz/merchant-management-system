import express from 'express';
import {
  getMerchants,
  getMerchantById,     // ✅ newly added import
  createMerchant,
  updateMerchant,
  deleteMerchant
} from '../controllers/merchantController.js';

const router = express.Router();

// ⚠️ Order matters here! The route for fetching a single merchant by ID must come before the general get all merchants route to avoid conflicts.
// ✅ NEW - fetch a single merchant by ID
router.get('/:id', getMerchantById); // ✅ NEW - fetch a single merchant by ID

router.get('/', getMerchants);       // Get all merchants
router.post('/', createMerchant);    // Create merchant
router.put('/:id', updateMerchant);  // Update merchant
router.delete('/:id', deleteMerchant); // Delete merchant

export default router;
