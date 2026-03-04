import axios from 'axios';
import apiConfig from '../../config/apiConfig';

console.log('[API] Base URL:', apiConfig.baseURL);
const api = axios.create(apiConfig);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  verifyOTP: (email, otp, mode) => api.post('/auth/verify-otp', { email, otp, mode }),
  resendOTP: (email) => api.post('/auth/resend-otp', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  googleAuth: (googleToken, profile) => api.post('/auth/google', { googleToken, profile }),
};
