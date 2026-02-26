const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: [true, 'Medication name is required'], trim: true },
  genericName: { type: String, trim: true },
  dosage: { type: String, required: [true, 'Dosage is required'] },
  dosageUnit: { type: String, enum: ['mg', 'ml', 'tablet', 'capsule', 'drops', 'units'], default: 'mg' },
  frequency: { type: String, enum: ['once_daily', 'twice_daily', 'three_daily', 'four_daily', 'weekly', 'as_needed', 'custom'], required: true },
  times: [{ time: String, label: { type: String, enum: ['morning', 'afternoon', 'evening', 'night', 'custom'] } }],
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  prescribedBy: { type: String },
  purpose: { type: String },
  instructions: { type: String },
  sideEffects: [{ type: String }],
  refillReminder: { enabled: { type: Boolean, default: false }, daysBeforeRefill: { type: Number, default: 7 }, lastRefillDate: Date, quantity: Number, currentStock: Number },
  adherenceHistory: [{ date: Date, time: String, status: { type: String, enum: ['taken', 'missed', 'skipped', 'late'] }, takenAt: Date, notes: String }],
  isActive: { type: Boolean, default: true },
  color: { type: String, default: '#4A90D9' },
  icon: { type: String, default: 'pill' },
}, { timestamps: true });

medicationSchema.index({ user: 1, isActive: 1 });
medicationSchema.index({ 'adherenceHistory.date': 1 });

medicationSchema.virtual('adherenceRate').get(function() {
  if (!this.adherenceHistory.length) return 0;
  const taken = this.adherenceHistory.filter(h => h.status === 'taken').length;
  return Math.round((taken / this.adherenceHistory.length) * 100);
});

medicationSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('Medication', medicationSchema);
