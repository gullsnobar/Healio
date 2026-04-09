/**
 * AI CHATBOT SERVICE
 * Uses Hugging Face Mistral-7B for health-related queries
 * Production-ready with error handling and logging
 */

const axios = require('axios');

const HF_API_KEY = process.env.HuggingFace_API_KEY;
const HF_API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';

// In-memory conversation history (use Redis/MongoDB in production)
const conversationHistory = {};

/**
 * Format message with health assistant system prompt
 */
const formatPrompt = (message, history = []) => {
  const systemPrompt = `You are a helpful health and medication assistant for the HEALIO app.
Your responsibilities:
- Provide accurate, safe, and simple health information
- Give medication reminders and wellness tips
- Be empathetic and supportive
- Always recommend consulting a doctor for serious conditions
- Keep responses concise (2-3 sentences max)
- Avoid medical claims you cannot verify

Guidelines:
- If asked about emergencies, advise calling emergency services
- If unsure, say "I recommend consulting your doctor"
- Focus on prevention and wellness
- Be conversational and friendly`;

  const historyText = history
    .map((msg) => `User: ${msg.user}\nAssistant: ${msg.assistant}`)
    .join('\n\n');

  const fullPrompt = `${systemPrompt}

${historyText ? `Previous conversation:\n${historyText}\n\n` : ''}User: ${message}
Assistant:`;

  return fullPrompt;
};

/**
 * Chat with AI Health Assistant (Single turn)
 * @param {string} userMessage - User's message/query
 * @param {string} userId - User ID for logging
 * @returns {Promise<object>} - AI response
 */
const chatWithAI = async (userMessage, userId = 'unknown') => {
  try {
    // Validate input
    if (!userMessage || typeof userMessage !== 'string') {
      throw new Error('Invalid message: must be a non-empty string');
    }

    if (userMessage.trim().length === 0) {
      throw new Error('Message cannot be empty');
    }

    if (userMessage.length > 2000) {
      throw new Error('Message too long (max 2000 characters)');
    }

    if (!HF_API_KEY) {
      throw new Error('Hugging Face API key not configured');
    }

    console.log(`📝 [Chatbot] User ${userId} sent message: "${userMessage.substring(0, 50)}..."`);

    const prompt = formatPrompt(userMessage);

    // Call Hugging Face API
    const response = await axios.post(
      HF_API_URL,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 250,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    // Extract generated text
    let aiResponse = '';
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      aiResponse = response.data[0].generated_text || '';

      // Extract only the assistant's response (after "Assistant:")
      const assistantIndex = aiResponse.indexOf('Assistant:');
      if (assistantIndex !== -1) {
        aiResponse = aiResponse.substring(assistantIndex + 10).trim();
      }

      // Remove any leftover prompt text
      aiResponse = aiResponse.split('User:')[0].trim();
    }

    if (!aiResponse) {
      aiResponse = "I'm thinking... Could you rephrase your question?";
    }

    console.log(`✅ [Chatbot] Response generated: ${aiResponse.substring(0, 50)}...`);

    return {
      success: true,
      message: aiResponse,
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
    };
  } catch (error) {
    console.error(`❌ [Chatbot] Error for user ${userId}:`, error.message);

    // Friendly error messages
    if (error.message.includes('timeout')) {
      throw new Error('AI model is loading. Please try again in a moment.');
    }
    if (error.message.includes('API key')) {
      throw new Error('AI service temporarily unavailable. Please try again later.');
    }

    throw error;
  }
};

/**
 * Multi-turn conversation with memory
 * @param {string} userId - User ID
 * @param {string} userMessage - User's message
 * @returns {Promise<object>} - AI response with context
 */
const chatWithContext = async (userId, userMessage) => {
  try {
    if (!userId || !userMessage) {
      throw new Error('userId and message are required');
    }

    // Initialize or get conversation history
    if (!conversationHistory[userId]) {
      conversationHistory[userId] = [];
    }

    // Keep only last 5 exchanges for context
    let history = conversationHistory[userId];
    if (history.length > 5) {
      history = history.slice(-5);
    }

    if (!HF_API_KEY) {
      throw new Error('Hugging Face API key not configured');
    }

    console.log(`📝 [Chatbot Context] User ${userId} message in conversation`);

    const prompt = formatPrompt(userMessage, history);

    const response = await axios.post(
      HF_API_URL,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 250,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    let aiResponse = '';
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      aiResponse = response.data[0].generated_text || '';

      const assistantIndex = aiResponse.indexOf('Assistant:');
      if (assistantIndex !== -1) {
        aiResponse = aiResponse.substring(assistantIndex + 10).trim();
      }

      aiResponse = aiResponse.split('User:')[0].trim();
    }

    if (!aiResponse) {
      aiResponse = "I'm thinking... Could you rephrase your question?";
    }

    // Store in history
    conversationHistory[userId].push({
      user: userMessage,
      assistant: aiResponse,
    });

    console.log(`✅ [Chatbot Context] Conversation updated for user ${userId}`);

    return {
      success: true,
      message: aiResponse,
      conversationLength: conversationHistory[userId].length,
    };
  } catch (error) {
    console.error(`❌ [Chatbot Context] Error for user ${userId}:`, error.message);
    throw error;
  }
};

/**
 * Clear conversation history for a user
 */
const clearUserHistory = (userId) => {
  if (conversationHistory[userId]) {
    delete conversationHistory[userId];
    console.log(`🧹 [Chatbot] Cleared history for user ${userId}`);
    return true;
  }
  return false;
};

module.exports = {
  chatWithAI,
  chatWithContext,
  clearUserHistory,
};

