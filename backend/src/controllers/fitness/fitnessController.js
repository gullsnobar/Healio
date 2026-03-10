const FitnessData = require('../../models/FitnessData');
const { syncFromGoogleFit } = require('../../services/googleFit/syncService');

exports.getFitnessData = async (req, res, next) => {
  try {
    const { date, startDate, endDate } = req.query;
    const filter = { user: req.userId };
    if (date) { const d = new Date(date); filter.date = { $gte: new Date(d.setHours(0,0,0,0)), $lte: new Date(d.setHours(23,59,59,999)) }; }
    else if (startDate && endDate) filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    const data = await FitnessData.find(filter).sort({ date: -1 });
    res.json({ success: true, data });
  } catch (error) { next(error); }
};

exports.syncGoogleFit = async (req, res, next) => {
  try {
    const data = await syncFromGoogleFit(req.userId);
    res.json({ success: true, data, message: 'Google Fit data synced' });
  } catch (error) { next(error); }
};

exports.addManualEntry = async (req, res, next) => {
  try {
    const today = new Date(); today.setHours(0,0,0,0);
    const data = await FitnessData.findOneAndUpdate({ user: req.userId, date: today }, { $set: { ...req.body, source: 'manual' } }, { new: true, upsert: true });
    res.json({ success: true, data });
  } catch (error) { next(error); }
};

exports.getWeeklyStats = async (req, res, next) => {
  try {
    const end = new Date(); const start = new Date(); start.setDate(end.getDate() - 7);
    const data = await FitnessData.find({ user: req.userId, date: { $gte: start, $lte: end } }).sort({ date: 1 });
    const stats = { avgSteps: 0, avgSleep: 0, totalCalories: 0, days: data.length };
    if (data.length) {
      stats.avgSteps = Math.round(data.reduce((a, d) => a + (d.steps?.count || 0), 0) / data.length);
      stats.avgSleep = Math.round(data.reduce((a, d) => a + (d.sleep?.duration || 0), 0) / data.length);
      stats.totalCalories = data.reduce((a, d) => a + (d.calories?.burned || 0), 0);
    }
    res.json({ success: true, data: { stats, daily: data } });
  } catch (error) { next(error); }
};

exports.getMonthlyStats = async (req, res, next) => {
  try {
    const end = new Date(); const start = new Date(); start.setDate(end.getDate() - 30);
    const data = await FitnessData.find({ user: req.userId, date: { $gte: start, $lte: end } }).sort({ date: 1 });
    res.json({ success: true, data });
  } catch (error) { next(error); }
};

/**
 * @desc   Log an exercise activity
 * @route  POST /api/fitness/exercise
 */
exports.logExercise = async (req, res, next) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    let data = await FitnessData.findOne({ user: req.userId, date: today });
    if (!data) data = new FitnessData({ user: req.userId, date: today, source: 'manual' });
    const { type, duration, calories, startTime, endTime } = req.body;
    data.exercise.push({ type, duration, calories, startTime, endTime });
    // Accumulate exercise calories into daily burned calories
    data.calories.burned = (data.calories.burned || 0) + (calories || 0);
    await data.save();
    res.json({ success: true, data });
  } catch (error) { next(error); }
};

/**
 * @desc   Update fitness goals (steps, calories, sleep, water)
 * @route  PUT /api/fitness/goals
 */
exports.updateFitnessGoals = async (req, res, next) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const updates = {};
    if (req.body.stepsGoal != null) updates['steps.goal'] = Number(req.body.stepsGoal);
    if (req.body.caloriesGoal != null) updates['calories.goal'] = Number(req.body.caloriesGoal);
    const data = await FitnessData.findOneAndUpdate(
      { user: req.userId, date: today },
      { $set: updates },
      { new: true, upsert: true }
    );
    res.json({ success: true, data });
  } catch (error) { next(error); }
};

/**
 * @desc   Get weekly chart data (formatted for Chart.js / react-native-chart-kit)
 * @route  GET /api/fitness/stats/weekly-chart
 */
exports.getWeeklyChartData = async (req, res, next) => {
  try {
    const end = new Date(); const start = new Date(); start.setDate(end.getDate() - 6);
    start.setHours(0, 0, 0, 0); end.setHours(23, 59, 59, 999);
    const data = await FitnessData.find({ user: req.userId, date: { $gte: start, $lte: end } }).sort({ date: 1 });
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const labels = [];
    const steps = [];
    const calories = [];
    const sleep = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(start); d.setDate(start.getDate() + i);
      labels.push(dayNames[d.getDay()]);
      const entry = data.find((e) => {
        const ed = new Date(e.date);
        return ed.getFullYear() === d.getFullYear() && ed.getMonth() === d.getMonth() && ed.getDate() === d.getDate();
      });
      steps.push(entry?.steps?.count || 0);
      calories.push(entry?.calories?.burned || 0);
      sleep.push(entry?.sleep?.duration || 0);
    }

    res.json({
      success: true,
      data: {
        labels,
        steps: { data: steps, label: 'Steps' },
        calories: { data: calories, label: 'Calories Burned' },
        sleep: { data: sleep, label: 'Sleep (hrs)' },
      },
    });
  } catch (error) { next(error); }
};
