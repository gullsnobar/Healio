import api from './axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Unified API Service with error handling, caching, and retry logic
 * Production-grade implementation for enterprise reliability
 */
class APIService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes default
    this.retryConfig = {
      maxRetries: 3,
      retryDelay: 1000,
      retryableStatuses: [408, 429, 500, 502, 503, 504],
    };
  }

  /**
   * Execute request with retry logic
   */
  async executeWithRetry(fn, retries = 0) {
    try {
      return await fn();
    } catch (error) {
      const shouldRetry =
        retries < this.retryConfig.maxRetries &&
        (error.response?.status === undefined ||
         this.retryConfig.retryableStatuses.includes(error.response?.status));

      if (shouldRetry) {
        const delay = this.retryConfig.retryDelay * Math.pow(2, retries);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.executeWithRetry(fn, retries + 1);
      }
      throw error;
    }
  }

  /**
   * Get from cache with TTL validation
   */
  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      console.log('[Cache HIT]', key);
      return cached.data;
    }
    if (cached) {
      this.cache.delete(key);
    }
    return null;
  }

  /**
   * Set cache with timestamp
   */
  setCache(key, data) {
    this.cache.set(key, { data, timestamp: Date.now() });
    console.log('[Cache SET]', key);
  }

  /**
   * Clear specific or all cache
   */
  clearCache(key = null) {
    if (key) {
      this.cache.delete(key);
      console.log('[Cache CLEAR]', key);
    } else {
      this.cache.clear();
      console.log('[Cache CLEAR ALL]');
    }
  }

  /**
   * Format error response for consistent handling
   */
  formatError(error) {
    const message =
      error.response?.data?.message ||
      error.response?.statusText ||
      error.message ||
      'An unexpected error occurred';

    const statusCode = error.response?.status || 500;

    return {
      success: false,
      status: statusCode,
      message,
      data: null,
      error: {
        code: error.code,
        status: statusCode,
        details: error.response?.data || error.message,
      },
    };
  }

  /**
   * Generic GET request with caching
   */
  async get(url, options = {}) {
    const cacheKey = `GET:${url}`;
    const useCache = options.useCache !== false;

    // Check cache first
    if (useCache) {
      const cached = this.getFromCache(cacheKey);
      if (cached) return { success: true, data: cached, cached: true };
    }

    try {
      const response = await this.executeWithRetry(() => api.get(url, options));
      const data = response.data;
      
      // Cache successful responses
      if (useCache && response.status === 200) {
        this.setCache(cacheKey, data);
      }

      return {
        success: true,
        status: response.status,
        data,
        cached: false,
      };
    } catch (error) {
      return this.formatError(error);
    }
  }

  /**
   * Generic POST request (no caching)
   */
  async post(url, data, options = {}) {
    try {
      const response = await this.executeWithRetry(() =>
        api.post(url, data, options)
      );

      // Invalidate related cache on POST
      this._invalidateRelatedCache(url);

      return {
        success: true,
        status: response.status,
        data: response.data,
      };
    } catch (error) {
      return this.formatError(error);
    }
  }

  /**
   * Generic PUT request
   */
  async put(url, data, options = {}) {
    try {
      const response = await this.executeWithRetry(() =>
        api.put(url, data, options)
      );

      // Invalidate related cache on PUT
      this._invalidateRelatedCache(url);

      return {
        success: true,
        status: response.status,
        data: response.data,
      };
    } catch (error) {
      return this.formatError(error);
    }
  }

  /**
   * Generic DELETE request
   */
  async delete(url, options = {}) {
    try {
      const response = await this.executeWithRetry(() =>
        api.delete(url, options)
      );

      // Invalidate related cache on DELETE
      this._invalidateRelatedCache(url);

      return {
        success: true,
        status: response.status,
        data: response.data,
      };
    } catch (error) {
      return this.formatError(error);
    }
  }

  /**
   * Batch request handler
   */
  async batch(requests) {
    try {
      const responses = await Promise.all(
        requests.map((req) => {
          const { method, url, data } = req;
          if (method === 'GET') return this.get(url);
          if (method === 'POST') return this.post(url, data);
          if (method === 'PUT') return this.put(url, data);
          if (method === 'DELETE') return this.delete(url);
          return Promise.resolve({ success: false, message: 'Unknown method' });
        })
      );

      return {
        success: responses.every((r) => r.success),
        data: responses,
      };
    } catch (error) {
      return this.formatError(error);
    }
  }

  /**
   * Smart cache invalidation - clear related cache entries
   */
  _invalidateRelatedCache(url) {
    const basePath = url.split('?')[0].split('/').slice(0, -1).join('/');
    for (const [key] of this.cache) {
      if (key.includes(basePath)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Sync local changes to backend
   */
  async syncData(endpoint, localData) {
    console.log('[SYNC] Attempting to sync:', endpoint);
    try {
      const response = await this.post(endpoint, localData);
      if (response.success) {
        console.log('[SYNC] Success:', endpoint);
        await AsyncStorage.setItem(
          `sync_${endpoint}`,
          JSON.stringify({ synced: true, timestamp: Date.now() })
        );
      }
      return response;
    } catch (error) {
      console.error('[SYNC] Failed:', endpoint, error.message);
      // Store for retry on next sync
      await AsyncStorage.setItem(
        `pending_sync_${endpoint}`,
        JSON.stringify(localData)
      );
      return this.formatError(error);
    }
  }

  /**
   * Retry pending syncs when connection is restored
   */
  async retrySyncQueue() {
    console.log('[SYNC] Retrying sync queue...');
    const keys = await AsyncStorage.getAllKeys();
    const pendingKeys = keys.filter((k) => k.startsWith('pending_sync_'));

    for (const key of pendingKeys) {
      const endpoint = key.replace('pending_sync_', '');
      const data = JSON.parse(await AsyncStorage.getItem(key));
      const result = await this.syncData(endpoint, data);
      if (result.success) {
        await AsyncStorage.removeItem(key);
      }
    }
  }
}

// Export singleton instance
export default new APIService();
