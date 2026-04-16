/**
 * AI CHATBOT SERVICE
 * Uses OpenAI GPT-3.5-Turbo for health-related queries
 * Production-ready with error handling and logging
 * 
 * NOTE: Switched from Hugging Face to OpenAI because:
 * - Hugging Face free API deprecated (410 error)
 * - OpenAI API key already configured in .env
 * - Faster and more reliable responses
 * - Easy to switch providers later if needed
 */

const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// In-memory conversation history (use Redis/MongoDB in production)
const conversationHistory = {};

const SYSTEM_PROMPT = `You are a helpful health and medication assistant for the HEALIO app.
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

    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    console.log(`📝 [Chatbot] User ${userId} sent message: "${userMessage.substring(0, 50)}..."`);

    // Call OpenAI API
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
        max_tokens: 250,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    // Extract response
    let aiResponse = '';
    if (response.data?.choices?.[0]?.message?.content) {
      aiResponse = response.data.choices[0].message.content.trim();
    }

    if (!aiResponse) {
      aiResponse = "I'm thinking... Could you rephrase your question?";
    }

    console.log(`✅ [Chatbot] Response generated: ${aiResponse.substring(0, 50)}...`);

    return {
      success: true,
      message: aiResponse,
      model: 'gpt-3.5-turbo',
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

    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    console.log(`📝 [Chatbot Context] User ${userId} message in conversation`);

    // Build messages array with conversation history
    const messages = [
      {
        role: 'system',
        content: SYSTEM_PROMPT,
      },
    ];

    // Add conversation history (last 5 exchanges)
    const history = conversationHistory[userId].slice(-5);
    for (const exchange of history) {
      messages.push({
        role: 'user',
        content: exchange.user,
      });
      messages.push({
        role: 'assistant',
        content: exchange.assistant,
      });
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: userMessage,
    });

    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 250,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    let aiResponse = '';
    if (response.data?.choices?.[0]?.message?.content) {
      aiResponse = response.data.choices[0].message.content.trim();
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

