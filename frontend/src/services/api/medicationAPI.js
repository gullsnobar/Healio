import axios from 'axios';
import apiConfig from '../../config/apiConfig';
const api = axios.create(apiConfig);

export const medicationAPI = {
  getAll: () => api.get('/medications'),
  getById: (id) => api.get('/medications/' + id),
  create: (data) => api.post('/medications', data),
  update: (id, data) => api.put('/medications/' + id, data),
  delete: (id) => api.delete('/medications/' + id),
  markAsTaken: (id) => api.post('/medications/' + id + '/take'),
  getLogs: (id) => api.get('/medications/' + id + '/logs'),
};
