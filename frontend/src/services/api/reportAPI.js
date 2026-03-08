import api from './axiosInstance';

export const reportAPI = {
  getWeekly: () => api.get('/reports/weekly'),
  getMonthly: () => api.get('/reports/monthly'),
  generate: (type) => api.post('/reports/generate', { type }),
  download: (id) => api.get('/reports/' + id + '/download', { responseType: 'blob' }),
};
