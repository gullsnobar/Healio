const { Reminder } = require('../models/Reminder');
const logger = require('../utils/logger');

/**
 * Recurring Reminder Spawner – runs daily at midnight.
 * For each repeating reminder (daily/weekly/monthly), creates tomorrow's
 * instance if one doesn't already exist, based on the repeat field.
 */
exports.run = async () => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);

    // Find all active recurring reminders whose latest date is today or earlier
    const recurring = await Reminder.find({
      isActive: true,
      repeat: { $in: ['daily', 'weekly', 'monthly'] },
      date: { $lte: new Date(today.getTime() + 86400000 - 1) },
    });

    let spawned = 0;

    for (const reminder of recurring) {
      try {
        const nextDate = getNextDate(reminder.date, reminder.repeat);
        if (!nextDate || nextDate < tomorrow) continue;

        // Check if next instance already exists
        const exists = await Reminder.findOne({
          user: reminder.user,
          sourceId: reminder.sourceId || reminder._id,
          time: reminder.time,
          date: {
            $gte: new Date(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate()),
            $lt: new Date(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate() + 1),
          },
        });

        if (exists) continue;

        // Spawn the next occurrence
        const newData = reminder.toObject();
        delete newData._id;
        delete newData.__v;
        delete newData.createdAt;
        delete newData.updatedAt;
        newData.date = nextDate;
        newData.isCompleted = false;
        newData.completedAt = null;
        newData.notificationSent = false;
        newData.snoozedUntil = null;

        await Reminder.create(newData);
        spawned++;
      } catch (err) {
        logger.error(`Failed to spawn recurring reminder ${reminder._id}:`, err.message);
      }
    }

    logger.info(`Recurring reminder spawner: created ${spawned} new reminders`);
  } catch (err) {
    logger.error('Recurring reminder spawner failed:', err.message);
  }
};

function getNextDate(currentDate, repeat) {
  const next = new Date(currentDate);
  switch (repeat) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      break;
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
    default:
      return null;
  }
  return next;
}
