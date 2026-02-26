import axios from 'axios';
import apiConfig from '../../config/apiConfig';
const api = axios.create(apiConfig);

export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.put('/notifications/' + id + '/read'),
  markAllRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete('/notifications/' + id),
  updateSettings: (settings) => api.put('/notifications/settings', settings),
  registerDevice: (token) => api.post('/notifications/register-device', { token }),
};
