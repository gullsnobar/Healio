import axios from 'axios';
import apiConfig from '../../config/apiConfig';
const api = axios.create(apiConfig);

export const appointmentAPI = {
  getAll: () => api.get('/appointments'),
  getById: (id) => api.get('/appointments/' + id),
  create: (data) => api.post('/appointments', data),
  update: (id, data) => api.put('/appointments/' + id, data),
  delete: (id) => api.delete('/appointments/' + id),
  cancel: (id) => api.put('/appointments/' + id + '/cancel'),
};
