const User = require('../models/User');
const { generateWeeklyInsights } = require('../services/ai/healthInsightService');
const { notifyNewRecommendation } = require('../services/notification/notificationService');
const logger = require('../utils/logger');

/**
 * Weekly cron job – generates AI-powered health insights for all active users.
 * Scheduled: Every Monday at 9 AM via jobScheduler.
 */
exports.run = async () => {
  try {
    const users = await User.find({ isActive: true });
    let generated = 0;

    for (const user of users) {
      try {
        const insights = await generateWeeklyInsights(user._id);
        if (insights.length > 0) {
          generated += insights.length;
          // Notify user about new health insights
          await notifyNewRecommendation(user._id, {
            _id: insights[0]._id,
            title: `${insights.length} new health insights available`,
          });
        }
      } catch (err) {
        logger.error(`Health insight generation failed for user ${user._id}:`, err.message);
      }
    }

    logger.info(`Weekly health insights generated: ${generated} insights for ${users.length} users`);
  } catch (err) {
    logger.error('Weekly health insight job failed:', err.message);
  }
};
