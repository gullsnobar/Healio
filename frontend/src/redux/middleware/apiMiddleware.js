import { secureStorage } from '../../services/storage/secureStorage';
import axios from 'axios';

// Cache token in memory to avoid async storage reads on every action
let cachedToken = null;
let tokenLoaded = false;

// Load token once at startup
const loadToken = async () => {
  if (!tokenLoaded) {
    cachedToken = await secureStorage.getToken();
    tokenLoaded = true;
    if (cachedToken) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + cachedToken;
    }
  }
};

// Initialize token on import
loadToken();

export const setAuthToken = (token) => {
  cachedToken = token;
  tokenLoaded = true;
  if (token) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const apiMiddleware = (store) => (next) => (action) => {
  // Update cached token when auth actions complete
  const result = next(action);
  if (action.type === 'auth/login/fulfilled' && action.payload?.accessToken) {
    setAuthToken(action.payload.accessToken);
  } else if (action.type === 'auth/logout/fulfilled') {
    setAuthToken(null);
  }
  return result;
};
