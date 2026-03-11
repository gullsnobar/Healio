import api from './axiosInstance';

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout', {}, { timeout: 2000 }), // Short timeout for better UX
  getMe: () => api.get('/auth/me'), // Use GET for fetching profile
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  verifyOTP: (email, otp, mode) => api.post('/auth/verify-otp', { email, otp, mode }),
  resendOTP: (email) => api.post('/auth/resend-otp', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  googleAuth: (googleToken, profile) => api.post('/auth/google', { googleToken, profile }),
  refreshToken: (refreshToken) => api.post('/auth/refresh-token', { refreshToken }),
};
