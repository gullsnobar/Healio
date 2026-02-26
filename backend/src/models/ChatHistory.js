const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  sessionId: { type: String, required: true },
  messages: [{
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    metadata: { type: mongoose.Schema.Types.Mixed },
  }],
  context: { type: String, enum: ['general', 'medication', 'fitness', 'nutrition', 'mental_health', 'lab_report'], default: 'general' },
  isActive: { type: Boolean, default: true },
  summary: String,
}, { timestamps: true });

chatHistorySchema.index({ user: 1, sessionId: 1 });
module.exports = mongoose.model('ChatHistory', chatHistorySchema);
