import api from './axiosInstance';

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  updatePassword: (data) => api.put('/users/password', data),
  deleteAccount: () => api.delete('/users/account'),
  uploadProfileImage: (formData) =>
    api.post('/users/profile-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};
