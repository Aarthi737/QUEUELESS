import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
} from '../controllers/authController.js';
import { getUserById } from '../controllers/userController.js';
import { getAdminUsers } from '../controllers/adminController.js';
import { protect, optionalProtect } from '../middleware/auth.js';

const router = express.Router();

// Public Authentication Routes
router.post('/register', register);
router.post('/login', login);

// Private User Profile Routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

// Admin / User Lookup Routes
router.get('/', optionalProtect, getAdminUsers);
router.get('/:id', protect, getUserById);

export default router;
