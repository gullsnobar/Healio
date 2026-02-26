const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const { sendOTPEmail } = require('../../services/email/emailService');
const logger = require('../../utils/logger');

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '30m' });
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' });
  return { accessToken, refreshToken };
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, dateOfBirth, gender } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ success: false, message: 'Email already registered' });
    const user = await User.create({ name, email, password, phone, dateOfBirth, gender });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpCode = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    await sendOTPEmail(email, otp);
    res.status(201).json({ success: true, message: 'Registration successful. Please verify your email.', data: { userId: user._id } });
  } catch (error) { next(error); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ success: false, message: 'Invalid email or password' });
    if (!user.isActive) return res.status(403).json({ success: false, message: 'Account deactivated' });
    const tokens = generateTokens(user._id);
    user.refreshToken = tokens.refreshToken;
    user.lastLogin = new Date();
    await user.save();
    res.json({ success: true, data: { user, ...tokens } });
  } catch (error) { next(error); }
};

exports.logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.userId, { refreshToken: null });
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) { next(error); }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ success: false, message: 'Refresh token required' });
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    const tokens = generateTokens(user._id);
    user.refreshToken = tokens.refreshToken;
    await user.save();
    res.json({ success: true, data: tokens });
  } catch (error) { next(error); }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ success: false, message: 'Email not found' });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpCode = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    await sendOTPEmail(user.email, otp);
    res.json({ success: true, message: 'OTP sent to your email' });
  } catch (error) { next(error); }
};

exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email, otpCode: otp, otpExpiry: { $gt: new Date() } });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpiry = undefined;
    await user.save();
    res.json({ success: true, message: 'OTP verified successfully' });
  } catch (error) { next(error); }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, isVerified: true });
    if (!user) return res.status(400).json({ success: false, message: 'Please verify OTP first' });
    user.password = password;
    await user.save();
    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) { next(error); }
};

exports.googleAuth = async (req, res, next) => {
  try {
    const { googleToken, profile } = req.body;
    let user = await User.findOne({ email: profile.email });
    if (!user) user = await User.create({ name: profile.name, email: profile.email, password: require('crypto').randomBytes(16).toString('hex'), isVerified: true, profileImage: profile.photo });
    const tokens = generateTokens(user._id);
    user.refreshToken = tokens.refreshToken;
    user.lastLogin = new Date();
    await user.save();
    res.json({ success: true, data: { user, ...tokens } });
  } catch (error) { next(error); }
};
