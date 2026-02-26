const Medication = require('../../models/Medication');

exports.recordAdherence = async (req, res, next) => {
  try {
    const { status, time, notes } = req.body;
    const medication = await Medication.findOne({ _id: req.params.id, user: req.userId });
    if (!medication) return res.status(404).json({ success: false, message: 'Medication not found' });
    medication.adherenceHistory.push({ date: new Date(), time, status, takenAt: status === 'taken' ? new Date() : undefined, notes });
    await medication.save();
    res.json({ success: true, data: { adherenceRate: medication.adherenceRate } });
  } catch (error) { next(error); }
};

exports.getAdherenceHistory = async (req, res, next) => {
  try {
    const medication = await Medication.findOne({ _id: req.params.id, user: req.userId });
    if (!medication) return res.status(404).json({ success: false, message: 'Medication not found' });
    const { startDate, endDate } = req.query;
    let history = medication.adherenceHistory;
    if (startDate) history = history.filter(h => h.date >= new Date(startDate));
    if (endDate) history = history.filter(h => h.date <= new Date(endDate));
    res.json({ success: true, data: { history, adherenceRate: medication.adherenceRate } });
  } catch (error) { next(error); }
};

exports.getAdherenceStats = async (req, res, next) => {
  try {
    const medications = await Medication.find({ user: req.userId, isActive: true });
    const stats = medications.map(m => ({ id: m._id, name: m.name, rate: m.adherenceRate }));
    const overall = stats.length ? Math.round(stats.reduce((a, s) => a + s.rate, 0) / stats.length) : 0;
    res.json({ success: true, data: { overall, medications: stats } });
  } catch (error) { next(error); }
};
