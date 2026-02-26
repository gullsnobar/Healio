import AsyncStorage from '@react-native-async-storage/async-storage';
// In production, use expo-secure-store for sensitive data
export const secureStorage = {
  getToken: async () => AsyncStorage.getItem('auth_token'),
  setToken: async (token) => AsyncStorage.setItem('auth_token', token),
  removeToken: async () => AsyncStorage.removeItem('auth_token'),
};
