const { sendAppointmentReminders } = require('../controllers/appointment/reminderController');
exports.run = async () => { await sendAppointmentReminders(); };
