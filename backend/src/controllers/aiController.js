/**
 * AI CONTROLLER
 * Handles all AI-related API endpoint logic
 * Production-ready with validation and error handling
 */

const chatbotService = require('../services/aiServices/chatbotService');
const suggestionsService = require('../services/aiServices/suggestionsService');
const notificationService = require('../services/aiServices/notificationService');
const speechService = require('../services/aiServices/speechService');
const imageService = require('../services/aiServices/imageService');
const logger = require('../utils/aiLogger');


/**
 * POST /api/ai/chat
 * Simple one-shot chat with health assistant
 */
const chat = async (req, res) => {
  try {
    const { message, userId } = req.body;

    // Validation
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required',
      });
    }

    logger.info(`[AI Chat] User ${userId || 'anonymous'} sent: "${message.substring(0, 30)}..."`);

    // Call chatbot service
    const response = await chatbotService.chatWithAI(message, userId);

    res.json({
      success: true,
      data: response,
    });

  } catch (error) {
    logger.error('[AI Chat] Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * POST /api/ai/chat-context
 * Multi-turn chat with conversation history
 */
const chatWithContext = async (req, res) => {
  try {
    const { message, userId } = req.body;

    // Validation
    if (!message || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Message and userId are required',
      });
    }

    logger.info(`[AI Chat Context] User ${userId} message`);

    const response = await chatbotService.chatWithContext(userId, message);

    res.json({
      success: true,
      data: response,
    });

  } catch (error) {
    logger.error('[AI Chat Context] Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * POST /api/ai/clear-history
 * Clear conversation history for a user
 */
const clearChatHistory = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required',
      });
    }

    const cleared = chatbotService.clearUserHistory(userId);

    res.json({
      success: true,
      message: cleared ? `Cleared history for user ${userId}` : 'No history found',
      cleared,
    });

  } catch (error) {
    logger.error('[Clear History] Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * POST /api/ai/suggestions
 * Generate health suggestions based on user data
 */
const generateSuggestions = async (req, res) => {
  try {
    const userData = req.body;

    // Validation
    if (!userData || typeof userData !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'User data is required',
      });
    }

    logger.info('[AI Suggestions] Generating suggestions for user');

    const suggestions = suggestionsService.generateHealthSuggestions(userData);

    res.json({
      success: true,
      data: suggestions,
    });

  } catch (error) {
    logger.error('[AI Suggestions] Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * POST /api/ai/health-issues
 * Detect critical health issues and return alerts
 */
const detectHealthIssues = async (req, res) => {
  try {
    const userData = req.body;

    if (!userData || typeof userData !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'User data is required',
      });
    }

    logger.info('[Health Issues] Detecting health issues');

    const alerts = suggestionsService.detectHealthIssues(userData);

    res.json({
      success: true,
      alertCount: alerts.length,
      alerts,
    });

  } catch (error) {
    logger.error('[Health Issues] Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * POST /api/ai/send-notification
 * Send push notification to user device
 */
const sendNotification = async (req, res) => {
  try {
    const { deviceToken, title, body, data } = req.body;

    // Validation
    if (!deviceToken || !title || !body) {
      return res.status(400).json({
        success: false,
        error: 'deviceToken, title, and body are required',
      });
    }

    logger.info(`[Notification] Sending notification to device`);

    const notification = {
      title,
      body,
      data: data || {},
    };

    const result = await notificationService.sendNotificationToDevice(deviceToken, notification);

    res.json({
      success: true,
      data: result,
    });

  } catch (error) {
    logger.error('[Notification] Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * POST /api/ai/send-medication-reminder
 * Send medication reminder notification
 */
const sendMedicationReminder = async (req, res) => {
  try {
    const { deviceToken, medicationName, medicationId, dosage } = req.body;

    if (!deviceToken || !medicationName) {
      return res.status(400).json({
        success: false,
        error: 'deviceToken and medicationName are required',
      });
    }

    logger.info(`[Medication Reminder] Sending for ${medicationName}`);

    const result = await notificationService.sendMedicationReminder(deviceToken, {
      medicationName,
      medicationId,
      dosage,
    });

    res.json({
      success: true,
      data: result,
    });

  } catch (error) {
    logger.error('[Medication Reminder] Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * POST /api/ai/send-health-alert
 * Send health alert notification
 */
const sendHealthAlert = async (req, res) => {
  try {
    const { deviceToken, message, type, severity } = req.body;

    if (!deviceToken || !message) {
      return res.status(400).json({
        success: false,
        error: 'deviceToken and message are required',
      });
    }

    logger.info(`[Health Alert] Sending alert: ${message}`);

    const result = await notificationService.sendHealthAlert(deviceToken, {
      message,
      type: type || 'GENERAL',
      severity: severity || 'MEDIUM',
    });

    res.json({
      success: true,
      data: result,
    });

  } catch (error) {
    logger.error('[Health Alert] Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * POST /api/ai/send-achievement
 * Send achievement notification
 */
const sendAchievementNotification = async (req, res) => {
  try {
    const { deviceToken, message, achievementId } = req.body;

    if (!deviceToken || !message) {
      return res.status(400).json({
        success: false,
        error: 'deviceToken and message are required',
      });
    }

    logger.info(`[Achievement] Sending achievement notification`);

    const result = await notificationService.sendAchievementNotification(deviceToken, {
      message,
      achievementId,
    });

    res.json({
      success: true,
      data: result,
    });

  } catch (error) {
    logger.error('[Achievement] Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * POST /api/ai/subscribe-topic
 * Subscribe device to FCM topic
 */
const subscribeToTopic = async (req, res) => {
  try {
    const { deviceToken, topic } = req.body;

    if (!deviceToken || !topic) {
      return res.status(400).json({
        success: false,
        error: 'deviceToken and topic are required',
      });
    }

    logger.info(`[Subscribe Topic] Device subscribing to ${topic}`);

    const result = await notificationService.subscribeToTopic(deviceToken, topic);

    res.json({
      success: true,
      data: result,
    });

  } catch (error) {
    logger.error('[Subscribe Topic] Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * POST /api/ai/unsubscribe-topic
 * Unsubscribe device from FCM topic
 */
const unsubscribeFromTopic = async (req, res) => {
  try {
    const { deviceToken, topic } = req.body;

    if (!deviceToken || !topic) {
      return res.status(400).json({
        success: false,
        error: 'deviceToken and topic are required',
      });
    }

    logger.info(`[Unsubscribe Topic] Device unsubscribing from ${topic}`);

    const result = await notificationService.unsubscribeFromTopic(deviceToken, topic);

    res.json({
      success: true,
      data: result,
    });

  } catch (error) {
    logger.error('[Unsubscribe Topic] Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * POST /api/ai/transcribe-audio
 * Convert audio file to text (Speech-to-Text)
 */
const transcribeAudio = async (req, res) => {
  try {
    const { userId } = req.body;

    // Validation
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Audio file is required',
      });
    }

    logger.info(`[Speech-to-Text] Processing audio file: ${req.file.filename}`);

    // Call speech service
    const result = await speechService.transcribeAudio(req.file.path, userId);

    res.json({
      success: true,
      data: result,
    });

  } catch (error) {
    logger.error('[Speech-to-Text] Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * POST /api/ai/analyze-medicine-image
 * Analyze medicine image and generate caption with suggestions
 */
const analyzeMedicineImage = async (req, res) => {
  try {
    const { userId } = req.body;

    // Validation
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Image file is required',
      });
    }

    logger.info(`[Image Analysis] Processing image: ${req.file.filename}`);

    // Call image service
    const result = await imageService.analyzeMedicineImage(req.file.path, userId);

    res.json({
      success: true,
      data: result,
    });

  } catch (error) {
    logger.error('[Image Analysis] Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * GET /api/ai/health
 * Verify AI services are working
 */
const healthCheck = async (req, res) => {
  try {
    const services = {
      chatbot: process.env.HuggingFace_API_KEY ? 'OK' : 'MISSING_API_KEY',
      speechToText: process.env.HuggingFace_API_KEY ? 'OK' : 'MISSING_API_KEY',
      imageAnalysis: process.env.HuggingFace_API_KEY ? 'OK' : 'MISSING_API_KEY',
      suggestions: 'OK',
      notifications: 'OK',
    };

    res.json({
      success: true,
      message: 'AI Services Health Check',
      services,
      timestamp: new Date(),
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * POST /api/ai/health-check (alternative endpoint)
 * Verify AI services are working
 */

module.exports = {
  chat,
  chatWithContext,
  clearChatHistory,
  generateSuggestions,
  detectHealthIssues,
  sendNotification,
  sendMedicationReminder,
  sendHealthAlert,
  sendAchievementNotification,
  subscribeToTopic,
  unsubscribeFromTopic,
  transcribeAudio,
  analyzeMedicineImage,
  healthCheck,
};
