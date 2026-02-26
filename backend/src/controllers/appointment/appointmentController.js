const Appointment = require('../../models/Appointment');

exports.getAllAppointments = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = { user: req.userId };
    if (status) filter.status = status;
    const appointments = await Appointment.find(filter).sort({ date: 1 }).skip((page - 1) * limit).limit(Number(limit));
    const total = await Appointment.countDocuments(filter);
    res.json({ success: true, data: { appointments, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) } } });
  } catch (error) { next(error); }
};

exports.getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findOne({ _id: req.params.id, user: req.userId });
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    res.json({ success: true, data: appointment });
  } catch (error) { next(error); }
};

exports.createAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.create({ ...req.body, user: req.userId });
    res.status(201).json({ success: true, data: appointment });
  } catch (error) { next(error); }
};

exports.updateAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findOneAndUpdate({ _id: req.params.id, user: req.userId }, req.body, { new: true, runValidators: true });
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    res.json({ success: true, data: appointment });
  } catch (error) { next(error); }
};

exports.deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    res.json({ success: true, message: 'Appointment deleted' });
  } catch (error) { next(error); }
};

exports.getUpcomingAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ user: req.userId, date: { $gte: new Date() }, status: 'upcoming' }).sort({ date: 1 }).limit(10);
    res.json({ success: true, data: appointments });
  } catch (error) { next(error); }
};
