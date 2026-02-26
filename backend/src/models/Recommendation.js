const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['medication', 'fitness', 'diet', 'lifestyle', 'checkup', 'mental_health'], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  source: { type: String, enum: ['ai', 'system', 'doctor'], default: 'ai' },
  basedOn: { type: mongoose.Schema.Types.Mixed },
  actionItems: [{ text: String, isCompleted: { type: Boolean, default: false } }],
  isRead: { type: Boolean, default: false },
  isDismissed: { type: Boolean, default: false },
  expiresAt: Date,
  feedback: { helpful: Boolean, rating: Number, comment: String },
}, { timestamps: true });

recommendationSchema.index({ user: 1, type: 1, createdAt: -1 });
module.exports = mongoose.model('Recommendation', recommendationSchema);
