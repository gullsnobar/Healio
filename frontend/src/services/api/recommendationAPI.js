import axios from 'axios';
import apiConfig from '../../config/apiConfig';
const api = axios.create(apiConfig);

export const recommendationAPI = {
  getAll: () => api.get('/recommendations'),
  getWeeklyInsights: () => api.get('/recommendations/insights'),
  generate: () => api.post('/recommendations/generate'),
};
