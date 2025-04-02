import express from 'express';
import {
  login,
  register,
  forgotPassword,
  resetPassword,
  verifyResetToken
} from '../controllers/authController.js';

import { authenticateUser, logoutUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/verify-reset/:token', verifyResetToken);
router.post('/logout', authenticateUser, logoutUser);

export default router;
