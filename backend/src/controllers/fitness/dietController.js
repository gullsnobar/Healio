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
    await log.save();
    res.json({ success: true, data: log });
  } catch (error) { next(error); }
};
