const ChatHistory = require('../../models/ChatHistory');
const { getAIResponse } = require('../../services/ai/geminiService');
const { v4: uuidv4 } = require('uuid');

exports.sendMessage = async (req, res, next) => {
  try {
    const { message, sessionId, context } = req.body;
    let chat = sessionId ? await ChatHistory.findOne({ sessionId, user: req.userId }) : null;
    if (!chat) {
      chat = new ChatHistory({ user: req.userId, sessionId: sessionId || uuidv4(), context: context || 'general', messages: [] });
    }
    chat.messages.push({ role: 'user', content: message });
    const aiResponse = await getAIResponse(message, chat.messages.slice(-10), context);
    chat.messages.push({ role: 'assistant', content: aiResponse });
    await chat.save();
    res.json({ success: true, data: { sessionId: chat.sessionId, response: aiResponse } });
  } catch (error) { next(error); }
};

exports.getChatSessions = async (req, res, next) => {
  try {
    const sessions = await ChatHistory.find({ user: req.userId }).select('sessionId context createdAt updatedAt').sort({ updatedAt: -1 });
    res.json({ success: true, data: sessions });
  } catch (error) { next(error); }
};

exports.getChatHistory = async (req, res, next) => {
  try {
    const chat = await ChatHistory.findOne({ sessionId: req.params.sessionId, user: req.userId });
    if (!chat) return res.status(404).json({ success: false, message: 'Chat session not found' });
    res.json({ success: true, data: chat });
  } catch (error) { next(error); }
};

exports.deleteChatSession = async (req, res, next) => {
  try {
    await ChatHistory.findOneAndDelete({ sessionId: req.params.sessionId, user: req.userId });
    res.json({ success: true, message: 'Chat session deleted' });
  } catch (error) { next(error); }
};
