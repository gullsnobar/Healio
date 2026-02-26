const User = require('../../models/User');

exports.getSettings = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('preferredLanguage notificationPreferences');
    res.json({ success: true, data: user });
  } catch (error) { next(error); }
};

exports.updateNotificationPreferences = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.userId, { notificationPreferences: req.body }, { new: true });
    res.json({ success: true, data: user.notificationPreferences });
  } catch (error) { next(error); }
};

exports.updateLanguage = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.userId, { preferredLanguage: req.body.language }, { new: true });
    res.json({ success: true, data: { language: user.preferredLanguage } });
  } catch (error) { next(error); }
};
