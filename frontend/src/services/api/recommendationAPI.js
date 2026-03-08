import api from './axiosInstance';

export const recommendationAPI = {
  getAll: () => api.get('/recommendations'),
  getWeeklyInsights: () => api.get('/recommendations/insights'),
  generate: () => api.post('/recommendations/generate'),
};
