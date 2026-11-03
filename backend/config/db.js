/**
 * Database Connection Configuration
 * Supports PostgreSQL / Supabase, and optional MongoDB fallback.
 */
const logger = require('../utils/logger');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    logger.info('No MONGO_URI specified. Operating with Supabase as primary database.');
    return null;
  }

  try {
    const mongoose = require('mongoose');
    const connection = await mongoose.connect(mongoUri);
    logger.info(`MongoDB Connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    logger.warn(`Optional MongoDB connection skipped: ${error.message}`);
    return null;
  }
};

module.exports = connectDB;
