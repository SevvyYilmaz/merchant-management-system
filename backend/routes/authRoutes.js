import express from 'express';
import { login, register, forgotPassword } from '../controllers/authController.js';
import { authenticateUser, logoutUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.post('/logout', authenticateUser, logoutUser); // ✅ New logout route

export default router;
