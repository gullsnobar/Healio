import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiConfig from '../../config/apiConfig';

const api = axios.create(apiConfig);

// Attach the auth token on every request
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle 401 responses by refreshing the token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't retry if: not 401, already retried, or url doesn't exist
    if (error.response?.status !== 401 || originalRequest._retry || !originalRequest.url) {
      return Promise.reject(error);
    }

    // Don't try to refresh if this was already a refresh request (avoid infinite loop)
    if (originalRequest.url.includes('/auth/refresh-token') || originalRequest.url.includes('/auth/logout')) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = 'Bearer ' + token;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      if (!refreshToken) {
        const error = new Error('Session expired: Please log in again');
        error.code = 'NO_REFRESH_TOKEN';
        error.requiresReLogin = true;
        throw error;
      }

      // Use a plain axios call to avoid interceptor loops
      const res = await axios.post(
        apiConfig.baseURL + '/auth/refresh-token',
        { refreshToken },
        { headers: { 'Content-Type': 'application/json' } },
      );

      const { accessToken, refreshToken: newRefreshToken } = res.data.data;
      await AsyncStorage.setItem('auth_token', accessToken);
      if (newRefreshToken) {
        await AsyncStorage.setItem('refresh_token', newRefreshToken);
      }

      processQueue(null, accessToken);
      originalRequest.headers.Authorization = 'Bearer ' + accessToken;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      // Clear tokens — user must log in again
      await AsyncStorage.multiRemove(['auth_token', 'refresh_token']);
      // Preserve the error code if it exists
      if (refreshError.requiresReLogin) {
        refreshError.message = 'Session expired: Please log in again';
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
