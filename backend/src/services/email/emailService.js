const nodemailer = require('nodemailer');
const logger = require('../../utils/logger');

let transporter = null;
let emailReady = false;

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    logger.warn('EMAIL_USER or EMAIL_PASSWORD not set — email sending disabled');
    return null;
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
    tls: { rejectUnauthorized: false },
    pool: true,
    maxConnections: 3,
    rateDelta: 1000,
    rateLimit: 5,
  });
};

/**
 * Verify SMTP connection on startup. Call this from server.js after dotenv loads.
 * Returns true if connected, false otherwise (app can still run without email).
 */
exports.verifyEmailConnection = async () => {
  transporter = createTransporter();
  if (!transporter) return false;
  try {
    await transporter.verify();
    emailReady = true;
    logger.info('SMTP email connection verified — emails will be delivered');
    return true;
  } catch (err) {
    emailReady = false;
    logger.error('SMTP email verification FAILED: ' + err.message);
    logger.error('OTP emails will NOT be sent. Fix EMAIL_USER / EMAIL_PASSWORD in .env');
    return false;
  }
};

exports.isEmailReady = () => emailReady;

const FROM = () => `HEALIO <${process.env.EMAIL_USER}>`;

exports.sendOTPEmail = async (email, otp) => {
  if (!transporter || !emailReady) {
    throw new Error('Email service not configured or SMTP credentials invalid');
  }
  await transporter.sendMail({
    from: FROM(),
    to: email,
    subject: 'HEALIO - Verification Code',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:12px;">
        <h2 style="color:#0F766E;margin:0 0 8px;">HEALIO</h2>
        <p style="color:#334155;font-size:15px;">Your verification code is:</p>
        <div style="background:#ffffff;border:2px solid #14B8A6;border-radius:10px;padding:20px;text-align:center;margin:16px 0;">
          <span style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#0F766E;">${otp}</span>
        </div>
        <p style="color:#64748B;font-size:13px;">This code expires in 10 minutes. If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
  logger.info('OTP email sent to ' + email);
};

exports.sendVerificationEmail = async (email, token, userName) => {
  const link = process.env.FRONTEND_URL + '/verify-contact/' + token;
  await transporter.sendMail({ from: FROM, to: email, subject: 'HEALIO - Trusted Contact Verification', html: '<p>' + userName + ' wants to add you as a trusted contact on HEALIO.</p><a href="' + link + '">Verify</a>' });
};

exports.sendShareNotification = async (email, data) => {
  await transporter.sendMail({ from: FROM, to: email, subject: 'HEALIO - Health Report Shared', html: '<p>A health report has been shared with you.</p>' });
};

exports.sendAppointmentReminder = async (email, appointment) => {
  await transporter.sendMail({ from: FROM, to: email, subject: 'HEALIO - Appointment Reminder', html: '<p>Reminder: You have an appointment with Dr. ' + appointment.doctorName + ' on ' + appointment.date + '</p>' });
};
