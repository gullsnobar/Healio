const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  type: { type: String, enum: ['medication', 'appointment', 'fitness', 'lab_report', 'recommendation', 'system', 'emergency', 'refill'], required: true },
  data: { type: mongoose.Schema.Types.Mixed },
  isRead: { type: Boolean, default: false },
  isSent: { type: Boolean, default: false },
  sentAt: Date,
  readAt: Date,
  scheduledFor: Date,
  channel: { type: String, enum: ['push', 'email', 'sms', 'in_app'], default: 'push' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
}, { timestamps: true });

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
module.exports = mongoose.model('Notification', notificationSchema);
