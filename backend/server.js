require('dotenv').config();

// Fix Node.js c-ares DNS resolver not finding system DNS servers (Node 24+)
const dns = require('dns');
try {
  const servers = dns.getServers();
  if (!servers.length || servers.every(s => s === '127.0.0.1' || s === '::1')) {
    dns.setServers(['8.8.8.8', '8.8.4.4', '2001:4860:4860::8888']);
  }
} catch {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
}

const admin = require('firebase-admin');
const serviceAccount = require('./config/healio-e75ef-firebase-adminsdk-fbsvc-2b167d9c17.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

console.log('Firebase configured successfully!');

const app = require('./src/app');
const connectDB = require('./src/database/connection');
const { startAllJobs } = require('./src/jobs/jobScheduler');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    logger.info('MongoDB connected successfully');

    startAllJobs();
    logger.info('Cron jobs started');

    app.listen(PORT, () => {
      logger.info('Server running on port ' + PORT + ' in ' + process.env.NODE_ENV + ' mode');
    });
  } catch (error) {
    logger.error('Server startup failed:', error);
    process.exit(1);
  }
};

startServer();
