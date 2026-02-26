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
