const Appointment = require('../../models/Appointment');
const { sendPushNotification } = require('../../services/notification/pushService');

exports.sendAppointmentReminders = async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const start = new Date(tomorrow.setHours(0, 0, 0, 0));
  const end = new Date(tomorrow.setHours(23, 59, 59, 999));
  const appointments = await Appointment.find({ date: { $gte: start, $lte: end }, status: 'upcoming', reminderSent: false }).populate('user');
  for (const apt of appointments) {
    if (apt.user.fcmToken) {
      await sendPushNotification(apt.user.fcmToken, { title: 'Appointment Reminder', body: 'You have an appointment with Dr. ' + apt.doctorName + ' tomorrow', data: { type: 'appointment', id: apt._id.toString() } });
      apt.reminderSent = true;
      await apt.save();
    }
  }
};
