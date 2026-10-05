import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db.js';
import { seedDatabase } from './config/seedData.js';
import { Queue } from './models/Queue.js';

// Import route modules
import userRoutes from './routes/userRoutes.js';
import queueRoutes from './routes/queueRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Import centralized error handlers
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend clients
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow browser requests matching allowed origins or mobile/tools with no origin
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Parse JSON request bodies
app.use(express.json());

// Server healthcheck endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'QueueLess API server is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

// Mount application REST routes
app.use('/api/auth', userRoutes);    // Authentication: login, register, me, profile
app.use('/api/users', userRoutes);   // User management
app.use('/api/queues', queueRoutes); // Queues: catalog, join, leave, live status, staff calls
app.use('/api/admin', adminRoutes);  // Admin: overview statistics, demo reset

// Centralized error handling
app.use(notFound);
app.use(errorHandler);

// Start server after connecting to MongoDB
const startServer = async () => {
  try {
    // 1. Connect to MongoDB database
    await connectDB();

    // 2. Automatically seed database if empty
    const queueCount = await Queue.countDocuments();
    if (queueCount === 0) {
      console.log('No queues detected. Automatically seeding initial data...');
      await seedDatabase();
    }

    // 3. Start Express HTTP listener
    const server = app.listen(PORT, () => {
      console.log(`QueueLess Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
    });

    // Graceful shutdown on termination
    const shutdown = () => {
      server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
