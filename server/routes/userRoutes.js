import express from 'express';
import { getUserById } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:id', protect, getUserById);

export default router;
