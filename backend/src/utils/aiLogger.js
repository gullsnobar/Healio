/**
 * LOGGER UTILITY
 * Centralized logging for all AI services
 * Includes timestamps, severity levels, and structured logging
 */

const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log levels
const LOG_LEVELS = {
  ERROR: '❌ ERROR',
  WARN: '⚠️ WARN',
  INFO: 'ℹ️ INFO',
  DEBUG: '🔍 DEBUG',
  SUCCESS: '✅ SUCCESS',
};

/**
 * Get formatted timestamp
 */
const getTimestamp = () => {
  return new Date().toISOString();
};

/**
 * Format log message
 */
const formatMessage = (level, message, data = null) => {
  const timestamp = getTimestamp();
  let logMessage = `[${timestamp}] ${level} - ${message}`;

  if (data) {
    logMessage += ` | ${JSON.stringify(data)}`;
  }

  return logMessage;
};

/**
 * Write to console with color
 */
const logToConsole = (level, message, data = null) => {
  const formattedMessage = formatMessage(level, message, data);
  console.log(formattedMessage);
};

/**
 * Write to file
 */
const logToFile = (level, message, data = null) => {
  try {
    const formattedMessage = formatMessage(level, message, data);
    const logFile = path.join(logsDir, 'ai-services.log');

    fs.appendFileSync(logFile, formattedMessage + '\n');
  } catch (error) {
    console.error('Failed to write to log file:', error.message);
  }
};

/**
 * ERROR level logging
 */
const error = (message, data = null) => {
  logToConsole(LOG_LEVELS.ERROR, message, data);
  logToFile(LOG_LEVELS.ERROR, message, data);
};

/**
 * WARNING level logging
 */
const warn = (message, data = null) => {
  logToConsole(LOG_LEVELS.WARN, message, data);
  logToFile(LOG_LEVELS.WARN, message, data);
};

/**
 * INFO level logging
 */
const info = (message, data = null) => {
  logToConsole(LOG_LEVELS.INFO, message, data);
  logToFile(LOG_LEVELS.INFO, message, data);
};

/**
 * DEBUG level logging
 */
const debug = (message, data = null) => {
  if (process.env.DEBUG === 'true') {
    logToConsole(LOG_LEVELS.DEBUG, message, data);
    logToFile(LOG_LEVELS.DEBUG, message, data);
  }
};

/**
 * SUCCESS level logging
 */
const success = (message, data = null) => {
  logToConsole(LOG_LEVELS.SUCCESS, message, data);
  logToFile(LOG_LEVELS.SUCCESS, message, data);
};

/**
 * Log API request
 */
const logRequest = (method, path, userId = 'anonymous', data = null) => {
  info(`[API] ${method} ${path}`, { userId, ...data });
};

/**
 * Log API response
 */
const logResponse = (status, message, data = null) => {
  const level = status >= 400 ? LOG_LEVELS.WARN : LOG_LEVELS.SUCCESS;
  logToConsole(level, `[Response] Status ${status}: ${message}`, data);
  logToFile(level, `[Response] Status ${status}: ${message}`, data);
};

module.exports = {
  error,
  warn,
  info,
  debug,
  success,
  logRequest,
  logResponse,
  LOG_LEVELS,
};
