import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  get: async (key) => { try { const v = await AsyncStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; } },
  set: async (key, value) => { try { await AsyncStorage.setItem(key, JSON.stringify(value)); } catch {} },
  remove: async (key) => { try { await AsyncStorage.removeItem(key); } catch {} },
  clear: async () => { try { await AsyncStorage.clear(); } catch {} },
};
