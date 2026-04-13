import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Get environment variables from multiple sources
const getEnvVar = (key, defaultValue = null) => {
  // Priority 1: app.json extra field (most reliable for Expo)
  const value = Constants.expoConfig?.extra?.[key];
  if (value) {
    console.log(`[ENV] ${key} from app.json:`, value);
    return value;
  }
  
  // Priority 2: process.env (environment variables / .env file)
  const envValue = process.env[key];
  if (envValue) {
    console.log(`[ENV] ${key} from process.env:`, envValue);
    return envValue;
  }
  
  // Priority 3: Default value
  console.log(`[ENV] ${key} not found, using default:`, defaultValue);
  return defaultValue;
};

// Determine API URL
const apiUrl = getEnvVar(
  'EXPO_PUBLIC_API_BASE_URL',
  Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api'
);

const aiEngineUrl = getEnvVar(
  'EXPO_PUBLIC_AI_ENGINE_URL',
  Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000'
);

console.log('[ENV] ✅ Final configuration:', { 
  apiUrl, 
  aiEngineUrl, 
  platform: Platform.OS,
  isDev: process.env.NODE_ENV === 'development'
});

export default {
  apiUrl,
  aiEngineUrl,
  enableDebug: true,
};
