const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { success: false, message: 'Too many auth attempts' } });
const apiLimiter = rateLimit({ windowMs: 60 * 1000, max: 30, message: { success: false, message: 'API rate limit exceeded' } });

module.exports = { rateLimiter, authLimiter, apiLimiter };
