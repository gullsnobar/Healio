const nodemailer = require('nodemailer');
const logger = require('../../utils/logger');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, port: process.env.EMAIL_PORT,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
});

exports.sendOTPEmail = async (email, otp) => {
  await transporter.sendMail({ from: 'HEALIO <noreply@healio.com>', to: email, subject: 'HEALIO - Verification OTP', html: '<h2>Your OTP is: <b>' + otp + '</b></h2><p>Valid for 10 minutes.</p>' });
  logger.info('OTP email sent to ' + email);
};

exports.sendVerificationEmail = async (email, token, userName) => {
  const link = process.env.FRONTEND_URL + '/verify-contact/' + token;
  await transporter.sendMail({ from: 'HEALIO <noreply@healio.com>', to: email, subject: 'HEALIO - Trusted Contact Verification', html: '<p>' + userName + ' wants to add you as a trusted contact on HEALIO.</p><a href=\"' + link + '\">Verify</a>' });
};

exports.sendShareNotification = async (email, data) => {
  await transporter.sendMail({ from: 'HEALIO <noreply@healio.com>', to: email, subject: 'HEALIO - Health Report Shared', html: '<p>A health report has been shared with you.</p>' });
};

exports.sendAppointmentReminder = async (email, appointment) => {
  await transporter.sendMail({ from: 'HEALIO <noreply@healio.com>', to: email, subject: 'HEALIO - Appointment Reminder', html: '<p>Reminder: You have an appointment with Dr. ' + appointment.doctorName + ' on ' + appointment.date + '</p>' });
};
