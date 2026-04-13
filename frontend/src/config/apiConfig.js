import env from './env';

const apiConfig = {
  baseURL: env.apiUrl,
  timeout: 30000,  // Increased from 15000 to 30000ms
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

export default apiConfig;
