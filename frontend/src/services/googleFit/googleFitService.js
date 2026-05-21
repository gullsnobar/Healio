// Google Fit integration service
import { Platform } from 'react-native';
import { googleFitAuth } from './googleFitAuth';

// react-native-google-fit is a native module — only available on Android/iOS
let GoogleFit = null;
if (Platform.OS === 'android' || Platform.OS === 'ios') {
  try { GoogleFit = require('react-native-google-fit').default; } catch (_) {}
}

const IS_NATIVE = Platform.OS === 'android' || Platform.OS === 'ios';

class GoogleFitService {
  constructor() {
    this.isInitialized = false;
  }

  /**
   * Initialize Google Fit SDK with proper scopes and error handling
   */
  async initialize() {
    try {
      if (!IS_NATIVE || !GoogleFit) {
        console.warn('[GoogleFit] Not available on this platform');
        return false;
      }
      if (this.isInitialized) return true;
      
      const authorized = await googleFitAuth.initialize();
      if (!authorized) {
        throw new Error('Google Fit authorization failed');
      }
      
      this.isInitialized = true;
      console.log('[GoogleFit] Initialized successfully');
      return true;
    } catch (error) {
      console.error('[GoogleFit] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Request fitness data permissions from device
   */
  async requestPermissions() {
    try {
      if (!IS_NATIVE || !GoogleFit) return false;
      const result = await googleFitAuth.initialize();
      return result;
    } catch (error) {
      console.error('[GoogleFit] Request permissions failed:', error);
      throw error;
    }
  }

  /**
   * Fetch step count for a date range
   */
  async getSteps(startDate, endDate) {
    try {
      if (!IS_NATIVE || !GoogleFit) return 0;
      const opts = {
        startDate: startDate.getTime(),
        endDate: endDate.getTime(),
        bucketUnit: 'DAY',
        bucketInterval: 1,
      };
      const result = await GoogleFit.getDailyStepCountSample(opts);
      const totalSteps = result.reduce((sum, day) => sum + (day.value || 0), 0);
      console.log('[GoogleFit] Steps fetched:', totalSteps);
      return totalSteps;
    } catch (error) {
      console.error('[GoogleFit] getSteps error:', error);
      return 0;
    }
  }

  /**
   * Fetch sleep data for a date range
   */
  async getSleep(startDate, endDate) {
    try {
      if (!IS_NATIVE || !GoogleFit) return { duration: 0, samples: [] };
      const opts = {
        startDate: startDate.getTime(),
        endDate: endDate.getTime(),
      };
      const result = await GoogleFit.getSleepSamples(opts);
      if (!result || result.length === 0) {
        return { duration: 0, samples: [] };
      }
      let totalDuration = 0;
      result.forEach((sleep) => {
        const duration = (sleep.endDate - sleep.startDate) / (1000 * 60);
        totalDuration += duration;
      });
      console.log('[GoogleFit] Sleep fetched:', totalDuration, 'minutes');
      return { duration: Math.round(totalDuration / 60), samples: result };
    } catch (error) {
      console.error('[GoogleFit] getSleep error:', error);
      return { duration: 0, samples: [] };
    }
  }

  /**
   * Fetch calories burned for a date range
   */
  async getCalories(startDate, endDate) {
    try {
      if (!IS_NATIVE || !GoogleFit) return 0;
      const opts = {
        startDate: startDate.getTime(),
        endDate: endDate.getTime(),
        bucketUnit: 'DAY',
        bucketInterval: 1,
      };
      const result = await GoogleFit.getDailyCalorieBurnedSamples(opts);
      const totalCalories = result.reduce((sum, day) => sum + (day.value || 0), 0);
      console.log('[GoogleFit] Calories fetched:', totalCalories);
      return totalCalories;
    } catch (error) {
      console.error('[GoogleFit] getCalories error:', error);
      return 0;
    }
  }

  /**
   * Fetch heart rate data for a date range
   */
  async getHeartRate(startDate, endDate) {
    try {
      if (!IS_NATIVE || !GoogleFit) return { average: 0, samples: [] };
      const opts = {
        startDate: startDate.getTime(),
        endDate: endDate.getTime(),
      };
      const result = await GoogleFit.getHeartRateSamples(opts);
      if (!result || result.length === 0) {
        return { average: 0, samples: [] };
      }
      const values = result.map((r) => r.value).filter((v) => v);
      const average = values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
      console.log('[GoogleFit] Heart rate fetched - Average:', average);
      return { average, samples: result };
    } catch (error) {
      console.error('[GoogleFit] getHeartRate error:', error);
      return { average: 0, samples: [] };
    }
  }

  /**
   * Sync all available fitness data
   */
  async syncAll() {
    try {
      if (!IS_NATIVE || !GoogleFit) {
        console.warn('[GoogleFit] syncAll skipped — not available on this platform');
        return {
          date: new Date().toISOString().split('T')[0],
          steps: { count: 0, goal: 10000 },
          sleep: { duration: 0, goal: 8 },
          calories: { burned: 0, goal: 2500 },
          heartRate: { average: 0 },
          source: 'manual',
          syncedAt: new Date(),
        };
      }
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 1);

      const [steps, sleep, calories, heartRate] = await Promise.all([
        this.getSteps(startDate, endDate),
        this.getSleep(startDate, endDate),
        this.getCalories(startDate, endDate),
        this.getHeartRate(startDate, endDate),
      ]);

      const syncedData = {
        date: new Date().toISOString().split('T')[0],
        steps: { count: steps, goal: 10000 },
        sleep: { duration: sleep.duration, goal: 8 },
        calories: { burned: calories, goal: 2500 },
        heartRate: { average: heartRate.average },
        source: 'google_fit',
        syncedAt: new Date(),
      };

      console.log('[GoogleFit] Sync complete:', syncedData);
      return syncedData;
    } catch (error) {
      console.error('[GoogleFit] syncAll error:', error);
      throw error;
    }
  }
}

export default new GoogleFitService();

