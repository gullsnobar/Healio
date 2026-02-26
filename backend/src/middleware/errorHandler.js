const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack, path: req.path, method: req.method });

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({ field: e.path, message: e.message }));
    return res.status(400).json({ success: false, message: 'Validation error', errors });
  }
  if (err.name === 'CastError') return res.status(400).json({ success: false, message: 'Invalid ID format' });
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({ success: false, message: field + ' already exists' });
  }
  if (err.name === 'JsonWebTokenError') return res.status(401).json({ success: false, message: 'Invalid token' });

  res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Internal server error' });
};

module.exports = errorHandler;
