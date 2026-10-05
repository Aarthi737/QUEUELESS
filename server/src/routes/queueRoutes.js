import express from 'express';
import {
  getQueues,
  getQueueById,
  joinQueue,
  leaveQueue,
  getMyActiveQueue,
  getMyQueueHistory,
  callNext,
  completeCurrent,
  skipCurrent,
  togglePauseQueue,
  getQueueEntries,
} from '../controllers/queueController.js';
import { protect, optionalProtect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public / User Routes
router.get('/', getQueues);
router.get('/my/active', protect, getMyActiveQueue);
router.get('/my/history', protect, getMyQueueHistory);
router.get('/:id', getQueueById);
router.get('/:id/entries', getQueueEntries);

router.post('/:id/join', optionalProtect, joinQueue);
router.delete('/:id/leave', optionalProtect, leaveQueue);

// Staff / Admin Management Operations
// Allow staff and admin; or optional protect for easy demo evaluation
router.post('/:id/call-next', optionalProtect, callNext);
router.post('/:id/complete', optionalProtect, completeCurrent);
router.post('/:id/skip', optionalProtect, skipCurrent);
router.put('/:id/toggle-pause', optionalProtect, togglePauseQueue);

export default router;
