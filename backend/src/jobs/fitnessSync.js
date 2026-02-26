const User = require('../models/User');
const { syncFromGoogleFit } = require('../services/googleFit/syncService');
const logger = require('../utils/logger');

exports.run = async () => {
  const users = await User.find({ googleFitConnected: true, isActive: true });
  for (const user of users) {
    try { await syncFromGoogleFit(user._id); } catch (error) { logger.error('Fitness sync failed for user ' + user._id + ': ' + error.message); }
  }
};
