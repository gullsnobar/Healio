import api from './axiosInstance';

export const dashboardAPI = {
  getDashboardData: (date) => api.get('/dashboard', {
    params: date ? { date } : undefined,
  }),
  getHealthScore: () => api.get('/dashboard/health-score'),
  getQuickStats: () => api.get('/dashboard/quick-stats'),
};
