const router = require('express').Router();
const { sendMessage, getChatHistory, getChatSessions, deleteChatSession } = require('../controllers/chatbot/chatbotController');
const { authenticate } = require('../middleware/authentication');

router.use(authenticate);
router.post('/message', sendMessage);
router.get('/history', getChatSessions);
router.get('/history/:sessionId', getChatHistory);
router.delete('/history/:sessionId', deleteChatSession);

module.exports = router;
