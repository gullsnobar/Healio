const Medication = require('../../models/Medication');
const Appointment = require('../../models/Appointment');
const FitnessData = require('../../models/FitnessData');
const LabReport = require('../../models/LabReport');
const Recommendation = require('../../models/Recommendation');

exports.getDashboardData = async (req, res, next) => {
  try {
    const today = new Date(); today.setHours(0,0,0,0);
    const endOfDay = new Date(); endOfDay.setHours(23,59,59,999);
    const [medications, appointments, fitness, recentReports, recommendations] = await Promise.all([
      Medication.find({ user: req.userId, isActive: true }),
      Appointment.find({ user: req.userId, date: { $gte: today }, status: 'upcoming' }).sort({ date: 1 }).limit(5),
      FitnessData.findOne({ user: req.userId, date: { $gte: today, $lte: endOfDay } }),
      LabReport.find({ user: req.userId }).sort({ date: -1 }).limit(3),
      Recommendation.find({ user: req.userId, isDismissed: false }).sort({ createdAt: -1 }).limit(5),
    ]);
    const adherenceRate = medications.length ? Math.round(medications.reduce((a, m) => a + m.adherenceRate, 0) / medications.length) : 0;
    res.json({ success: true, data: { medications: { count: medications.length, adherenceRate, todayDoses: medications.flatMap(m => m.times) }, appointments: { upcoming: appointments }, fitness: fitness || {}, recentReports, recommendations } });
  } catch (error) { next(error); }
};

exports.getHealthScore = async (req, res, next) => {
  try {
    const medications = await Medication.find({ user: req.userId, isActive: true });
    const adherence = medications.length ? medications.reduce((a, m) => a + m.adherenceRate, 0) / medications.length : 50;
    const score = Math.min(100, Math.round(adherence * 0.4 + 50 * 0.3 + 50 * 0.3));
    res.json({ success: true, data: { score, breakdown: { medicationAdherence: Math.round(adherence), fitnessActivity: 50, healthMetrics: 50 } } });
  } catch (error) { next(error); }
};

exports.getQuickStats = async (req, res, next) => {
  try {
    const [medCount, aptCount, reportCount] = await Promise.all([
      Medication.countDocuments({ user: req.userId, isActive: true }),
      Appointment.countDocuments({ user: req.userId, date: { $gte: new Date() }, status: 'upcoming' }),
      LabReport.countDocuments({ user: req.userId }),
    ]);
    res.json({ success: true, data: { activeMedications: medCount, upcomingAppointments: aptCount, labReports: reportCount } });
  } catch (error) { next(error); }
};
