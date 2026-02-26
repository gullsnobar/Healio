const mongoose = require('mongoose');

const dietLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  meals: [{
    type: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'] },
    items: [{ name: String, calories: Number, protein: Number, carbs: Number, fat: Number, quantity: Number, unit: String }],
    time: Date,
    totalCalories: Number,
  }],
  totalCalories: { type: Number, default: 0 },
  totalProtein: { type: Number, default: 0 },
  totalCarbs: { type: Number, default: 0 },
  totalFat: { type: Number, default: 0 },
  notes: String,
}, { timestamps: true });

dietLogSchema.index({ user: 1, date: -1 });
module.exports = mongoose.model('DietLog', dietLogSchema);
