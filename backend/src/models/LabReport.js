const mongoose = require('mongoose');

const labReportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: [true, 'Report title is required'], trim: true },
  testType: { type: String, required: true },
  lab: { name: String, address: String, phone: String },
  date: { type: Date, required: true },
  orderedBy: { type: String },
  results: [{
    testName: { type: String, required: true },
    value: { type: mongoose.Schema.Types.Mixed },
    unit: String,
    normalRange: { min: Number, max: Number },
    status: { type: String, enum: ['normal', 'high', 'low', 'critical'] },
    notes: String,
  }],
  overallStatus: { type: String, enum: ['normal', 'abnormal', 'critical', 'pending'], default: 'pending' },
  fileUrl: { type: String },
  fileType: { type: String, enum: ['pdf', 'image', 'manual'] },
  aiAnalysis: { summary: String, recommendations: [String], riskFactors: [String], analyzedAt: Date },
  notes: { type: String },
  isSharedWithDoctor: { type: Boolean, default: false },
}, { timestamps: true });

labReportSchema.index({ user: 1, date: -1 });
module.exports = mongoose.model('LabReport', labReportSchema);
