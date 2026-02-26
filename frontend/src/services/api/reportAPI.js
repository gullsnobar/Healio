import axios from 'axios';
import apiConfig from '../../config/apiConfig';
const api = axios.create(apiConfig);

export const reportAPI = {
  getWeekly: () => api.get('/reports/weekly'),
  getMonthly: () => api.get('/reports/monthly'),
  generate: (type) => api.post('/reports/generate', { type }),
  download: (id) => api.get('/reports/' + id + '/download', { responseType: 'blob' }),
};
