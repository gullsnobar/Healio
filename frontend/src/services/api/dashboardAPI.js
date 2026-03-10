import api from './axiosInstance';

export const dashboardAPI = {
  getDashboardData: () => api.get('/dashboard'),
  getHealthScore: () => api.get('/dashboard/health-score'),
  getQuickStats: () => api.get('/dashboard/quick-stats'),
};
