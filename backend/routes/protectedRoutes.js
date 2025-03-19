import express from 'express';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/admin-route', authenticateUser, authorizeRoles('admin'), (req, res) => {
    res.json({ message: 'Admin access granted' });
});

export default router;