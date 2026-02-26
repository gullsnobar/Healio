const Medication = require('../models/Medication');
const { notifyMedicationReminder } = require('../services/notification/notificationService');

exports.run = async () => {
  const now = new Date();
  const currentHour = now.getHours().toString().padStart(2, '0');
  const currentMin = Math.floor(now.getMinutes() / 15) * 15;
  const timeWindow = currentHour + ':' + currentMin.toString().padStart(2, '0');
  const medications = await Medication.find({ isActive: true, 'times.time': { $regex: '^' + currentHour } }).populate('user');
  for (const med of medications) {
    if (med.user?.fcmToken) await notifyMedicationReminder(med.user._id, med, timeWindow);
  }
};
