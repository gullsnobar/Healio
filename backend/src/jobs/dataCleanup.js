const Notification = require('../models/Notification');
const ChatHistory = require('../models/ChatHistory');
const ActivityLog = require('../models/ActivityLog');
const logger = require('../utils/logger');

exports.run = async () => {
  const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const ninetyDaysAgo = new Date(); ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  const [notifResult, chatResult, logResult] = await Promise.all([
    Notification.deleteMany({ isRead: true, createdAt: { $lt: thirtyDaysAgo } }),
    ChatHistory.deleteMany({ isActive: false, updatedAt: { $lt: ninetyDaysAgo } }),
    ActivityLog.deleteMany({ createdAt: { $lt: ninetyDaysAgo } }),
  ]);
  logger.info('Cleanup: ' + notifResult.deletedCount + ' notifications, ' + chatResult.deletedCount + ' chats, ' + logResult.deletedCount + ' logs');
};
