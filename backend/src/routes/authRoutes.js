const router = require('express').Router();
const { register, login, logout, refreshToken, forgotPassword, verifyOTP, resetPassword, googleAuth } = require('../controllers/auth/authController');
const { authLimiter } = require('../middleware/rateLimiter');
const { validate } = require('../middleware/validation');
const { registerValidation, loginValidation } = require('../validators/authValidator');
const { authenticate } = require('../middleware/authentication');

router.post('/register', authLimiter, validate(registerValidation), register);
router.post('/login', authLimiter, validate(loginValidation), login);
router.post('/logout', authenticate, logout);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);
router.post('/google', googleAuth);

module.exports = router;
