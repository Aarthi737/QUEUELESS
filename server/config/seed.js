import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './db.js';
import { seedDatabase } from './seedData.js';

dotenv.config();

const runSeed = async () => {
  try {
    await connectDB();
    await seedDatabase();
    console.log('Standalone seed complete.');
    process.exit(0);
  } catch (error) {
    console.error('Seed script error:', error);
    process.exit(1);
  }
};

runSeed();
