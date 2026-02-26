import env from './env';

const apiConfig = {
  baseURL: env.apiUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

export default apiConfig;
