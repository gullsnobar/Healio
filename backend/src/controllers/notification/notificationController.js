const Notification = require('../../models/Notification');
const User = require('../../models/User');

exports.getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 30, unread } = req.query;
    const filter = { user: req.userId };
    if (unread === 'true') filter.isRead = false;
    const notifications = await Notification.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    const total = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({ user: req.userId, isRead: false });
    res.json({ success: true, data: { notifications, unreadCount, pagination: { page: Number(page), limit: Number(limit), total } } });
  } catch (error) { next(error); }
};

exports.markAsRead = async (req, res, next) => {
  try {
    await Notification.findOneAndUpdate({ _id: req.params.id, user: req.userId }, { isRead: true, readAt: new Date() });
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) { next(error); }
};

exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ user: req.userId, isRead: false }, { isRead: true, readAt: new Date() });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) { next(error); }
};

exports.deleteNotification = async (req, res, next) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, user: req.userId });
    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) { next(error); }
};

exports.updatePreferences = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.userId, { notificationPreferences: req.body }, { new: true });
    res.json({ success: true, data: user.notificationPreferences });
  } catch (error) { next(error); }
};
