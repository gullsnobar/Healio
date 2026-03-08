import api from './axiosInstance';

export const trustedContactAPI = {
  getAll: () => api.get('/trusted-contacts'),
  add: (data) => api.post('/trusted-contacts', data),
  update: (id, data) => api.put('/trusted-contacts/' + id, data),
  delete: (id) => api.delete('/trusted-contacts/' + id),
  updateAlertSettings: (id, settings) => api.put('/trusted-contacts/' + id + '/alerts', settings),
};
