import { storage } from './asyncStorage';

const CACHE_PREFIX = 'cache_';
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

export const cacheService = {
  get: async (key) => {
    const item = await storage.get(CACHE_PREFIX + key);
    if (!item) return null;
    if (Date.now() > item.expiry) { await storage.remove(CACHE_PREFIX + key); return null; }
    return item.data;
  },
  set: async (key, data, ttl = DEFAULT_TTL) => {
    await storage.set(CACHE_PREFIX + key, { data, expiry: Date.now() + ttl });
  },
  clear: async (key) => storage.remove(CACHE_PREFIX + key),
};
