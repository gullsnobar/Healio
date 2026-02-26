const Medication = require('../models/Medication');
const { notifyRefillReminder } = require('../services/notification/notificationService');

exports.run = async () => {
  const medications = await Medication.find({ isActive: true, 'refillReminder.enabled': true });
  for (const med of medications) {
    const { currentStock, daysBeforeRefill } = med.refillReminder;
    if (currentStock !== undefined && currentStock <= daysBeforeRefill) {
      await notifyRefillReminder(med.user, med);
    }
  }
};
