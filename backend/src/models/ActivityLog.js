const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  action: { type: String, required: true },
  module: { type: String, enum: ['auth', 'medication', 'appointment', 'lab_report', 'fitness', 'chatbot', 'recommendation', 'trusted_contact', 'report', 'notification', 'profile', 'admin'], required: true },
  details: { type: mongoose.Schema.Types.Mixed },
  ipAddress: String,
  userAgent: String,
}, { timestamps: true });

activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ module: 1, action: 1 });
module.exports = mongoose.model('ActivityLog', activityLogSchema);
