import api from './axiosInstance';

export const healthInsightAPI = {
  getInsights: (params) => api.get('/health-insights', { params }),
  generateInsights: () => api.post('/health-insights/generate'),
  getSummary: () => api.get('/health-insights/summary'),
  markAsRead: (id) => api.patch(`/health-insights/${id}/read`),
  dismiss: (id) => api.patch(`/health-insights/${id}/dismiss`),
  completeAction: (id, actionIndex) => api.patch(`/health-insights/${id}/action/${actionIndex}`),
};
