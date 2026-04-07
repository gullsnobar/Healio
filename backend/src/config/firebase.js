const admin = require('firebase-admin');
const logger = require('../utils/logger');

// Load Firebase service account from JSON file
const serviceAccount = require('../../config/healio-bba24-firebase-adminsdk-fbsvc-b272baeefc.json');

if (admin.apps.length) {
  logger.info('Firebase Admin already initialized');
} else {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  logger.info('Firebase Admin initialized from service account file');
}

module.exports = admin;
