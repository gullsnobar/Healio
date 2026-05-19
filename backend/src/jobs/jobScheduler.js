const cron = require('node-cron');
const appointmentReminder = require('./appointmentReminder');
const genericReminderJob = require('./genericReminderJob');
const missedDoseDetector = require('./missedDoseDetector');
const fitnessSync = require('./fitnessSync');
const reportGenerator = require('./weeklyReportGenerator');
const refillChecker = require('./refillChecker');
const dataCleanup = require('./dataCleanup');
const recommendationUpdater = require('./recommendationUpdater');
const healthScoreUpdater = require('./healthScoreUpdater');
const healthInsightGenerator = require('./healthInsightGenerator');
const dailyHealthSummary = require('./dailyHealthSummary');
const recurringReminderSpawner = require('./recurringReminderSpawner');
const { cleanupInvalidTokens } = require('../services/notification/pushService');
const logger = require('../utils/logger');

exports.startAllJobs = () => {
  const safeRun = (name, fn) => async () => {
    try { await fn(); logger.info(`${name} ran`); }
    catch (err) { logger.error(`${name} failed: ${err.message}`); }
  };

  cron.schedule('* * * * *', safeRun('Generic reminder job', genericReminderJob.run));
  cron.schedule('0 20 * * *', safeRun('Appointment reminder job', appointmentReminder.run));
  cron.schedule('0 */2 * * *', safeRun('Missed dose detector', missedDoseDetector.run));
  cron.schedule('0 */6 * * *', safeRun('Fitness sync', fitnessSync.run));
  cron.schedule('0 0 * * 1', safeRun('Weekly report generation', reportGenerator.run));
  cron.schedule('0 9 * * *', safeRun('Refill checker', refillChecker.run));
  cron.schedule('0 3 * * 0', safeRun('Data cleanup', dataCleanup.run));
  cron.schedule('0 8 * * *', safeRun('Recommendation updater', recommendationUpdater.run));
  cron.schedule('0 0 * * *', safeRun('Health score updater', healthScoreUpdater.run));
  // New jobs: AI health insights weekly, daily summary at 9 PM, recurring reminders at midnight
  cron.schedule('0 9 * * 1', safeRun('Weekly health insight generation', healthInsightGenerator.run));
  cron.schedule('0 21 * * *', safeRun('Daily health summary', dailyHealthSummary.run));
  cron.schedule('0 0 * * *', safeRun('Recurring reminder spawner', recurringReminderSpawner.run));
  // FCM token cleanup - run weekly on Sunday at 4 AM
  cron.schedule('0 4 * * 0', safeRun('FCM token cleanup', cleanupInvalidTokens));
  logger.info('All cron jobs scheduled');
};
