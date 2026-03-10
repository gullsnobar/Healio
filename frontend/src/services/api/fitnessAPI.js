import api from './axiosInstance';

export const fitnessAPI = {
  getDaily: () => api.get('/fitness', { params: { date: new Date().toISOString().split('T')[0] } }),
  getWeekly: () => api.get('/fitness/stats/weekly'),
  getWeeklyStats: () => api.get('/fitness/stats/weekly'),
  getWeeklyChart: () => api.get('/fitness/stats/weekly-chart'),
  getMonthly: () => api.get('/fitness/stats/monthly'),
  syncGoogleFit: (data) => api.post('/fitness/sync', data),
  logManual: (data) => api.post('/fitness/manual', data),
  logWater: (data) => api.post('/fitness/water', data),
  logDiet: (data) => api.post('/fitness/diet', data),
  logSleep: (data) => api.post('/fitness/manual', data),
  logExercise: (data) => api.post('/fitness/exercise', data),
  updateGoals: (data) => api.put('/fitness/goals', data),
  getMealHistory: (params) => api.get('/fitness/diet/history', { params }),
  deleteMeal: (mealId) => api.delete(`/fitness/diet/${mealId}`),
};
