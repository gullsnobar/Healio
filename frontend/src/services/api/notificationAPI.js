import api from './axiosInstance';

export const notificationAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  markRead: (id) => api.patch('/notifications/' + id + '/read'),
  markAllRead: () => api.patch('/notifications/read-all'),
  delete: (id) => api.delete('/notifications/' + id),
  updateSettings: (settings) => api.put('/notifications/preferences', settings),
  getSettings: () => api.get('/users/profile'),
  updatePrivacy: (settings) => api.put('/users/profile', { privacySettings: settings }),
  registerDevice: (token) => api.post('/notifications/register-device', { token }),
};
