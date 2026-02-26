const axios = require('axios');
const Recommendation = require('../../models/Recommendation');
const { aiEngineUrl } = require('../../config/environment');

exports.generateRecommendations = async (userId, userData) => {
  try {
    const response = await axios.post(aiEngineUrl + '/api/recommendations', { userId: userId.toString(), ...userData });
    const recs = response.data.recommendations || [];
    const saved = await Promise.all(recs.map(r => Recommendation.create({ user: userId, ...r, source: 'ai' })));
    return saved;
  } catch (error) {
    return [];
  }
};

exports.detectMissedDosePattern = async (userId, adherenceData) => {
  try {
    const response = await axios.post(aiEngineUrl + '/api/detect-missed-dose', { userId: userId.toString(), adherenceData });
    return response.data;
  } catch { return { detected: false }; }
};
