import express from 'express';
import {
  getAdminOverview,
  getAdminUsers,
  resetDemoData,
} from '../controllers/adminController.js';
import { protect, optionalProtect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/overview', optionalProtect, getAdminOverview);
router.get('/users', optionalProtect, getAdminUsers);
router.post('/reset-demo', resetDemoData);

export default router;
