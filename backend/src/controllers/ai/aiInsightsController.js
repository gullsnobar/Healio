// ──────────────────────────────────────────────────────────
// HEALIO — AI Health-Insights Controller
// Processes requests for the /api/ai/* endpoints.
// ──────────────────────────────────────────────────────────

const { aggregate } = require('../../services/ai/healthDataAggregator');
const { evaluate, buildDailySummary, buildWeeklyFeedback } = require('../../services/ai/ruleEngine');
const Recommendation = require('../../models/Recommendation');
const logger = require('../../utils/logger');

/**
 * GET /api/ai/health-insights
 * Main endpoint — returns personalized AI recommendations,
 * daily summary, and weekly activity feedback in one call.
 */
exports.getHealthInsights = async (req, res, next) => {
  try {
    const userId = req.userId;
    const days = Math.min(Math.max(Number(req.query.days) || 7, 1), 30);

    // 1. Aggregate all health data
    const healthData = await aggregate(userId, days);

    // 2. Run rule engine
    const recommendations = evaluate(healthData);

    // 3. Build daily summary
    const dailySummary = buildDailySummary(healthData);

    // 4. Build weekly activity feedback
    const weeklyFeedback = buildWeeklyFeedback(healthData);

    // 5. Persist high-priority recommendations (avoid duplicates in the last 24 h)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const saved = [];
    for (const rec of recommendations.filter((r) => r.priority === 'high')) {
      const exists = await Recommendation.findOne({
        user: userId,
        title: rec.title,
        createdAt: { $gte: oneDayAgo },
      });
      if (!exists) {
        const doc = await Recommendation.create({
          user: userId,
          type: rec.type,
          title: rec.title,
          description: rec.description,
          priority: rec.priority,
          source: 'system',
          basedOn: rec.basedOn,
          actionItems: rec.actionItems,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        saved.push(doc);
      }
    }

    res.json({
      success: true,
      data: {
        recommendations,
        dailySummary,
        weeklyFeedback,
        savedCount: saved.length,
        aggregatedData: {
          period: healthData.period,
          activeDays: healthData.activeDays,
          dietDays: healthData.dietDays,
          medicationCount: healthData.medicationCount,
        },
      },
    });
  } catch (error) {
    logger.error('AI health-insights error:', error);
    next(error);
  }
};

/**
 * GET /api/ai/daily-summary
 * Lightweight endpoint – just today's numbers and score.
 */
exports.getDailySummary = async (req, res, next) => {
  try {
    const healthData = await aggregate(req.userId, 1);
    const dailySummary = buildDailySummary(healthData);
    res.json({ success: true, data: dailySummary });
  } catch (error) {
    logger.error('AI daily-summary error:', error);
    next(error);
  }
};

/**
 * GET /api/ai/weekly-feedback
 * Returns activity feedback for the last 7 days.
 */
exports.getWeeklyFeedback = async (req, res, next) => {
  try {
    const healthData = await aggregate(req.userId, 7);
    const weeklyFeedback = buildWeeklyFeedback(healthData);
    res.json({ success: true, data: { weeklyFeedback, period: healthData.period } });
  } catch (error) {
    logger.error('AI weekly-feedback error:', error);
    next(error);
  }
};

/**
 * GET /api/ai/medication-alerts
 * Returns only medication-related insights.
 */
exports.getMedicationAlerts = async (req, res, next) => {
  try {
    const healthData = await aggregate(req.userId, 7);
    const all = evaluate(healthData);
    const alerts = all.filter((r) => r.category === 'medication');
    res.json({ success: true, data: alerts });
  } catch (error) {
    logger.error('AI medication-alerts error:', error);
    next(error);
  }
};
