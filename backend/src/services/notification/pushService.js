const admin = require('../../config/firebase');
const Notification = require('../../models/Notification');
const logger = require('../../utils/logger');

exports.sendPushNotification = async (fcmToken, { title, body, data }) => {
  try {
    await admin.messaging().send({ token: fcmToken, notification: { title, body }, data: data || {} });
    logger.info('Push notification sent: ' + title);
  } catch (error) { logger.error('Push notification failed:', error.message); }
};

exports.createAndSendNotification = async (userId, { title, body, type, data, priority = 'medium' }) => {
  const notification = await Notification.create({ user: userId, title, body, type, data, priority, channel: 'push' });
  const User = require('../../models/User');
  const user = await User.findById(userId);
  if (user?.fcmToken && user.notificationPreferences?.[type] !== false) {
    await exports.sendPushNotification(user.fcmToken, { title, body, data: { notificationId: notification._id.toString(), type, ...data } });
    notification.isSent = true;
    notification.sentAt = new Date();
    await notification.save();
  }
  return notification;
};

exports.sendBulkNotification = async (userIds, payload) => {
  const promises = userIds.map(id => exports.createAndSendNotification(id, payload));
  return Promise.allSettled(promises);
};
