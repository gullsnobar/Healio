const DietLog = require('../../models/DietLog');

exports.getDietLogs = async (req, res, next) => {
  try {
    const date = req.query.date ? new Date(req.query.date) : new Date();
    date.setHours(0,0,0,0);
    const endDate = new Date(date); endDate.setHours(23,59,59,999);
    const log = await DietLog.findOne({ user: req.userId, date: { $gte: date, $lte: endDate } });
    res.json({ success: true, data: log || { meals: [], totalCalories: 0 } });
  } catch (error) { next(error); }
};

exports.addDietEntry = async (req, res, next) => {
  try {
    const today = new Date(); today.setHours(0,0,0,0);
    let log = await DietLog.findOne({ user: req.userId, date: today });
    if (!log) log = new DietLog({ user: req.userId, date: today });
    log.meals.push(req.body);
    log.totalCalories = log.meals.reduce((a, m) => a + (m.totalCalories || 0), 0);
    log.totalProtein = log.meals.reduce((a, m) => a + (m.items?.reduce((s, i) => s + (i.protein || 0), 0) || 0), 0);
    log.totalCarbs = log.meals.reduce((a, m) => a + (m.items?.reduce((s, i) => s + (i.carbs || 0), 0) || 0), 0);
    log.totalFat = log.meals.reduce((a, m) => a + (m.items?.reduce((s, i) => s + (i.fat || 0), 0) || 0), 0);
    await log.save();
    res.json({ success: true, data: log });
  } catch (error) { next(error); }
};

/**
 * @desc   Get meal history for a date range
 * @route  GET /api/fitness/diet/history
 */
exports.getMealHistory = async (req, res, next) => {
  try {
    const { startDate, endDate, page = 1, limit = 14 } = req.query;
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(end.getTime() - 14 * 86400000);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const logs = await DietLog.find({ user: req.userId, date: { $gte: start, $lte: end } })
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await DietLog.countDocuments({ user: req.userId, date: { $gte: start, $lte: end } });

    const avgCalories = logs.length
      ? Math.round(logs.reduce((a, l) => a + l.totalCalories, 0) / logs.length)
      : 0;

    res.json({
      success: true,
      data: {
        logs,
        stats: { avgCalories, totalDays: logs.length },
        pagination: { page: Number(page), limit: Number(limit), total },
      },
    });
  } catch (error) { next(error); }
};

/**
 * @desc   Delete a meal entry from today's diet log
 * @route  DELETE /api/fitness/diet/:mealId
 */
exports.deleteMealEntry = async (req, res, next) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const log = await DietLog.findOne({ user: req.userId, date: today });
    if (!log) return res.status(404).json({ success: false, message: 'No diet log for today' });

    log.meals = log.meals.filter((m) => m._id.toString() !== req.params.mealId);
    log.totalCalories = log.meals.reduce((a, m) => a + (m.totalCalories || 0), 0);
    log.totalProtein = log.meals.reduce((a, m) => a + (m.items?.reduce((s, i) => s + (i.protein || 0), 0) || 0), 0);
    log.totalCarbs = log.meals.reduce((a, m) => a + (m.items?.reduce((s, i) => s + (i.carbs || 0), 0) || 0), 0);
    log.totalFat = log.meals.reduce((a, m) => a + (m.items?.reduce((s, i) => s + (i.fat || 0), 0) || 0), 0);
    await log.save();
    res.json({ success: true, data: log });
  } catch (error) { next(error); }
};
