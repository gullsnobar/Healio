const User = require('../../models/User');
const Medication = require('../../models/Medication');
const Appointment = require('../../models/Appointment');
const ActivityLog = require('../../models/ActivityLog');

exports.getDashboard = async (req, res, next) => {
  try {
    const [totalUsers, activeUsers, totalMeds, totalApts] = await Promise.all([
      User.countDocuments(), User.countDocuments({ isActive: true }), Medication.countDocuments(), Appointment.countDocuments(),
    ]);
    res.json({ success: true, data: { totalUsers, activeUsers, totalMedications: totalMeds, totalAppointments: totalApts } });
  } catch (error) { next(error); }
};

exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    const users = await User.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    const total = await User.countDocuments(filter);
    res.json({ success: true, data: { users, pagination: { page: Number(page), limit: Number(limit), total } } });
  } catch (error) { next(error); }
};

exports.getUserDetail = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const [meds, apts, logs] = await Promise.all([
      Medication.countDocuments({ user: req.params.id }),
      Appointment.countDocuments({ user: req.params.id }),
      ActivityLog.find({ user: req.params.id }).sort({ createdAt: -1 }).limit(20),
    ]);
    res.json({ success: true, data: { user, stats: { medications: meds, appointments: apts }, recentActivity: logs } });
  } catch (error) { next(error); }
};

exports.deactivateUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'User deactivated' });
  } catch (error) { next(error); }
};

exports.getSystemStats = async (req, res, next) => {
  try {
    const stats = await ActivityLog.aggregate([
      { $group: { _id: '$module', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json({ success: true, data: stats });
  } catch (error) { next(error); }
};
