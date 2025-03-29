import express from 'express';
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userController.js';

const router = express.Router();

router.post('/', createUser);         // Admin: Create user
router.get('/', getUsers);           // Admin: Get all users
router.get('/:id', getUserById);     // Admin: Get single user
router.put('/:id', updateUser);      // Admin: Update user
router.delete('/:id', deleteUser);   // Admin: Delete user w/ reassignment logic

export default router;
