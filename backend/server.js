const dotenv = require('dotenv');
const path = require('path');

// Load .env from the backend directory
dotenv.config({ path: path.join(__dirname, '.env') });

const dns = require('dns');
const fs = require('fs');

// Fix Node.js DNS resolver issue (Node 24+)
try {
  const servers = dns.getServers();
  if (!servers.length || servers.every(s => s === '127.0.0.1' || s === '::1')) {
    dns.setServers(['8.8.8.8', '8.8.4.4', '2001:4860:4860::8888']);
  }
} catch {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
}

console.log('Starting server...');

// ---------------- Firebase Setup ----------------
let firebaseInitialized = false;
let admin;

try {
  admin = require('firebase-admin');
  const defaultServiceAccountPath = path.join(__dirname, 'config', 'healio-bba24-firebase-adminsdk-fbsvc-b272baeefc.json');
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || defaultServiceAccountPath;

  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase initialized successfully!');
    firebaseInitialized = true;
  } else {
    console.warn(`⚠ Firebase config missing at ${serviceAccountPath}. Skipping Firebase.`);
  }
} catch (err) {
  console.warn('⚠ Firebase initialization failed:', err.message);
}

// ---------------- App & Services ----------------
const app = require('./src/app');
const connectDB = require('./src/database/connection');
const { startAllJobs } = require('./src/jobs/jobScheduler');
const logger = require('./src/utils/logger');

// ---------------- Server Start ----------------
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    logger.info('MongoDB connected successfully');

    // Verify Email Service (optional)
    try {
      const { verifyEmailConnection } = require('./src/services/email/emailService');
      const emailOk = await verifyEmailConnection();
      if (!emailOk) logger.warn('⚠ Email service unavailable — OTP emails will not be sent');
    } catch (emailErr) {
      logger.warn('⚠ Email service check failed:', emailErr.message);
    }

    // Start cron jobs
    try {
      startAllJobs();
      logger.info('Cron jobs started');
    } catch (jobErr) {
      logger.warn('⚠ Failed to start cron jobs:', jobErr.message);
    }

<<<<<<< HEAD
    // Start Express server
    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
      if (!firebaseInitialized) {
        logger.warn('⚠ Firebase is not running (missing config)');
      }
    });

    // Handle port conflict errors
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        logger.error(`Port ${PORT} is already in use. Attempting to retry...`);
        setTimeout(() => {
          server.close();
          server.listen(PORT);
        }, 1000);
      } else {
        logger.error('Server error:', err);
        process.exit(1);
      }
    });
  } catch (err) {
    logger.error('Server startup failed:', err);
=======
    const server = app.listen(PORT, () => {
      logger.info('Server running on port ' + PORT + ' in ' + process.env.NODE_ENV + ' mode');
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`Port ${PORT} is already in use. Stop the running server or set a different PORT.`);
        process.exit(1);
      }
      throw error;
    });
  } catch (error) {
    logger.error('Server startup failed:', error);
>>>>>>> rabail-dev
    process.exit(1);
  }
};


// Run server
startServer();