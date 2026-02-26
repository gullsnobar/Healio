const axios = require('axios');
const logger = require('../../utils/logger');

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

exports.getAIResponse = async (message, history = [], context = 'general') => {
  try {
    const systemPrompt = 'You are HEALIO AI, a helpful health assistant. Context: ' + context + '. Provide health information, never diagnose. Recommend consulting healthcare professionals for serious concerns.';
    const contents = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: 'I understand. I am HEALIO AI, a health assistant.' }] },
      ...history.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
      { role: 'user', parts: [{ text: message }] },
    ];
    const response = await axios.post(GEMINI_URL + '?key=' + process.env.GEMINI_API_KEY, { contents, generationConfig: { temperature: 0.7, maxOutputTokens: 1024 } });
    return response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'I could not generate a response. Please try again.';
  } catch (error) {
    logger.error('Gemini API error:', error.message);
    return 'I am having trouble responding right now. Please try again later.';
  }
};

exports.analyzeLabReport = async (results, testType) => {
  try {
    const prompt = 'Analyze these lab results for ' + testType + ': ' + JSON.stringify(results) + '. Provide summary, recommendations, and risk factors in JSON with keys: summary, recommendations (array), riskFactors (array).';
    const response = await axios.post(GEMINI_URL + '?key=' + process.env.GEMINI_API_KEY, { contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0.3 } });
    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    return JSON.parse(text.replace(/`json\n?|\n?`/g, ''));
  } catch (error) {
    logger.error('Lab analysis error:', error.message);
    return { summary: 'Analysis unavailable', recommendations: [], riskFactors: [] };
  }
};
