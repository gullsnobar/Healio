const Medication = require('../models/Medication');
const { notifyMissedDose } = require('../services/notification/notificationService');
const { detectMissedDosePattern } = require('../services/ai/recommendationEngine');

exports.run = async () => {
  const medications = await Medication.find({ isActive: true }).populate('user');
  for (const med of medications) {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const todayEntries = med.adherenceHistory.filter(h => h.date >= today);
    const expectedDoses = med.times?.length || 1;
    const takenDoses = todayEntries.filter(h => h.status === 'taken').length;
    if (takenDoses < expectedDoses && new Date().getHours() > 12) {
      await notifyMissedDose(med.user._id, med);
      await detectMissedDosePattern(med.user._id, med.adherenceHistory.slice(-30));
    }
  }
};
