const morgan = require('morgan');
const winstonLogger = require('../utils/logger');

const requestLogger = morgan('combined', {
  stream: { write: (message) => winstonLogger.info(message.trim()) },
});

const activityLogger = (module) => (req, res, next) => {
  const original = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode < 400 && req.userId) {
      const ActivityLog = require('../models/ActivityLog');
      ActivityLog.create({ user: req.userId, action: req.method + ' ' + req.originalUrl, module, ipAddress: req.ip, userAgent: req.get('user-agent') }).catch(() => {});
    }
    return original(body);
  };
  next();
};

module.exports = { requestLogger, activityLogger };
