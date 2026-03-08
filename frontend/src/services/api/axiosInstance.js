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
  (error) => Promise.reject(error)
);

export default api;
