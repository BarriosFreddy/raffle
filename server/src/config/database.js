import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

export async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('Connected to MongoDB');
    mongoose.set('debug', true);
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

mongoose.connection.on('disconnected', () => {
  logger.warn('Lost MongoDB connection');
});

mongoose.connection.on('reconnected', () => {
  logger.info('Reconnected to MongoDB');
});