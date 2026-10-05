import { Queue } from '../models/Queue.js';
import { QueueEntry } from '../models/QueueEntry.js';

// @desc    Get all queues / services
// @route   GET /api/queues
// @access  Public
export const getQueues = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const queues = await Queue.find(query).sort({ name: 1 });

    // Sync live waiting counts from QueueEntry for each queue
    const formattedQueues = await Promise.all(
      queues.map(async (q) => {
        const liveWaiting = await QueueEntry.countDocuments({
          queueId: q._id,
          status: 'Waiting',
        });

        // Use live count if entries exist, else retain seed/current count
        const peopleWaiting = liveWaiting > 0 ? liveWaiting : q.peopleWaiting;
        const estimatedWait = peopleWaiting * q.avgWaitPerPerson;

        return {
          id: q._id.toString(),
          _id: q._id,
          name: q.name,
          department: q.department,
          category: q.category,
          codePrefix: q.codePrefix,
          currentServing: q.currentServing,
          currentNumber: q.currentNumber,
          peopleWaiting,
          avgWaitPerPerson: q.avgWaitPerPerson,
          estimatedWait,
          location: q.location,
          operatingHours: q.operatingHours,
          counterNumber: q.counterNumber,
          status: q.status,
          description: q.description,
          isEmergency: q.isEmergency,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: formattedQueues.length,
      data: formattedQueues,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single queue by ID
// @route   GET /api/queues/:id
// @access  Public
export const getQueueById = async (req, res, next) => {
  try {
    const queue = await Queue.findById(req.params.id);

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: 'Queue not found',
      });
    }

    const liveWaiting = await QueueEntry.countDocuments({
      queueId: queue._id,
      status: 'Waiting',
    });

    const peopleWaiting = liveWaiting > 0 ? liveWaiting : queue.peopleWaiting;
    const estimatedWait = peopleWaiting * queue.avgWaitPerPerson;

    res.status(200).json({
      success: true,
      data: {
        id: queue._id.toString(),
        _id: queue._id,
        name: queue.name,
        department: queue.department,
        category: queue.category,
        codePrefix: queue.codePrefix,
        currentServing: queue.currentServing,
        currentNumber: queue.currentNumber,
        peopleWaiting,
        avgWaitPerPerson: queue.avgWaitPerPerson,
        estimatedWait,
        location: queue.location,
        operatingHours: queue.operatingHours,
        counterNumber: queue.counterNumber,
        status: queue.status,
        description: queue.description,
        isEmergency: queue.isEmergency,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Join a queue and generate digital token
// @route   POST /api/queues/:id/join
// @access  Public (Optional Auth)
export const joinQueue = async (req, res, next) => {
  try {
    const queue = await Queue.findById(req.params.id);

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: 'Queue not found',
      });
    }

    if (queue.status === 'Paused') {
      return res.status(400).json({
        success: false,
        message: 'This queue is temporarily paused. Please check back shortly.',
      });
    }

    if (queue.status === 'Closed') {
      return res.status(400).json({
        success: false,
        message: 'This queue is currently closed.',
      });
    }

    const userId = req.user ? req.user._id : null;
    const customerName =
      (req.body.customerName || (req.user ? req.user.name : '') || 'Guest Visitor').trim();
    const customerPhone =
      (req.body.customerPhone || (req.user ? req.user.phone : '') || '').trim();
    const notes = (req.body.notes || '').trim();

    // Check if authenticated user already has an active waiting token in this queue
    if (userId) {
      const activeInQueue = await QueueEntry.findOne({
        queueId: queue._id,
        userId,
        status: { $in: ['Waiting', 'Now Serving'] },
      });

      if (activeInQueue) {
        return res.status(409).json({
          success: false,
          message: `You already hold an active token (#${activeInQueue.tokenNumber}) in this queue.`,
          data: activeInQueue,
        });
      }
    }

    // Determine the next token index
    // Look for highest token index in this queue
    const highestEntry = await QueueEntry.findOne({ queueId: queue._id })
      .sort({ tokenIndex: -1 })
      .select('tokenIndex');

    let nextNumber;
    if (highestEntry && highestEntry.tokenIndex >= queue.currentNumber) {
      nextNumber = highestEntry.tokenIndex + 1;
    } else {
      nextNumber = queue.currentNumber + (queue.peopleWaiting || 0) + 1;
    }

    const tokenNumber = `${queue.codePrefix}${nextNumber < 10 ? '0' + nextNumber : nextNumber}`;

    // Calculate people ahead
    const peopleAhead = await QueueEntry.countDocuments({
      queueId: queue._id,
      status: 'Waiting',
    });

    const estimatedWait = peopleAhead * queue.avgWaitPerPerson;

    // Create the QueueEntry
    const entry = await QueueEntry.create({
      queueId: queue._id,
      userId,
      customerName,
      customerPhone,
      tokenNumber,
      tokenIndex: nextNumber,
      notes: notes || `Token for ${queue.department}`,
      status: 'Waiting',
      joinedAt: new Date(),
    });

    // Update queue document metrics
    queue.peopleWaiting = peopleAhead + 1;
    queue.estimatedWait = (peopleAhead + 1) * queue.avgWaitPerPerson;
    await queue.save();

    res.status(201).json({
      success: true,
      message: `Successfully joined the queue! Token: ${tokenNumber}`,
      data: {
        id: entry._id.toString(),
        _id: entry._id,
        tokenNumber,
        tokenIndex: nextNumber,
        serviceId: queue._id.toString(),
        serviceName: queue.name,
        department: queue.department,
        category: queue.category,
        location: queue.location,
        counterNumber: queue.counterNumber,
        status: 'Waiting',
        issuedAt: 'Just now',
        peopleAhead,
        estimatedWait,
        currentServing: queue.currentServing,
        notes: entry.notes,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Leave queue / Cancel active token
// @route   DELETE /api/queues/:id/leave
// @access  Public (Optional Auth)
export const leaveQueue = async (req, res, next) => {
  try {
    const queue = await Queue.findById(req.params.id);
    if (!queue) {
      return res.status(404).json({
        success: false,
        message: 'Queue not found',
      });
    }

    let entry = null;

    // If entryId passed directly in body
    if (req.body.entryId) {
      entry = await QueueEntry.findById(req.body.entryId);
    } else if (req.user) {
      // Find user's active entry in this queue
      entry = await QueueEntry.findOne({
        queueId: queue._id,
        userId: req.user._id,
        status: { $in: ['Waiting', 'Now Serving'] },
      });
    } else if (req.body.tokenNumber) {
      // Find by tokenNumber
      entry = await QueueEntry.findOne({
        queueId: queue._id,
        tokenNumber: req.body.tokenNumber,
        status: { $in: ['Waiting', 'Now Serving'] },
      });
    }

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Active queue entry not found to leave',
      });
    }

    entry.status = 'Cancelled';
    entry.completedAt = new Date();
    await entry.save();

    // Decrement people waiting count
    const remainingWaiting = await QueueEntry.countDocuments({
      queueId: queue._id,
      status: 'Waiting',
    });

    queue.peopleWaiting = remainingWaiting;
    queue.estimatedWait = remainingWaiting * queue.avgWaitPerPerson;
    await queue.save();

    res.status(200).json({
      success: true,
      message: 'You have left the queue.',
      data: entry,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's active queue token
// @route   GET /api/queues/my/active
// @access  Private
export const getMyActiveQueue = async (req, res, next) => {
  try {
    const entry = await QueueEntry.findOne({
      userId: req.user._id,
      status: { $in: ['Waiting', 'Now Serving'] },
    })
      .sort({ createdAt: -1 })
      .populate('queueId');

    if (!entry || !entry.queueId) {
      return res.status(200).json({
        success: true,
        data: null,
      });
    }

    const queue = entry.queueId;

    // Recalculate people ahead in real time
    let peopleAhead = 0;
    let estimatedWait = 0;

    if (entry.status === 'Waiting') {
      peopleAhead = await QueueEntry.countDocuments({
        queueId: queue._id,
        status: 'Waiting',
        tokenIndex: { $lt: entry.tokenIndex },
      });
      estimatedWait = peopleAhead * queue.avgWaitPerPerson;
    }

    res.status(200).json({
      success: true,
      data: {
        id: entry._id.toString(),
        _id: entry._id,
        tokenNumber: entry.tokenNumber,
        tokenIndex: entry.tokenIndex,
        serviceId: queue._id.toString(),
        serviceName: queue.name,
        department: queue.department,
        category: queue.category,
        location: queue.location,
        counterNumber: queue.counterNumber,
        status: entry.status,
        issuedAt: new Date(entry.joinedAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        peopleAhead,
        estimatedWait,
        currentServing: queue.currentServing,
        notes: entry.notes,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's queue history
// @route   GET /api/queues/my/history
// @access  Private
export const getMyQueueHistory = async (req, res, next) => {
  try {
    const entries = await QueueEntry.find({
      userId: req.user._id,
      status: { $in: ['Completed', 'Cancelled'] },
    })
      .sort({ createdAt: -1 })
      .populate('queueId');

    const formattedHistory = entries.map((item) => {
      const q = item.queueId || {};
      const dateFormatted = new Date(item.completedAt || item.createdAt).toLocaleDateString(
        'en-US',
        {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }
      );

      return {
        id: item._id.toString(),
        _id: item._id,
        tokenNumber: item.tokenNumber,
        serviceName: q.name || 'Service Desk',
        department: q.department || 'General',
        category: q.category || 'Services',
        status: item.status,
        date: dateFormatted,
        counter: q.counterNumber || 'Counter',
        waitTime: item.status === 'Cancelled' ? 'Cancelled by user' : '15 min',
      };
    });

    res.status(200).json({
      success: true,
      count: formattedHistory.length,
      data: formattedHistory,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Staff: Call next token in queue
// @route   POST /api/queues/:id/call-next
// @access  Private (Staff/Admin)
export const callNext = async (req, res, next) => {
  try {
    const queue = await Queue.findById(req.params.id);
    if (!queue) {
      return res.status(404).json({
        success: false,
        message: 'Queue not found',
      });
    }

    // 1. Mark existing 'Now Serving' entry as 'Completed'
    await QueueEntry.updateMany(
      {
        queueId: queue._id,
        status: 'Now Serving',
      },
      {
        $set: {
          status: 'Completed',
          completedAt: new Date(),
        },
      }
    );

    // 2. Increment queue currentNumber
    const nextNum = queue.currentNumber + 1;
    const nextTokenStr = `${queue.codePrefix}${nextNum < 10 ? '0' + nextNum : nextNum}`;

    // 3. Find if any active waiting entry matches this next token
    let nextEntry = await QueueEntry.findOne({
      queueId: queue._id,
      status: 'Waiting',
      tokenIndex: nextNum,
    });

    // If no exact tokenIndex match, find the earliest waiting entry
    if (!nextEntry) {
      nextEntry = await QueueEntry.findOne({
        queueId: queue._id,
        status: 'Waiting',
      }).sort({ tokenIndex: 1 });
    }

    if (nextEntry) {
      nextEntry.status = 'Now Serving';
      nextEntry.servedAt = new Date();
      await nextEntry.save();
    }

    // 4. Update Queue state
    queue.currentNumber = nextNum;
    queue.currentServing = nextTokenStr;

    const remainingWaiting = await QueueEntry.countDocuments({
      queueId: queue._id,
      status: 'Waiting',
    });

    queue.peopleWaiting = Math.max(0, remainingWaiting);
    queue.estimatedWait = queue.peopleWaiting * queue.avgWaitPerPerson;
    await queue.save();

    res.status(200).json({
      success: true,
      message: `Now serving: ${nextTokenStr}`,
      data: {
        currentServing: nextTokenStr,
        currentNumber: nextNum,
        peopleWaiting: queue.peopleWaiting,
        estimatedWait: queue.estimatedWait,
        servedEntry: nextEntry,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Staff: Complete current serving token
// @route   POST /api/queues/:id/complete
// @access  Private (Staff/Admin)
export const completeCurrent = async (req, res, next) => {
  try {
    const queue = await Queue.findById(req.params.id);
    if (!queue) {
      return res.status(404).json({
        success: false,
        message: 'Queue not found',
      });
    }

    await QueueEntry.updateMany(
      {
        queueId: queue._id,
        status: 'Now Serving',
      },
      {
        $set: {
          status: 'Completed',
          completedAt: new Date(),
        },
      }
    );

    // After completing, call next token
    return callNext(req, res, next);
  } catch (error) {
    next(error);
  }
};

// @desc    Staff: Skip current token
// @route   POST /api/queues/:id/skip
// @access  Private (Staff/Admin)
export const skipCurrent = async (req, res, next) => {
  try {
    const queue = await Queue.findById(req.params.id);
    if (!queue) {
      return res.status(404).json({
        success: false,
        message: 'Queue not found',
      });
    }

    await QueueEntry.updateMany(
      {
        queueId: queue._id,
        status: 'Now Serving',
      },
      {
        $set: {
          status: 'Skipped',
          completedAt: new Date(),
        },
      }
    );

    // Call next token
    return callNext(req, res, next);
  } catch (error) {
    next(error);
  }
};

// @desc    Staff: Toggle Pause / Resume queue
// @route   PUT /api/queues/:id/toggle-pause
// @access  Private (Staff/Admin)
export const togglePauseQueue = async (req, res, next) => {
  try {
    const queue = await Queue.findById(req.params.id);
    if (!queue) {
      return res.status(404).json({
        success: false,
        message: 'Queue not found',
      });
    }

    queue.status = queue.status === 'Active' ? 'Paused' : 'Active';
    await queue.save();

    res.status(200).json({
      success: true,
      message: `Queue status changed to ${queue.status}`,
      data: queue,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get upcoming tokens list for staff console
// @route   GET /api/queues/:id/entries
// @access  Public
export const getQueueEntries = async (req, res, next) => {
  try {
    const queue = await Queue.findById(req.params.id);
    if (!queue) {
      return res.status(404).json({
        success: false,
        message: 'Queue not found',
      });
    }

    const realEntries = await QueueEntry.find({
      queueId: queue._id,
      status: { $in: ['Now Serving', 'Waiting'] },
    }).sort({ tokenIndex: 1 });

    // Generate upcoming list for staff view
    const list = [];
    const prefix = queue.codePrefix;
    const currentNum = queue.currentNumber;

    for (let i = 0; i <= 6; i++) {
      const num = currentNum + i;
      const token = `${prefix}${num < 10 ? '0' + num : num}`;
      const matched = realEntries.find((e) => e.tokenIndex === num);

      list.push({
        token,
        number: num,
        status: i === 0 ? 'Now Serving' : matched ? matched.status : 'Waiting',
        waitTime: i * queue.avgWaitPerPerson,
        entry: matched || null,
      });
    }

    res.status(200).json({
      success: true,
      data: list,
    });
  } catch (error) {
    next(error);
  }
};
