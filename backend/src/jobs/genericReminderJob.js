const reminderService = require('../services/reminder/reminderService');
const {
  notifyMedicationReminder,
  notifyAppointmentReminder,
  notifyLabReminder,
} = require('../services/notification/notificationService');
const logger = require('../utils/logger');

/**
 * Generic reminder job – checks the unified Reminder collection for
 * due notifications and dispatches type-specific push notifications.
 */
exports.run = async () => {
  try {
    const dueReminders = await reminderService.getDueReminders();

    for (const reminder of dueReminders) {
      const user = reminder.user;

      try {
        switch (reminder.reminderType) {
          case 'medication':
            await notifyMedicationReminder(user._id, {
              _id: reminder.sourceId || reminder._id,
              name: reminder.medicationName || reminder.title,
              dosage: reminder.dosage || '',
            }, reminder.time);
            break;

          case 'appointment':
            await notifyAppointmentReminder(user._id, {
              _id: reminder.sourceId || reminder._id,
              doctorName: reminder.doctorName || '',
            });
            break;

          case 'lab':
            await notifyLabReminder(user._id, {
              _id: reminder.sourceId || reminder._id,
              title: reminder.title,
              labName: reminder.labName || '',
              testName: reminder.testName || '',
            });
            break;

          default:
            logger.warn(`Unknown reminder type: ${reminder.reminderType}`);
        }

        // Stamp notification as sent so we don't re-fire
        reminder.notificationSent = true;
        await reminder.save();
      } catch (notifErr) {
        logger.error('Failed to send reminder notification', {
          reminderId: reminder._id,
          error: notifErr.message,
        });
      }
    }

    logger.info(`Generic reminder job processed ${dueReminders.length} reminders`);
  } catch (err) {
    logger.error('Generic reminder job failed', { error: err.message });
  }
};
