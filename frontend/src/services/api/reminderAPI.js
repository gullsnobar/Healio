import axios from 'axios';
import apiConfig from '../../config/apiConfig';
const api = axios.create(apiConfig);

export const reminderAPI = {
  getAll: (params) => api.get('/reminders', { params }),
  getById: (id) => api.get('/reminders/' + id),
  getUpcoming: (hours) => api.get('/reminders/upcoming', { params: { hours } }),
  create: (data) => api.post('/reminders', data),
  update: (id, data) => api.put('/reminders/' + id, data),
  delete: (id) => api.delete('/reminders/' + id),
  complete: (id) => api.patch('/reminders/' + id + '/complete'),
  snooze: (id, minutes) => api.patch('/reminders/' + id + '/snooze', { minutes }),
};
