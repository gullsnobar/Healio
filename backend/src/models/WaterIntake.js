const mongoose = require('mongoose');

const waterIntakeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  entries: [{ amount: { type: Number, required: true }, unit: { type: String, default: 'ml' }, time: { type: Date, default: Date.now } }],
  totalAmount: { type: Number, default: 0 },
  goal: { type: Number, default: 2500 },
}, { timestamps: true });

waterIntakeSchema.index({ user: 1, date: -1 });
module.exports = mongoose.model('WaterIntake', waterIntakeSchema);
