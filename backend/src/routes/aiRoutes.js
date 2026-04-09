/**
 * AI ROUTES
 * All AI-related API endpoints
 * Includes: Chatbot, Speech-to-Text, Image Analysis, Suggestions, Notifications
 */

const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { uploadAudio, uploadImage } = require('../middleware/fileUpload');

// ===== CHATBOT ROUTES =====
/**
 * POST /api/ai/chat
 * Send message to health assistant
 * Body: { message: string, userId?: string }
 */
router.post('/chat', aiController.chat);

/**
 * POST /api/ai/chat-context
 * Multi-turn conversation with history
 * Body: { message: string, userId: string }
 */
router.post('/chat-context', aiController.chatWithContext);

/**
 * POST /api/ai/clear-history
 * Clear conversation history
 * Body: { userId: string }
 */
router.post('/clear-history', aiController.clearChatHistory);

// ===== SUGGESTIONS ROUTES =====
/**
 * POST /api/ai/suggestions
 * Generate health suggestions
 * Body: { steps: number, sleepHours: number, missedDoses: number, waterIntake: number, heartRate?: number }
 */
router.post('/suggestions', aiController.generateSuggestions);

/**
 * POST /api/ai/health-issues
 * Detect critical health issues
 * Body: { steps: number, sleepHours: number, missedDoses: number, waterIntake: number }
 */
router.post('/health-issues', aiController.detectHealthIssues);

// ===== NOTIFICATION ROUTES =====
/**
 * POST /api/ai/send-notification
 * Send custom push notification
 * Body: { deviceToken: string, title: string, body: string, data?: object }
 */
router.post('/send-notification', aiController.sendNotification);

/**
 * POST /api/ai/send-medication-reminder
 * Send medication reminder notification
 * Body: { deviceToken: string, medicationName: string, medicationId?: string, dosage?: string }
 */
router.post('/send-medication-reminder', aiController.sendMedicationReminder);

/**
 * POST /api/ai/send-health-alert
 * Send health alert notification
 * Body: { deviceToken: string, message: string, type?: string, severity?: string }
 */
router.post('/send-health-alert', aiController.sendHealthAlert);

/**
 * POST /api/ai/send-achievement
 * Send achievement notification
 * Body: { deviceToken: string, message: string, achievementId?: string }
 */
router.post('/send-achievement', aiController.sendAchievementNotification);

// ===== TOPIC SUBSCRIPTION ROUTES =====
/**
 * POST /api/ai/subscribe-topic
 * Subscribe device to FCM topic for bulk notifications
 * Body: { deviceToken: string, topic: string }
 */
router.post('/subscribe-topic', aiController.subscribeToTopic);

/**
 * POST /api/ai/unsubscribe-topic
 * Unsubscribe device from FCM topic
 * Body: { deviceToken: string, topic: string }
 */
router.post('/unsubscribe-topic', aiController.unsubscribeFromTopic);

// ===== SPEECH-TO-TEXT ROUTES =====
/**
 * POST /api/ai/transcribe-audio
 * Convert audio file to text (Speech-to-Text with Whisper)
 * Accepts: Audio file (mp3, wav, m4a, flac, ogg)
 * Max size: 50MB
 * Body: Form-data with 'audio' file field and optional 'userId'
 */
router.post('/transcribe-audio', uploadAudio.single('audio'), aiController.transcribeAudio);

// ===== IMAGE ANALYSIS ROUTES =====
/**
 * POST /api/ai/analyze-medicine-image
 * Analyze medicine image and generate caption with health suggestions
 * Accepts: Image file (jpg, png, gif, webp)
 * Max size: 10MB
 * Body: Form-data with 'image' file field and optional 'userId'
 */
router.post('/analyze-medicine-image', uploadImage.single('image'), aiController.analyzeMedicineImage);

// ===== HEALTH CHECK ROUTE =====
/**
 * GET /api/ai/health
 * Check if all AI services are operational
 */
router.get('/health', aiController.healthCheck);

module.exports = router;
