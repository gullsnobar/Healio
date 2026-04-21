const Medication = require('../../models/Medication');
const { MedicationReminder } = require('../../models/Reminder');

const getTodayStatus = (medication) => {
  if (!medication) return 'pending';
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const history = medication.adherenceHistory || [];
  const todayEntries = history.filter((h) => h.date >= today);
  if (!todayEntries.length) return 'pending';
  if (todayEntries.some((h) => h.status === 'taken')) return 'taken';
  if (todayEntries.some((h) => ['missed', 'skipped', 'late'].includes(h.status))) return 'missed';
  return 'pending';
};

exports.getAllMedications = async (req, res, next) => {
  try {
    const { active, page = 1, limit = 20 } = req.query;
    const filter = { user: req.userId };
    if (active !== undefined) filter.isActive = active === 'true';
    const medications = await Medication.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    const total = await Medication.countDocuments(filter);
    const medsWithStatus = medications.map((m) => {
      const obj = m.toObject({ virtuals: true });
      obj.status = getTodayStatus(m);
      return obj;
    });
    res.json({
      success: true,
      data: {
        medications: medsWithStatus,
        pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
      },
    });
  } catch (error) { next(error); }
};

exports.getMedication = async (req, res, next) => {
  try {
    const medication = await Medication.findOne({ _id: req.params.id, user: req.userId });
    if (!medication) return res.status(404).json({ success: false, message: 'Medication not found' });
    const medObj = medication.toObject({ virtuals: true });
    medObj.status = getTodayStatus(medication);
    res.json({ success: true, data: medObj });
  } catch (error) { next(error); }
};

exports.createMedication = async (req, res, next) => {
  try {
    // Map frontend field names to backend schema
    const body = { ...req.body };
    if (body.doctorName && !body.prescribedBy) {
      body.prescribedBy = body.doctorName;
      delete body.doctorName;
    }
    if (body.notes && !body.instructions) {
      body.instructions = body.notes;
      delete body.notes;
    }
    // Normalize frequency from frontend format
    const freqMap = { 'Daily': 'once_daily', 'Twice Daily': 'twice_daily', 'Three Times': 'three_daily', 'Weekly': 'weekly', 'As Needed': 'as_needed' };
    if (body.frequency && freqMap[body.frequency]) body.frequency = freqMap[body.frequency];
    // Normalize times from string array to object array
    if (Array.isArray(body.times) && body.times.length && typeof body.times[0] === 'string') {
      body.times = body.times.map(t => ({ time: t, label: 'custom' }));
    }
    // Default startDate if not provided
    if (!body.startDate) body.startDate = new Date();

    const medication = await Medication.create({ ...body, user: req.userId });

    // Auto-create medication reminders for each scheduled time
    if (body.alarmEnabled !== false && medication.times?.length) {
      const reminderPromises = medication.times.map(t =>
        MedicationReminder.create({
          user: req.userId,
          title: medication.name + ' - ' + medication.dosage,
          date: medication.startDate,
          time: t.time,
          reminderType: 'medication',
          medicationName: medication.name,
          dosage: medication.dosage,
          dosageUnit: medication.dosageUnit,
          frequency: medication.frequency,
          instructions: medication.instructions || '',
          repeat: medication.frequency === 'once_daily' || medication.frequency === 'twice_daily' || medication.frequency === 'three_daily' || medication.frequency === 'four_daily' ? 'daily' : medication.frequency === 'weekly' ? 'weekly' : 'none',
          sourceId: medication._id,
          sourceModel: 'Medication',
        }).catch(() => null)
      );
      await Promise.all(reminderPromises);
    }

    res.status(201).json({ success: true, data: medication });
  } catch (error) { next(error); }
};

exports.updateMedication = async (req, res, next) => {
  try {
    const medication = await Medication.findOneAndUpdate({ _id: req.params.id, user: req.userId }, req.body, { new: true, runValidators: true });
    if (!medication) return res.status(404).json({ success: false, message: 'Medication not found' });
    const medObj = medication.toObject({ virtuals: true });
    medObj.status = getTodayStatus(medication);
    res.json({ success: true, data: medObj });
  } catch (error) { next(error); }
};

exports.deleteMedication = async (req, res, next) => {
  try {
    const medication = await Medication.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!medication) return res.status(404).json({ success: false, message: 'Medication not found' });
    // Clean up associated reminders
    await MedicationReminder.deleteMany({ sourceId: medication._id, user: req.userId }).catch(() => null);
    res.json({ success: true, message: 'Medication deleted' });
  } catch (error) { next(error); }
};

exports.markAsTaken = async (req, res, next) => {
  try {
    const medication = await Medication.findOne({ _id: req.params.id, user: req.userId });
    if (!medication) return res.status(404).json({ success: false, message: 'Medication not found' });
    const now = new Date();
    const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    medication.adherenceHistory.push({ date: now, time, status: 'taken', takenAt: now });
    // Decrease stock if refill tracking is enabled
    if (medication.refillReminder?.enabled && medication.refillReminder.currentStock > 0) {
      medication.refillReminder.currentStock -= 1;
    }
    await medication.save();
    const medObj = medication.toObject({ virtuals: true });
    medObj.status = getTodayStatus(medication);
    res.json({ success: true, data: { adherenceRate: medication.adherenceRate, medication: medObj } });
  } catch (error) { next(error); }
};
