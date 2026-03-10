const HealthInsight = require('../../models/HealthInsight');
const FitnessData = require('../../models/FitnessData');
const DietLog = require('../../models/DietLog');
const WaterIntake = require('../../models/WaterIntake');
const Medication = require('../../models/Medication');
const { getAIResponse } = require('./geminiService');
const logger = require('../../utils/logger');

/**
 * Gather a user's health data for the past `days` days.
 */
const gatherUserHealthData = async (userId, days = 7) => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);
  start.setHours(0, 0, 0, 0);

  const [fitness, diet, water, medications] = await Promise.all([
    FitnessData.find({ user: userId, date: { $gte: start, $lte: end } }).sort({ date: 1 }),
    DietLog.find({ user: userId, date: { $gte: start, $lte: end } }).sort({ date: 1 }),
    WaterIntake.find({ user: userId, date: { $gte: start, $lte: end } }).sort({ date: 1 }),
    Medication.find({ user: userId, isActive: true }),
  ]);

  const activeDays = fitness.length || 1;

  const avgSteps = Math.round(fitness.reduce((a, d) => a + (d.steps?.count || 0), 0) / activeDays);
  const avgSleep = +(fitness.reduce((a, d) => a + (d.sleep?.duration || 0), 0) / activeDays).toFixed(1);
  const avgCaloriesBurned = Math.round(fitness.reduce((a, d) => a + (d.calories?.burned || 0), 0) / activeDays);

  const totalMeals = diet.reduce((a, d) => a + (d.meals?.length || 0), 0);
  const avgCaloriesConsumed = diet.length
    ? Math.round(diet.reduce((a, d) => a + (d.totalCalories || 0), 0) / diet.length)
    : 0;

  const avgWater = water.length
    ? Math.round(water.reduce((a, d) => a + (d.totalAmount || 0), 0) / water.length)
    : 0;

  const adherenceRate = medications.length
    ? Math.round(medications.reduce((a, m) => a + m.adherenceRate, 0) / medications.length)
    : 100;

  return {
    avgSteps,
    avgSleep,
    avgCaloriesBurned,
    avgCaloriesConsumed,
    totalMeals,
    avgWater,
    adherenceRate,
    activeDays: fitness.length,
    dietDays: diet.length,
    medicationCount: medications.length,
    period: { start, end },
  };
};

/**
 * Detect low-activity patterns and return alerts.
 */
const detectLowActivityPatterns = (healthData) => {
  const alerts = [];

  if (healthData.avgSteps < 3000) {
    alerts.push({
      type: 'low_activity_alert',
      category: 'fitness',
      severity: 'warning',
      title: 'Low Physical Activity Detected',
      description: `Your average daily steps this week is ${healthData.avgSteps}. The recommended minimum is 7,000-10,000 steps per day. Consider taking short walks throughout the day.`,
    });
  }

  if (healthData.avgSleep > 0 && healthData.avgSleep < 6) {
    alerts.push({
      type: 'low_activity_alert',
      category: 'sleep',
      severity: 'warning',
      title: 'Insufficient Sleep Pattern',
      description: `You're averaging ${healthData.avgSleep} hours of sleep. Adults need 7-9 hours. Poor sleep affects immunity, weight, and mental health.`,
    });
  }

  if (healthData.avgWater > 0 && healthData.avgWater < 1500) {
    alerts.push({
      type: 'low_activity_alert',
      category: 'hydration',
      severity: 'warning',
      title: 'Low Water Intake',
      description: `Your average water intake is ${healthData.avgWater}ml. Aim for at least 2,000-2,500ml daily to stay properly hydrated.`,
    });
  }

  if (healthData.adherenceRate < 70 && healthData.medicationCount > 0) {
    alerts.push({
      type: 'low_activity_alert',
      category: 'medication',
      severity: 'critical',
      title: 'Medication Adherence Warning',
      description: `Your medication adherence is at ${healthData.adherenceRate}%. Consistent medication use is essential for treatment effectiveness. Set alarms and keep medications visible.`,
    });
  }

  return alerts;
};

/**
 * Use Gemini AI to generate personalised weekly health tips.
 */
