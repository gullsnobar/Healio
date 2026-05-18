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
  cron.schedule('* * * * *', () => { genericReminderJob.run(); logger.info('Generic reminder job ran'); });
  cron.schedule('0 20 * * *', () => { appointmentReminder.run(); logger.info('Appointment reminder job ran'); });
  cron.schedule('0 */2 * * *', () => { missedDoseDetector.run(); logger.info('Missed dose detector ran'); });
  cron.schedule('0 */6 * * *', () => { fitnessSync.run(); logger.info('Fitness sync ran'); });
  cron.schedule('0 0 * * 1', () => { reportGenerator.run(); logger.info('Weekly report generation ran'); });
  cron.schedule('0 9 * * *', () => { refillChecker.run(); logger.info('Refill checker ran'); });
  cron.schedule('0 3 * * 0', () => { dataCleanup.run(); logger.info('Data cleanup ran'); });
  cron.schedule('0 8 * * *', () => { recommendationUpdater.run(); logger.info('Recommendation updater ran'); });
  cron.schedule('0 0 * * *', () => { healthScoreUpdater.run(); logger.info('Health score updater ran'); });
  // New jobs: AI health insights weekly, daily summary at 9 PM, recurring reminders at midnight
  cron.schedule('0 9 * * 1', () => { healthInsightGenerator.run(); logger.info('Weekly health insight generation ran'); });
  cron.schedule('0 21 * * *', () => { dailyHealthSummary.run(); logger.info('Daily health summary sent'); });
  cron.schedule('0 0 * * *', () => { recurringReminderSpawner.run(); logger.info('Recurring reminder spawner ran'); });
  // FCM token cleanup - run weekly on Sunday at 4 AM
  cron.schedule('0 4 * * 0', () => { cleanupInvalidTokens(); logger.info('FCM token cleanup ran'); });
  logger.info('All cron jobs scheduled');
};
