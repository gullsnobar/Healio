const WaterIntake = require('../../models/WaterIntake');

exports.getWaterIntake = async (req, res, next) => {
  try {
    const date = req.query.date ? new Date(req.query.date) : new Date();
    date.setHours(0,0,0,0);
    const water = await WaterIntake.findOne({ user: req.userId, date }) || { entries: [], totalAmount: 0, goal: 2500 };
    res.json({ success: true, data: water });
  } catch (error) { next(error); }
};

exports.addWaterEntry = async (req, res, next) => {
  try {
    const today = new Date(); today.setHours(0,0,0,0);
    let water = await WaterIntake.findOne({ user: req.userId, date: today });
    if (!water) water = new WaterIntake({ user: req.userId, date: today });
    water.entries.push({ amount: req.body.amount, time: new Date() });
    water.totalAmount = water.entries.reduce((a, e) => a + e.amount, 0);
    await water.save();
    res.json({ success: true, data: water });
  } catch (error) { next(error); }
};

exports.updateWaterGoal = async (req, res, next) => {
  try {
    const today = new Date(); today.setHours(0,0,0,0);
    const water = await WaterIntake.findOneAndUpdate({ user: req.userId, date: today }, { goal: req.body.goal }, { new: true, upsert: true });
    res.json({ success: true, data: water });
  } catch (error) { next(error); }
};
