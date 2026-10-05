import { Queue } from '../models/Queue.js';
import { Entry } from '../models/Entry.js';
import { User } from '../models/User.js';
import { seedDatabase } from '../config/seedData.js';

// @desc    Get admin overview statistics
// @route   GET /api/admin/overview
// @access  Private (Admin)
export const getAdminOverview = async (req, res, next) => {
  try {
    const totalQueues = await Queue.countDocuments();
    const activeQueues = await Queue.countDocuments({ status: 'Active' });

    const totalServedEntries = await Entry.countDocuments({ status: 'Completed' });
    const peopleServed = 124 + totalServedEntries; // baseline 124 + completed records

    const queues = await Queue.find();
    const totalWaiting = queues.reduce((sum, q) => sum + (q.peopleWaiting || 0), 0);
    const avgWaitTime = Math.round(
      queues.reduce((sum, q) => sum + (q.estimatedWait || 0), 0) / (queues.length || 1)
    );

    const totalUsers = await User.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        activeQueues,
        totalQueues,
        peopleServed,
        peopleWaiting: totalWaiting,
        averageWaitTime: avgWaitTime,
        totalUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered users for admin
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAdminUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset database to default seed state
// @route   POST /api/admin/reset-demo
// @access  Public / Admin
export const resetDemoData = async (req, res, next) => {
  try {
    await seedDatabase();

    res.status(200).json({
      success: true,
      message: 'Demo database successfully reset to clean initial state.',
    });
  } catch (error) {
    next(error);
  }
};
