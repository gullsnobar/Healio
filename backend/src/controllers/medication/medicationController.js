const Medication = require('../../models/Medication');

exports.getAllMedications = async (req, res, next) => {
  try {
    const { active, page = 1, limit = 20 } = req.query;
    const filter = { user: req.userId };
    if (active !== undefined) filter.isActive = active === 'true';
    const medications = await Medication.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    const total = await Medication.countDocuments(filter);
    res.json({ success: true, data: { medications, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) } } });
  } catch (error) { next(error); }
};

exports.getMedication = async (req, res, next) => {
  try {
    const medication = await Medication.findOne({ _id: req.params.id, user: req.userId });
    if (!medication) return res.status(404).json({ success: false, message: 'Medication not found' });
    res.json({ success: true, data: medication });
  } catch (error) { next(error); }
};

exports.createMedication = async (req, res, next) => {
  try {
    const medication = await Medication.create({ ...req.body, user: req.userId });
    res.status(201).json({ success: true, data: medication });
  } catch (error) { next(error); }
};

exports.updateMedication = async (req, res, next) => {
  try {
    const medication = await Medication.findOneAndUpdate({ _id: req.params.id, user: req.userId }, req.body, { new: true, runValidators: true });
    if (!medication) return res.status(404).json({ success: false, message: 'Medication not found' });
    res.json({ success: true, data: medication });
  } catch (error) { next(error); }
};

exports.deleteMedication = async (req, res, next) => {
  try {
    const medication = await Medication.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!medication) return res.status(404).json({ success: false, message: 'Medication not found' });
    res.json({ success: true, message: 'Medication deleted' });
  } catch (error) { next(error); }
};
