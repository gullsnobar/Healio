const cron = require('node-cron');
const medicationReminder = require('./medicationReminder');
const appointmentReminder = require('./appointmentReminder');
const missedDoseDetector = require('./missedDoseDetector');
const fitnessSync = require('./fitnessSync');
const reportGenerator = require('./weeklyReportGenerator');
const refillChecker = require('./refillChecker');
const dataCleanup = require('./dataCleanup');
const recommendationUpdater = require('./recommendationUpdater');
const healthScoreUpdater = require('./healthScoreUpdater');
const logger = require('../utils/logger');

exports.startAllJobs = () => {
  cron.schedule('*/15 * * * *', () => { medicationReminder.run(); logger.info('Medication reminder job ran'); });
  cron.schedule('0 20 * * *', () => { appointmentReminder.run(); logger.info('Appointment reminder job ran'); });
  cron.schedule('0 */2 * * *', () => { missedDoseDetector.run(); logger.info('Missed dose detector ran'); });
  cron.schedule('0 */6 * * *', () => { fitnessSync.run(); logger.info('Fitness sync ran'); });
  cron.schedule('0 0 * * 1', () => { reportGenerator.run(); logger.info('Weekly report generation ran'); });
  cron.schedule('0 9 * * *', () => { refillChecker.run(); logger.info('Refill checker ran'); });
  cron.schedule('0 3 * * 0', () => { dataCleanup.run(); logger.info('Data cleanup ran'); });
  cron.schedule('0 8 * * *', () => { recommendationUpdater.run(); logger.info('Recommendation updater ran'); });
  cron.schedule('0 0 * * *', () => { healthScoreUpdater.run(); logger.info('Health score updater ran'); });
  logger.info('All cron jobs scheduled');
};
