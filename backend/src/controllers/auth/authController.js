const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const { sendOTPEmail, isEmailReady } = require('../../services/email/emailService');
const logger = require('../../utils/logger');

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '30m' });
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' });
  return { accessToken, refreshToken };
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, dateOfBirth, gender } = req.body;
    // DEV MODE: delete any existing account so re-registration is always allowed
    await User.deleteOne({ email });
    const user = await User.create({ name, email, password, phone, dateOfBirth, gender });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpCode = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    let otpSent = false;
    try {
      await sendOTPEmail(email, otp);
      otpSent = true;
    } catch (emailErr) {
      logger.warn('Could not send OTP email: ' + emailErr.message + '. OTP for ' + email + ': ' + otp);
    }
    const responseData = { userId: user._id, otpSent };
    if (!otpSent) responseData.emailIssue = true;
    res.status(201).json({ success: true, message: otpSent ? 'Registration successful. Please check your email for the verification code.' : 'Account created, but we couldn\'t send the verification email. Please use "Resend Code" or contact support.', data: responseData });
  } catch (error) { next(error); }
};

exports.login = async (req, res, next) => {
  try {
    const { identifier, email, password } = req.body;
    const loginId = (identifier || email || '').trim().toLowerCase();
    const isEmail = /^\S+@\S+\.\S+$/.test(loginId);
    const query = isEmail ? { email: loginId } : { phone: loginId };
    const user = await User.findOne(query).select('+password');
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ success: false, message: 'Invalid credentials. Please check your email/phone and password.' });
    if (!user.isVerified) return res.status(403).json({ success: false, message: 'Please verify your email before logging in.' });
    if (!user.isActive) return res.status(403).json({ success: false, message: 'Account deactivated' });
    const tokens = generateTokens(user._id);
    user.refreshToken = tokens.refreshToken;
    user.lastLogin = new Date();
    await user.save();
    res.json({ success: true, data: { user, ...tokens } });
  } catch (error) { next(error); }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    res.json({ success: true, data: { user } });
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
    let otpSent = false;
    try {
      await sendOTPEmail(user.email, otp);
      otpSent = true;
    } catch (emailErr) {
      logger.warn('Could not send OTP email: ' + emailErr.message + '. OTP for ' + user.email + ': ' + otp);
    }
    const responseData = { otpSent };
    if (!otpSent) responseData.emailIssue = true;
    res.json({ success: true, message: otpSent ? 'Verification code sent to your email.' : 'Could not send the verification email. Please try again later or contact support.', data: responseData });
  } catch (error) { next(error); }
};

exports.resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'Email not found' });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpCode = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    let otpSent = false;
    try {
      await sendOTPEmail(email, otp);
      otpSent = true;
    } catch (emailErr) {
      logger.warn('Could not send OTP email: ' + emailErr.message + '. OTP for ' + email + ': ' + otp);
    }
    const responseData = { otpSent };
    if (!otpSent) responseData.emailIssue = true;
    res.json({ success: true, message: otpSent ? 'Verification code resent successfully.' : 'Could not resend the verification email. Please try again later.', data: responseData });
  } catch (error) { next(error); }
};

exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp, mode } = req.body;
    // In development mode, accept "123456" as a universal test OTP
    const isDev = process.env.NODE_ENV === 'development';
    let user;
    if (isDev && otp === '123456') {
      user = await User.findOne({ email });
    } else {
      user = await User.findOne({ email, otpCode: otp, otpExpiry: { $gt: new Date() } });
    }
    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // For registration flow, auto-login by returning tokens
    if (mode !== 'reset') {
      const tokens = generateTokens(user._id);
      user.refreshToken = tokens.refreshToken;
      user.lastLogin = new Date();
      await user.save();
      // user is a mongoose document, so res.json() will call user.toJSON() automatically
      return res.json({ success: true, message: 'Email verified successfully', data: { user, ...tokens } });
    }

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
