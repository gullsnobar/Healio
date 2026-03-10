const User = require('../models/User');
const Medication = require('../models/Medication');
const FitnessData = require('../models/FitnessData');
const DietLog = require('../models/DietLog');
const WaterIntake = require('../models/WaterIntake');
const { createAndSendNotification } = require('../services/notification/pushService');
const logger = require('../utils/logger');

/**
 * Daily health summary notification – sent at 9 PM to each active user.
 * Summarises: medications taken, steps, calories, water intake.
 */
exports.run = async () => {
  try {
    const users = await User.find({ isActive: true, 'notificationPreferences.general': { $ne: false } });
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const endOfDay = new Date(); endOfDay.setHours(23, 59, 59, 999);

    for (const user of users) {
      try {
        const [medications, fitness, diet, water] = await Promise.all([
          Medication.find({ user: user._id, isActive: true }),
          FitnessData.findOne({ user: user._id, date: { $gte: today, $lte: endOfDay } }),
          DietLog.findOne({ user: user._id, date: { $gte: today, $lte: endOfDay } }),
          WaterIntake.findOne({ user: user._id, date: today }),
        ]);

        // Count taken doses today
        let totalDoses = 0;
        let takenDoses = 0;
        for (const med of medications) {
          totalDoses += med.times?.length || 1;
          const todayEntries = med.adherenceHistory.filter((h) => h.date >= today && h.status === 'taken');
          takenDoses += todayEntries.length;
        }

        const steps = fitness?.steps?.count || 0;
        const calories = diet?.totalCalories || 0;
        const waterMl = water?.totalAmount || 0;

        const lines = [];
        if (medications.length > 0) lines.push(`💊 Meds: ${takenDoses}/${totalDoses} taken`);
        lines.push(`🚶 Steps: ${steps.toLocaleString()}`);
        if (calories > 0) lines.push(`🍽️ Calories: ${calories} kcal`);
        if (waterMl > 0) lines.push(`💧 Water: ${waterMl}ml`);

        await createAndSendNotification(user._id, {
          title: 'Your Daily Health Summary',
          body: lines.join(' | '),
          type: 'system',
          data: { screen: 'Dashboard' },
          priority: 'low',
        });
      } catch (err) {
        logger.error(`Daily summary failed for user ${user._id}:`, err.message);
      }
    }

    logger.info('Daily health summary notifications sent');
  } catch (err) {
    logger.error('Daily health summary job failed:', err.message);
  }
};
