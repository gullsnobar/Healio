import { secureStorage } from '../../services/storage/secureStorage';
import axios from 'axios';

export const apiMiddleware = (store) => (next) => async (action) => {
  // Attach token to all API requests
  const token = await secureStorage.getToken();
  if (token) axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  return next(action);
};
