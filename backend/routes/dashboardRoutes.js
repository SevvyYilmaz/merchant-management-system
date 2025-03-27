// backend/routes/dashboardRoutes.js
import express from 'express';
import { getAdminDashboardStats } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/stats', getAdminDashboardStats);

export default router;
