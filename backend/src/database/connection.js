const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async (retryCount = 0) => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/healio';

    if (!process.env.MONGODB_URI) {
      logger.warn('MONGODB_URI is not set; falling back to local MongoDB at mongodb://127.0.0.1:27017/healio');
    }

    const conn = await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000, // Increased from 5000 to allow DNS resolution
      socketTimeoutMS: 45000,
      retryWrites: true,
      retryReads: true,
      // For MongoDB Atlas SRV records (DNS queries need time)
      connectTimeoutMS: 30000,
      family: 4, // Use IPv4 (more reliable than IPv6)
    });
    logger.info(`✅ MongoDB Connected: ${conn.connection.host}:${conn.connection.port}`);
    return conn;
  } catch (error) {
    const isTimeoutError = error.code === 'ETIMEOUT' || error.message.includes('ETIMEOUT') || error.message.includes('timeout');
    
    if (isTimeoutError && retryCount < 3) {
      logger.warn(`⚠️  MongoDB connection timeout (attempt ${retryCount + 1}/3). Retrying in 5 seconds...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      return connectDB(retryCount + 1);
    }

    logger.error('❌ MongoDB connection error:', error.message);
    logger.error('Troubleshooting steps:');
    logger.error('1. Check your internet connection');
    logger.error('2. Verify MONGODB_URI is correct in .env');
    logger.error('3. Check MongoDB Atlas cluster status: https://cloud.mongodb.com');
    logger.error('4. Ensure your IP address is whitelisted in MongoDB Atlas Network Access');
    logger.error('5. Try using "localhost" instead of connection string if running locally');
    
    process.exit(1);
  }
};

module.exports = connectDB;
