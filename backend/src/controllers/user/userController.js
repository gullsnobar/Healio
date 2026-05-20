const User = require('../../models/User');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select(
      'name email phone dateOfBirth gender bloodGroup profileImage emergencyContact ' +
      'healthConditions allergies preferredLanguage notificationPreferences privacySettings ' +
      'isVerified isActive googleFitConnected createdAt lastLogin'
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) { next(error); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const allowed = [
      'name', 'phone', 'dateOfBirth', 'gender', 'bloodGroup',
      'emergencyContact', 'healthConditions', 'allergies',
      'preferredLanguage', 'notificationPreferences', 'privacySettings',
    ];
    const updates = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    if (!Object.keys(updates).length) {
      return res.status(400).json({ success: false, message: 'No valid fields to update' });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select(
      'name email phone dateOfBirth gender bloodGroup profileImage emergencyContact ' +
      'healthConditions allergies preferredLanguage notificationPreferences privacySettings ' +
      'isVerified createdAt lastLogin'
    );

    res.json({ success: true, data: user, message: 'Profile updated successfully' });
  } catch (error) { next(error); }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Both currentPassword and newPassword are required' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters' });
    }
    const user = await User.findById(req.userId).select('+password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) { next(error); }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.userId, { isActive: false, refreshToken: null });
    res.json({ success: true, message: 'Account deactivated successfully' });
  } catch (error) { next(error); }
};

exports.uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const user = await User.findByIdAndUpdate(
      req.userId,
      { profileImage: req.file.path },
      { new: true }
    );
    res.json({ success: true, data: { profileImage: user.profileImage } });
  } catch (error) { next(error); }
};
