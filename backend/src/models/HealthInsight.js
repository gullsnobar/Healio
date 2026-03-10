const mongoose = require('mongoose');

const healthInsightSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: {
    type: String,
    enum: ['weekly_tip', 'low_activity_alert', 'improvement_suggestion', 'diet_insight', 'medication_adherence'],
    required: true,
  },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['fitness', 'diet', 'medication', 'sleep', 'hydration', 'general'],
    default: 'general',
  },
  severity: {
    type: String,
    enum: ['info', 'warning', 'critical'],
    default: 'info',
  },
  actionItems: [{ text: String, isCompleted: { type: Boolean, default: false } }],
  basedOn: {
    avgSteps: Number,
    avgSleep: Number,
    avgCalories: Number,
    adherenceRate: Number,
    waterIntake: Number,
    period: { start: Date, end: Date },
  },
  isRead: { type: Boolean, default: false },
  isDismissed: { type: Boolean, default: false },
  expiresAt: { type: Date },
}, { timestamps: true });

healthInsightSchema.index({ user: 1, type: 1, createdAt: -1 });
healthInsightSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('HealthInsight', healthInsightSchema);
