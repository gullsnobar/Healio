import Constants from 'expo-constants';

const ENV = {
  development: {
    apiUrl: 'http://localhost:5000/api',
    aiEngineUrl: 'http://localhost:8000',
    enableDebug: true,
  },
  staging: {
    apiUrl: 'https://staging-api.healio.com/api',
    aiEngineUrl: 'https://staging-ai.healio.com',
    enableDebug: true,
  },
  production: {
    apiUrl: 'https://api.healio.com/api',
    aiEngineUrl: 'https://ai.healio.com',
    enableDebug: false,
  },
};

const getEnvVars = (env = Constants.manifest?.releaseChannel) => {
  if (env === 'production') return ENV.production;
  if (env === 'staging') return ENV.staging;
  return ENV.development;
};

export default getEnvVars();
