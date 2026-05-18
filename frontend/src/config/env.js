import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getDevHost = () => {
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const host = hostUri.split(':')[0];
    if (host) return host;
  }
  if (Platform.OS === 'android') return '10.0.2.2';
  return 'localhost';
};

const DEV_HOST = getDevHost();

const sanitizeUrl = (value) => {
  if (!value) return value;
  const v = String(value).trim();
  return v
    .replace(/^`|`$/g, '')
    .replace(/^['"]|['"]$/g, '')
    .trim();
};

const ENV = {
  development: {
    apiUrl: `http://${DEV_HOST}:5000/api`,
    aiEngineUrl: `http://${DEV_HOST}:8000`,
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

const getEnvVars = () => {
  // Expo SDK 50+: use expoConfig instead of deprecated manifest
  const releaseChannel = Constants.expoConfig?.extra?.releaseChannel;
  let env = ENV.development;
  if (releaseChannel === 'production') env = ENV.production;
  else if (releaseChannel === 'staging') env = ENV.staging;

  // Prefer explicit EXPO_PUBLIC_* values from .env if provided
  const explicitApi = sanitizeUrl(process.env.EXPO_PUBLIC_API_BASE_URL);
  const explicitAi = sanitizeUrl(process.env.EXPO_PUBLIC_AI_ENGINE_URL);
  return {
    ...env,
    apiUrl: explicitApi || env.apiUrl,
    aiEngineUrl: explicitAi || env.aiEngineUrl,
  };
};

export default getEnvVars();
