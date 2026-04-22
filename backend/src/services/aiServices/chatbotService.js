const axios = require('axios');
const { getAIResponse } = require('../ai/geminiService');

const HF_API_KEY = process.env.HuggingFace_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const HF_API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';
const AI_PROVIDER =
  (process.env.AI_PROVIDER || '').toLowerCase()
    || (OPENROUTER_API_KEY ? 'openrouter' : 'huggingface');

const conversationHistory = {};

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

    if (AI_PROVIDER === 'gemini') {
      const aiText = await getAIResponse(userMessage, [], 'chatbot');
      const message = aiText || "I'm thinking... Could you rephrase your question?";
      return {
        success: true,
        message,
        model: 'gemini-pro',
      };
    }

    if (AI_PROVIDER === 'openrouter') {
      if (!OPENROUTER_API_KEY) {
        throw new Error('OpenRouter API key not configured');
      }

      console.log(`📝 [Chatbot] User ${userId} sent message (OpenRouter): "${userMessage.substring(0, 50)}..."`);

      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'meta-llama/llama-3-8b-instruct',
          messages: [
            {
              role: 'user',
              content: userMessage.trim(),
            },
          ],
          temperature: 0.7,
          top_p: 0.95,
          top_k: 40,
          max_tokens: 500,
        },
        {
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
            'X-OpenRouter-Title': 'MR & FT Health Assistant',
          },
          timeout: 30000,
        }
      );

      const data = response.data || {};
      const reply =
        (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content)
        || "I'm thinking... Could you rephrase your question?";

      console.log(`✅ [Chatbot] OpenRouter response generated: ${reply.substring(0, 50)}...`);

      return {
        success: true,
        message: reply,
        model: data.model || 'meta-llama/llama-3-8b-instruct',
      };
    }

    if (!HF_API_KEY) {
      throw new Error('Hugging Face API key not configured');
    }

    console.log(`📝 [Chatbot] User ${userId} sent message: "${userMessage.substring(0, 50)}..."`);

    const prompt = formatPrompt(userMessage);

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

    console.log(`✅ [Chatbot] Response generated: ${aiResponse.substring(0, 50)}...`);

    return {
      success: true,
      message: aiResponse,
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
    };
  } catch (error) {
    console.error(`❌ [Chatbot] Error for user ${userId}:`, error.message);

    // If external API fails (404, 5xx, network), return a graceful fallback
    let friendlyMessage = "I'm having trouble generating a full response right now. Please try again later.";
    if (error.message.includes('timeout')) {
      friendlyMessage = 'AI model is loading. Please try again in a moment.';
    }
    if (error.message.includes('API key')) {
      friendlyMessage = 'AI service is not configured correctly. Please contact support.';
    }

    return {
      success: false,
      message: friendlyMessage,
      model: 'unavailable',
    };
  }
};

const chatWithContext = async (userId, userMessage) => {
  try {
    if (!userId || !userMessage) {
      throw new Error('userId and message are required');
    }

    if (!conversationHistory[userId]) {
      conversationHistory[userId] = [];
    }

    let history = conversationHistory[userId];
    if (history.length > 5) {
      history = history.slice(-5);
    }
    let aiResponse = '';

    if (AI_PROVIDER === 'gemini') {
      const geminiHistory = history.flatMap((turn) => [
        { role: 'user', content: turn.user },
        { role: 'assistant', content: turn.assistant },
      ]);

      aiResponse = await getAIResponse(userMessage, geminiHistory, 'chatbot');
      aiResponse = aiResponse || "I'm thinking... Could you rephrase your question?";
    } else {
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
    }

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
