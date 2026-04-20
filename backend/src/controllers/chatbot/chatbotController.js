const ChatHistory = require('../../models/ChatHistory');
const chatbotService = require('../../services/aiServices/chatbotService');
const { v4: uuidv4 } = require('uuid');

exports.sendMessage = async (req, res, next) => {
  try {
    const { message, sessionId, context } = req.body;

    // Find existing chat session or create new one
    let chat = sessionId ? await ChatHistory.findOne({ sessionId, user: req.userId }) : null;
    if (!chat) {
      chat = new ChatHistory({
        user: req.userId,
        sessionId: sessionId || uuidv4(),
        context: context || 'general',
        messages: [],
      });
    }

    // Save user message
    chat.messages.push({ role: 'user', content: message });

    // Use HuggingFace-based chatbot service instead of Gemini
    const aiResult = await chatbotService.chatWithAI(message, req.userId);
    const aiResponse = aiResult?.message || "I'm thinking... Could you rephrase your question?";

    // Save assistant reply
    chat.messages.push({ role: 'assistant', content: aiResponse });
    await chat.save();

    res.json({ success: true, data: { sessionId: chat.sessionId, response: aiResponse } });
  } catch (error) {
    next(error);
  }
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
