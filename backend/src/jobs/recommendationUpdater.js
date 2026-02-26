const User = require('../models/User');
const Medication = require('../models/Medication');
const FitnessData = require('../models/FitnessData');
const { generateRecommendations } = require('../services/ai/recommendationEngine');

exports.run = async () => {
  const users = await User.find({ isActive: true });
  for (const user of users) {
    try {
      const [medications, recentFitness] = await Promise.all([
        Medication.find({ user: user._id, isActive: true }),
        FitnessData.find({ user: user._id }).sort({ date: -1 }).limit(7),
      ]);
      await generateRecommendations(user._id, { medications: medications.map(m => ({ name: m.name, adherenceRate: m.adherenceRate })), fitness: recentFitness });
    } catch {}
  }
};
