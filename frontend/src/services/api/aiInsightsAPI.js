import api from './axiosInstance';

export const aiInsightsAPI = {
  /** Full AI analysis — recommendations + daily summary + weekly feedback */
  getHealthInsights: (days = 7) => api.get('/ai/health-insights', { params: { days } }),

  /** Today's numbers only */
  getDailySummary: () => api.get('/ai/daily-summary'),

  /** Weekly activity feedback */
  getWeeklyFeedback: () => api.get('/ai/weekly-feedback'),

  /** Medication-specific alerts */
  getMedicationAlerts: () => api.get('/ai/medication-alerts'),
};
