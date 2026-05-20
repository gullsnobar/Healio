import api from './axiosInstance';

export const notificationAPI = {
  // Notification CRUD
  getAll: (params) => api.get('/notifications', { params }),
  markRead: (id) => api.patch('/notifications/' + id + '/read'),
  markAllRead: () => api.patch('/notifications/read-all'),
  delete: (id) => api.delete('/notifications/' + id),

  // Notification preferences (stored on user profile)
  updateSettings: (settings) => api.put('/notifications/preferences', settings),
  getSettings: () => api.get('/users/profile'),

  // Privacy settings (stored on user profile)
  updatePrivacy: (settings) => api.put('/users/profile', { privacySettings: settings }),

  // Device push token registration
  registerDevice: (token) => api.post('/notifications/register-device', { token }),
};
