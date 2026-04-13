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
    const isDev = process.env.NODE_ENV === 'development';
    const user = await User.create({ name, email, password, phone, dateOfBirth, gender, isVerified: isDev });
    
    // In development mode, auto-login after registration (no OTP needed)
    if (isDev) {
      const tokens = generateTokens(user._id);
      user.refreshToken = tokens.refreshToken;
      user.lastLogin = new Date();
      user.otpCode = undefined;
      user.otpExpiry = undefined;
      await user.save();
      logger.info(`[DEV] User auto-logged in on registration: ${email}`);
      return res.status(201).json({ 
        success: true, 
        message: 'Registration successful! You are now logged in (dev mode).', 
        data: { user, ...tokens, isDev: true } 
      });
    }
    
    // Production mode: require OTP verification
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
    const message = otpSent 
      ? 'Registration successful. Please check your email for the verification code.' 
      : 'Account created, but we couldn\'t send the verification email. Please use "Resend Code" or contact support.';
    res.status(201).json({ success: true, message, data: responseData });
  } catch (error) { next(error); }
};

exports.login = async (req, res, next) => {
  try {
    const { identifier, email, password } = req.body;
    const loginId = (identifier || email || '').trim().toLowerCase();
    const isEmail = /^\S+@\S+\.\S+$/.test(loginId);
    const query = isEmail ? { email: loginId } : { phone: loginId };
    
    logger.info(`[LOGIN] Attempting login with: ${isEmail ? 'email' : 'phone'} = ${loginId}`);
    
    const user = await User.findOne(query).select('+password');
    if (!user) {
      logger.warn(`[LOGIN] User not found with query:`, query);
      return res.status(401).json({ success: false, message: 'Invalid credentials. Please check your email/phone and password.' });
    }
    
    logger.info(`[LOGIN] User found: ${user.email}, isVerified: ${user.isVerified}, isActive: ${user.isActive}`);
    
    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      logger.warn(`[LOGIN] Password mismatch for user: ${user.email}`);
      return res.status(401).json({ success: false, message: 'Invalid credentials. Please check your email/phone and password.' });
    }
    
    logger.info(`[LOGIN] Password correct for: ${user.email}`);
    
    if (!user.isVerified) {
      logger.warn(`[LOGIN] User not verified: ${user.email}`);
      return res.status(403).json({ success: false, message: 'Please verify your email before logging in.' });
    }
    
    if (!user.isActive) {
      logger.warn(`[LOGIN] User account deactivated: ${user.email}`);
      return res.status(403).json({ success: false, message: 'Account deactivated' });
    }
    
    const tokens = generateTokens(user._id);
    user.refreshToken = tokens.refreshToken;
    user.lastLogin = new Date();
    await user.save();
    
    logger.info(`[LOGIN] Login successful for: ${user.email}`);
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
    logger.info(`[GOOGLE AUTH] Received Google token and profile:`, { email: profile?.email, name: profile?.name });
    
    if (!googleToken || !profile) {
      logger.warn(`[GOOGLE AUTH] Missing googleToken or profile`);
      return res.status(400).json({ success: false, message: 'Google token and profile required' });
    }
    
    let user = await User.findOne({ email: profile.email });
    if (!user) {
      logger.info(`[GOOGLE AUTH] Creating new user from Google profile: ${profile.email}`);
      user = await User.create({ 
        name: profile.name, 
        email: profile.email, 
        password: require('crypto').randomBytes(16).toString('hex'), 
        isVerified: true, 
        profileImage: profile.photo || ''
      });
    } else {
      logger.info(`[GOOGLE AUTH] User exists, logging in: ${profile.email}`);
      // Ensure verified
      if (!user.isVerified) {
        user.isVerified = true;
        await user.save();
      }
    }
    
    const tokens = generateTokens(user._id);
    user.refreshToken = tokens.refreshToken;
    user.lastLogin = new Date();
    await user.save();
    
    logger.info(`[GOOGLE AUTH] Google login successful: ${user.email}`);
    res.json({ success: true, data: { user, ...tokens } });
  } catch (error) { 
    logger.error(`[GOOGLE AUTH] Error:`, error.message);
    next(error); 
  }
};

// Developer-only endpoint to verify a user by email (no OTP required)
// This is NOT a security risk in development mode
exports.devVerifyEmail = async (req, res, next) => {
  try {
    // Only available in development
    if (process.env.NODE_ENV !== 'development') {
      return res.status(403).json({ success: false, message: 'This endpoint is only available in development mode' });
    }
    
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
    
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpiry = undefined;
    await user.save();
    
    logger.info(`[DEV] User verified without OTP: ${email}`);
    res.json({ success: true, message: 'User verified successfully (dev mode)', data: { user } });
  } catch (error) { next(error); }
};

// Developer-only endpoint to check user status
exports.devCheckUser = async (req, res, next) => {
  try {
    // Only available in development
    if (process.env.NODE_ENV !== 'development') {
      return res.status(403).json({ success: false, message: 'This endpoint is only available in development mode' });
    }
    
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
    
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found in database' });
    
    res.json({ success: true, data: { 
      email: user.email, 
      name: user.name,
      isVerified: user.isVerified,
      isActive: user.isActive,
      hasPassword: !!user.password,
      createdAt: user.createdAt,
      message: `User exists. isVerified: ${user.isVerified}`
    }});
  } catch (error) { next(error); }
};

// Developer-only endpoint to reset password
exports.devResetPassword = async (req, res, next) => {
  try {
    // Only available in development
    if (process.env.NODE_ENV !== 'development') {
      return res.status(403).json({ success: false, message: 'This endpoint is only available in development mode' });
    }
    
    const { email, newPassword } = req.body;
    if (!email || !newPassword) return res.status(400).json({ success: false, message: 'Email and newPassword are required' });
    
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    user.password = newPassword;
    user.isVerified = true;
    await user.save();
    
    logger.info(`[DEV] Password reset for: ${email}`);
    res.json({ success: true, message: 'Password reset successfully (dev mode)', data: { email, message: 'Now you can login with the new password' } });
  } catch (error) { next(error); }
};
