const Medication = require('../../models/Medication');

exports.setRefillReminder = async (req, res, next) => {
  try {
    const medication = await Medication.findOneAndUpdate({ _id: req.params.id, user: req.userId }, { refillReminder: { ...req.body, enabled: true } }, { new: true });
    if (!medication) return res.status(404).json({ success: false, message: 'Medication not found' });
    res.json({ success: true, data: medication.refillReminder });
  } catch (error) { next(error); }
};

exports.getRefillReminders = async (req, res, next) => {
  try {
    const medications = await Medication.find({ user: req.userId, 'refillReminder.enabled': true, isActive: true }).select('name refillReminder');
    res.json({ success: true, data: medications });
  } catch (error) { next(error); }
};
