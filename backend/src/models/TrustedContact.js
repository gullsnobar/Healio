const mongoose = require('mongoose');

const trustedContactSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true },
  phone: { type: String },
  relationship: { type: String, enum: ['family', 'friend', 'doctor', 'caregiver', 'other'], required: true },
  permissions: {
    viewMedications: { type: Boolean, default: false },
    viewAppointments: { type: Boolean, default: false },
    viewLabReports: { type: Boolean, default: false },
    viewFitness: { type: Boolean, default: false },
    receiveAlerts: { type: Boolean, default: true },
    emergencyAccess: { type: Boolean, default: false },
  },
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  isActive: { type: Boolean, default: true },
  lastNotified: Date,
}, { timestamps: true });

trustedContactSchema.index({ user: 1 });
module.exports = mongoose.model('TrustedContact', trustedContactSchema);
