import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('API is working!');
});

// Import other route files
import authRoutes from './authRoutes.js';
import merchantRoutes from './merchantRoutes.js';
import userRoutes from './userRoutes.js';
import deviceRoutes from './deviceRoutes.js';
import residualRoutes from './residualRoutes.js';

console.log("✅ Routes Loaded: /auth, /merchants, /users, /devices, /residuals");


router.use('/auth', authRoutes);
router.use('/merchants', merchantRoutes);
router.use('/users', userRoutes);
router.use('/devices', deviceRoutes);
router.use('/residuals', residualRoutes);

export default router;
