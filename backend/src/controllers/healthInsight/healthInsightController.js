const HealthInsight = require('../../models/HealthInsight');
const { getUserInsights, generateWeeklyInsights, getHealthSummary } = require('../../services/ai/healthInsightService');

/**
 * @desc   Get all health insights for the current user
 * @route  GET /api/health-insights
 */
exports.getInsights = async (req, res, next) => {
  try {
    const { type, page, limit } = req.query;
    const result = await getUserInsights(req.userId, { type, page, limit });
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

/**
 * @desc   Generate fresh weekly insights on demand
 * @route  POST /api/health-insights/generate
 */
exports.generateInsights = async (req, res, next) => {
  try {
    const insights = await generateWeeklyInsights(req.userId);
    res.status(201).json({ success: true, data: insights, message: `${insights.length} insights generated` });
  } catch (error) { next(error); }
};

/**
 * @desc   Get quick health summary with metrics
 * @route  GET /api/health-insights/summary
 */
exports.getSummary = async (req, res, next) => {
  try {
    const summary = await getHealthSummary(req.userId);
    res.json({ success: true, data: summary });
  } catch (error) { next(error); }
};

/**
 * @desc   Mark an insight as read
 * @route  PATCH /api/health-insights/:id/read
 */
exports.markAsRead = async (req, res, next) => {
  try {
    await HealthInsight.findOneAndUpdate({ _id: req.params.id, user: req.userId }, { isRead: true });
    res.json({ success: true, message: 'Marked as read' });
  } catch (error) { next(error); }
};

/**
 * @desc   Dismiss an insight
 * @route  PATCH /api/health-insights/:id/dismiss
 */
exports.dismissInsight = async (req, res, next) => {
  try {
    await HealthInsight.findOneAndUpdate({ _id: req.params.id, user: req.userId }, { isDismissed: true });
    res.json({ success: true, message: 'Insight dismissed' });
  } catch (error) { next(error); }
};

/**
 * @desc   Complete an action item within an insight
 * @route  PATCH /api/health-insights/:id/action/:actionIndex
 */
exports.completeAction = async (req, res, next) => {
  try {
    const insight = await HealthInsight.findOne({ _id: req.params.id, user: req.userId });
    if (!insight) return res.status(404).json({ success: false, message: 'Insight not found' });
    const idx = Number(req.params.actionIndex);
    if (insight.actionItems[idx]) {
      insight.actionItems[idx].isCompleted = true;
      await insight.save();
    }
    res.json({ success: true, data: insight });
  } catch (error) { next(error); }
};
