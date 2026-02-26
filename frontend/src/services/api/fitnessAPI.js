import axios from 'axios';
import apiConfig from '../../config/apiConfig';
const api = axios.create(apiConfig);

export const fitnessAPI = {
  getDaily: () => api.get('/fitness/daily'),
  getWeekly: () => api.get('/fitness/weekly'),
  syncGoogleFit: (data) => api.post('/fitness/sync', data),
  logManual: (data) => api.post('/fitness/manual', data),
  logWater: (data) => api.post('/fitness/water', data),
  logDiet: (data) => api.post('/fitness/diet', data),
  logSleep: (data) => api.post('/fitness/sleep', data),
};
