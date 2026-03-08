import api from './axiosInstance';

export const appointmentAPI = {
  getAll: () => api.get('/appointments'),
  getById: (id) => api.get('/appointments/' + id),
  create: (data) => api.post('/appointments', data),
  update: (id, data) => api.put('/appointments/' + id, data),
  delete: (id) => api.delete('/appointments/' + id),
  cancel: (id) => api.put('/appointments/' + id + '/cancel'),
};
