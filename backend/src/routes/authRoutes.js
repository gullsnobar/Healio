const router = require('express').Router();
const { register, login, logout, refreshToken, forgotPassword, verifyOTP, resetPassword, googleAuth, resendOTP, getMe, devVerifyEmail, devCheckUser, devResetPassword } = require('../controllers/auth/authController');
const { authLimiter } = require('../middleware/rateLimiter');
const { validate } = require('../middleware/validation');
const { registerValidation, loginValidation } = require('../validators/authValidator');
const { authenticate } = require('../middleware/authentication');

router.post('/register', authLimiter, validate(registerValidation), register);
router.post('/login', authLimiter, validate(loginValidation), login);
router.get('/me', authenticate, getMe);
router.post('/logout', authenticate, logout);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', authLimiter, resendOTP);
router.post('/reset-password', resetPassword);
router.post('/google', googleAuth);

// Development-only routes
if (process.env.NODE_ENV === 'development') {
  router.post('/dev-verify-email', devVerifyEmail);
  router.post('/dev-check-user', devCheckUser);
  router.post('/dev-reset-password', devResetPassword);
}

module.exports = router;
