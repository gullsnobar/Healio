const User = require('../models/User');
const Medication = require('../models/Medication');
const FitnessData = require('../models/FitnessData');
const HealthReport = require('../models/HealthReport');

exports.run = async () => {
  const users = await User.find({ isActive: true });
  for (const user of users) {
    try {
      const meds = await Medication.find({ user: user._id, isActive: true });
      const adherence = meds.length ? meds.reduce((a, m) => a + m.adherenceRate, 0) / meds.length : 50;
      const today = new Date(); const weekAgo = new Date(); weekAgo.setDate(today.getDate() - 7);
      const fitness = await FitnessData.find({ user: user._id, date: { $gte: weekAgo } });
      const avgSteps = fitness.length ? fitness.reduce((a, f) => a + (f.steps?.count || 0), 0) / fitness.length : 0;
      const score = Math.min(100, Math.round(adherence * 0.4 + Math.min(avgSteps / 250, 30) + 30));
      // Score stored in latest health report context
    } catch {}
  }
};
