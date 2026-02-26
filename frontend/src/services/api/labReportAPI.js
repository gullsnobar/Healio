import axios from 'axios';
import apiConfig from '../../config/apiConfig';
const api = axios.create(apiConfig);

export const labReportAPI = {
  getAll: () => api.get('/lab-reports'),
  getById: (id) => api.get('/lab-reports/' + id),
  upload: (formData) => api.post('/lab-reports', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete('/lab-reports/' + id),
  download: (id) => api.get('/lab-reports/' + id + '/download', { responseType: 'blob' }),
};
