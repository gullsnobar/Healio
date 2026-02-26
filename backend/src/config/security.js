module.exports = {
  jwt: { secret: process.env.JWT_SECRET, expire: process.env.JWT_EXPIRE || '30m', refreshSecret: process.env.JWT_REFRESH_SECRET, refreshExpire: process.env.JWT_REFRESH_EXPIRE || '7d' },
  bcrypt: { saltRounds: 10 },
  rateLimit: { windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, max: process.env.RATE_LIMIT_MAX_REQUESTS || 100 },
  encryption: { key: process.env.ENCRYPTION_KEY, algorithm: 'aes-256-cbc' },
};
