const mongoose = require('mongoose');

const healthReportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['weekly', 'monthly', 'quarterly', 'yearly', 'custom'], required: true },
  period: { start: { type: Date, required: true }, end: { type: Date, required: true } },
  medicationAdherence: { overall: Number, byMedication: [{ medication: { type: mongoose.Schema.Types.ObjectId, ref: 'Medication' }, name: String, rate: Number }] },
  fitnessMetrics: { avgSteps: Number, avgSleep: Number, avgCalories: Number, activeMinutes: Number, avgHeartRate: Number },
  appointmentsSummary: { total: Number, completed: Number, missed: Number, upcoming: Number },
  labSummary: { testsCount: Number, normalCount: Number, abnormalCount: Number },
  aiInsights: [{ category: String, insight: String, severity: String }],
  score: { type: Number, min: 0, max: 100 },
  fileUrl: String,
  generatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

healthReportSchema.index({ user: 1, type: 1, 'period.start': -1 });
module.exports = mongoose.model('HealthReport', healthReportSchema);