const generateAITips = async (healthData) => {
  const prompt = `Based on this weekly health data, provide 3-5 personalised health tips as a JSON array. Each tip should have: title (short), description (2-3 sentences), category (one of: fitness, diet, sleep, hydration, medication, general), actionItems (array of 1-2 short action steps).

Weekly Health Summary:
- Average daily steps: ${healthData.avgSteps}
- Average sleep: ${healthData.avgSleep} hours
- Average calories burned: ${healthData.avgCaloriesBurned}
- Average calories consumed: ${healthData.avgCaloriesConsumed}
- Average water intake: ${healthData.avgWater}ml
- Medication adherence: ${healthData.adherenceRate}%
- Active tracking days: ${healthData.activeDays}/7
- Meals logged: ${healthData.totalMeals} (across ${healthData.dietDays} days)

Respond ONLY with a valid JSON array. No markdown, no explanation.`;

  try {
    const raw = await getAIResponse(prompt, [], 'health_analysis');
    const cleaned = raw.replace(/```json\n?|```\n?/g, '').trim();
    const tips = JSON.parse(cleaned);

    if (!Array.isArray(tips)) return [];

    return tips.slice(0, 5).map((tip) => ({
      type: 'weekly_tip',
      category: ['fitness', 'diet', 'sleep', 'hydration', 'medication', 'general'].includes(tip.category)
        ? tip.category
        : 'general',
      severity: 'info',
      title: String(tip.title || 'Health Tip').slice(0, 200),
      description: String(tip.description || ''),
      actionItems: Array.isArray(tip.actionItems)
        ? tip.actionItems.map((a) => ({ text: String(typeof a === 'string' ? a : a.text || '') }))
        : [],
    }));
  } catch (err) {
    logger.error('AI tips generation failed:', err.message);
    return getStaticFallbackTips(healthData);
  }
};

/**
 * Static fallback tips when AI is unavailable.
 */
const getStaticFallbackTips = (data) => {
  const tips = [];

  if (data.avgSteps < 7000) {
    tips.push({
      type: 'improvement_suggestion',
      category: 'fitness',
      severity: 'info',
      title: 'Increase Your Daily Steps',
      description: `You're averaging ${data.avgSteps} steps. Try adding a 15-minute walk after meals to boost your count.`,
      actionItems: [{ text: 'Take a 15-minute walk after lunch' }, { text: 'Use stairs instead of the elevator' }],
    });
  }

  if (data.avgCaloriesConsumed > 0 && data.avgCaloriesConsumed > 2500) {
    tips.push({
      type: 'improvement_suggestion',
      category: 'diet',
      severity: 'info',
      title: 'Watch Your Calorie Intake',
      description: `Your average daily calorie intake is ${data.avgCaloriesConsumed}. Consider balancing meals with more vegetables and lean protein.`,
      actionItems: [{ text: 'Replace one sugary snack with fruits' }],
    });
  }

  if (data.avgWater < 2000) {
    tips.push({
      type: 'improvement_suggestion',
      category: 'hydration',
      severity: 'info',
      title: 'Stay Hydrated',
      description: `Drinking at least 2L of water daily supports metabolism, digestion, and energy levels.`,
      actionItems: [{ text: 'Drink a glass of water before each meal' }],
    });
  }

  if (tips.length === 0) {
    tips.push({
      type: 'weekly_tip',
      category: 'general',
      severity: 'info',
      title: 'Keep Up the Good Work!',
      description: 'Your health metrics look good this week. Maintain consistency and track your progress daily.',
      actionItems: [{ text: 'Log your meals and activity daily' }],
    });
  }

  return tips;
};

/**
 * Generate and save weekly insights for a user.
 */
exports.generateWeeklyInsights = async (userId) => {
  const healthData = await gatherUserHealthData(userId, 7);

  // Low-activity alerts (rule-based)
  const alerts = detectLowActivityPatterns(healthData);

  // AI-powered weekly tips
  const tips = await generateAITips(healthData);

  const allInsights = [...alerts, ...tips];
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const saved = await Promise.all(
    allInsights.map((insight) =>
      HealthInsight.create({
        user: userId,
        ...insight,
        basedOn: {
          avgSteps: healthData.avgSteps,
          avgSleep: healthData.avgSleep,
          avgCalories: healthData.avgCaloriesConsumed,
          adherenceRate: healthData.adherenceRate,
          waterIntake: healthData.avgWater,
          period: healthData.period,
        },
        expiresAt,
      })
    )
  );

  return saved;
};

/**
 * Get existing insights for a user (for the API).
 */
exports.getUserInsights = async (userId, { type, page = 1, limit = 20 } = {}) => {
  const filter = { user: userId, isDismissed: false };
  if (type) filter.type = type;

  const total = await HealthInsight.countDocuments(filter);
  const insights = await HealthInsight.find(filter)
    .sort({ severity: -1, createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  return {
    insights,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
    summary: await gatherUserHealthData(userId, 7),
  };
};

/**
 * Get quick health summary for a user.
 */
exports.getHealthSummary = async (userId) => {
  return gatherUserHealthData(userId, 7);
};

module.exports = exports;
