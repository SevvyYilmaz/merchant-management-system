import express from 'express';
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userController.js';

const router = express.Router();

// 🛠 Admin Routes for User Management
router.post('/', createUser);           // Admin: Create user
router.get('/', getUsers);              // Admin: Get all users
router.get('/:id', getUserById);        // Admin: Get single user
router.put('/:id', updateUser);         // Admin: Update user

// 🔁 Delete user with optional reassignment
// → Must include `reassignToUserId` in body if user has merchants
router.delete('/:id', deleteUser);

export default router;
