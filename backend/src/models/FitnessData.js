const mongoose = require('mongoose');

const fitnessDataSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: Date, required: true },
  source: { type: String, enum: ['google_fit', 'manual', 'apple_health'], default: 'google_fit' },
  steps: { count: { type: Number, default: 0 }, goal: { type: Number, default: 10000 }, distance: { type: Number, default: 0 }, calories: { type: Number, default: 0 } },
  sleep: { duration: { type: Number, default: 0 }, bedtime: Date, wakeTime: Date, quality: { type: String, enum: ['poor', 'fair', 'good', 'excellent'] }, stages: { deep: Number, light: Number, rem: Number, awake: Number } },
  heartRate: { resting: Number, average: Number, max: Number, min: Number, readings: [{ time: Date, bpm: Number }] },
  calories: { burned: { type: Number, default: 0 }, consumed: { type: Number, default: 0 }, goal: { type: Number, default: 2000 } },
  exercise: [{ type: { type: String }, duration: Number, calories: Number, startTime: Date, endTime: Date }],
  weight: { value: Number, unit: { type: String, default: 'kg' } },
  bloodPressure: { systolic: Number, diastolic: Number, pulse: Number, measuredAt: Date },
  bloodSugar: { value: Number, type: { type: String, enum: ['fasting', 'random', 'postprandial'] }, measuredAt: Date },
  oxygen: { spo2: Number, measuredAt: Date },
}, { timestamps: true });

fitnessDataSchema.index({ user: 1, date: -1 }, { unique: true });
module.exports = mongoose.model('FitnessData', fitnessDataSchema);
