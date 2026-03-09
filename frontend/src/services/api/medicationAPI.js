import api from './axiosInstance';

export const medicationAPI = {
  getAll: () => api.get('/medications'),
  getById: (id) => api.get('/medications/' + id),
  create: (data) => api.post('/medications', data),
  update: (id, data) => api.put('/medications/' + id, data),
  delete: (id) => api.delete('/medications/' + id),
  markAsTaken: (id) => api.post('/medications/' + id + '/take'),
  recordAdherence: (id, data) => api.post('/medications/' + id + '/adherence', data),
  getAdherenceHistory: (id, params) => api.get('/medications/' + id + '/adherence/history', { params }),
  getAdherenceStats: () => api.get('/medications/stats/adherence'),
};
