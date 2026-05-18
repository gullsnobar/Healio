const admin = require('../../config/firebase');
const Notification = require('../../models/Notification');
const logger = require('../../utils/logger');

exports.sendPushNotification = async (fcmToken, { title, body, data }) => {
  try {
    await admin.messaging().send({ token: fcmToken, notification: { title, body }, data: data || {} });
    logger.info('Push notification sent: ' + title);
  } catch (error) {
    logger.error('Push notification failed:', {
      title,
      error: error.message,
      code: error.code,
      fcmToken: fcmToken ? fcmToken.substring(0, 20) + '...' : 'missing',
      fullError: error
    });
    
    // If token is invalid, return specific error code for cleanup
    if (error.code === 'messaging/registration-token-not-registered' || 
        error.code === 'messaging/invalid-registration-token') {
      throw new Error('INVALID_TOKEN');
    }
  }
};

exports.createAndSendNotification = async (userId, { title, body, type, data, priority = 'medium' }) => {
  const notification = await Notification.create({ user: userId, title, body, type, data, priority, channel: 'push' });
  const User = require('../../models/User');
  const user = await User.findById(userId);
  
  if (user?.fcmToken && user.notificationPreferences?.[type] !== false) {
    try {
      await exports.sendPushNotification(user.fcmToken, { title, body, data: { notificationId: notification._id.toString(), type, ...data } });
      notification.isSent = true;
      notification.sentAt = new Date();
      await notification.save();
    } catch (error) {
      // If token is invalid, remove it from user record
      if (error.message === 'INVALID_TOKEN') {
        logger.warn(`Removing invalid FCM token for user ${userId}`);
        user.fcmToken = null;
        await user.save();
      }
    }
  } else {
    logger.warn(`Cannot send notification to user ${userId}: ${user?.fcmToken ? 'notification disabled' : 'no FCM token'}`);
  }
  
  return notification;
};

exports.sendBulkNotification = async (userIds, payload) => {
  const promises = userIds.map(id => exports.createAndSendNotification(id, payload));
  return Promise.allSettled(promises);
};

// Cleanup invalid FCM tokens for users who haven't updated their token recently
exports.cleanupInvalidTokens = async () => {
  try {
    const User = require('../../models/User');
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    // Find users with old FCM tokens (older than 30 days)
    const usersWithOldTokens = await User.find({
      fcmToken: { $exists: true, $ne: null },
      tokenUpdatedAt: { $lt: thirtyDaysAgo }
    });
    
    logger.info(`Found ${usersWithOldTokens.length} users with potentially stale FCM tokens`);
    
    for (const user of usersWithOldTokens) {
      try {
        // Try to send a test notification to validate the token
        await admin.messaging().send({
          token: user.fcmToken,
          notification: { title: 'Token Validation', body: 'This is a test message' },
          data: { test: 'true' }
        });
      } catch (error) {
        if (error.code === 'messaging/registration-token-not-registered' || 
            error.code === 'messaging/invalid-registration-token') {
          logger.warn(`Removing stale FCM token for user ${user._id}`);
          user.fcmToken = null;
          await user.save();
        }
      }
    }
    
    logger.info('FCM token cleanup completed');
  } catch (error) {
    logger.error('FCM token cleanup failed:', error.message);
  }
};
