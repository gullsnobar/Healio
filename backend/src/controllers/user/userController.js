const User = require('../../models/User');

exports.getProfile = async (req, res, next) => {
  try { res.json({ success: true, data: req.user }); } catch (error) { next(error); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const allowed = ['name', 'phone', 'dateOfBirth', 'gender', 'bloodGroup', 'emergencyContact', 'healthConditions', 'allergies', 'preferredLanguage', 'notificationPreferences'];
    const updates = {};
    allowed.forEach(field => { if (req.body[field] !== undefined) updates[field] = req.body[field]; });
    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true, runValidators: true });
    res.json({ success: true, data: user });
  } catch (error) { next(error); }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('+password');
    if (!(await user.comparePassword(req.body.currentPassword))) return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    user.password = req.body.newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated' });
  } catch (error) { next(error); }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.userId, { isActive: false });
    res.json({ success: true, message: 'Account deactivated' });
  } catch (error) { next(error); }
};

exports.uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const user = await User.findByIdAndUpdate(req.userId, { profileImage: req.file.path }, { new: true });
    res.json({ success: true, data: { profileImage: user.profileImage } });
  } catch (error) { next(error); }
};
