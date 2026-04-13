import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  get: async (key) => {
    try {
      const v = await AsyncStorage.getItem(key);
      return v ? JSON.parse(v) : null;
    } catch {
      return null;
    }
  },
  set: async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage set error:', e);
    }
  },
  remove: async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error('Storage remove error:', e);
    }
  },
  clear: async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.error('Storage clear error:', e);
    }
  },
};
