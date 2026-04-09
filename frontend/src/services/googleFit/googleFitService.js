// Google Fit integration service
import GoogleFit from 'react-native-google-fit';
import { googleFitAuth } from './googleFitAuth';

class GoogleFitService {
  constructor() {
    this.isInitialized = false;
  }

  /**
   * Initialize Google Fit SDK with proper scopes and error handling
   */
  async initialize() {
    try {
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
      const result = await googleFitAuth.initialize();
      return result;
    } catch (error) {
      console.error('[GoogleFit] Request permissions failed:', error);
      throw error;
    }
  }

  /**
   * Fetch step count for a date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<number>} Total steps
   */
  async getSteps(startDate, endDate) {
    try {
      const opts = {
        startDate: startDate.getTime(),
        endDate: endDate.getTime(),
        bucketUnit: 'DAY',
        bucketInterval: 1,
      };

      const result = await GoogleFit.getDailyStepCountSample(opts);
      
      // Sum up all steps from the result
      const totalSteps = result.reduce((sum, day) => {
        return sum + (day.value || 0);
      }, 0);

      console.log('[GoogleFit] Steps fetched:', totalSteps);
      return totalSteps;
    } catch (error) {
      console.error('[GoogleFit] getSteps error:', error);
      return 0;
    }
  }

  /**
   * Fetch sleep data for a date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<object>} Sleep data with duration
   */
  async getSleep(startDate, endDate) {
    try {
      const opts = {
        startDate: startDate.getTime(),
        endDate: endDate.getTime(),
      };

      const result = await GoogleFit.getSleepSamples(opts);
      
      if (!result || result.length === 0) {
        return { duration: 0, samples: [] };
      }

      // Calculate total sleep duration in minutes
      let totalDuration = 0;
      result.forEach((sleep) => {
        const duration = (sleep.endDate - sleep.startDate) / (1000 * 60); // Convert to minutes
        totalDuration += duration;
      });

      console.log('[GoogleFit] Sleep fetched:', totalDuration, 'minutes');
      return { duration: Math.round(totalDuration / 60), samples: result }; // Convert to hours
    } catch (error) {
      console.error('[GoogleFit] getSleep error:', error);
      return { duration: 0, samples: [] };
    }
  }

  /**
   * Fetch calories burned for a date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<number>} Total calories burned
   */
  async getCalories(startDate, endDate) {
    try {
      const opts = {
        startDate: startDate.getTime(),
        endDate: endDate.getTime(),
        bucketUnit: 'DAY',
        bucketInterval: 1,
      };

      const result = await GoogleFit.getDailyCalorieBurnedSamples(opts);
      
      // Sum up all calories from the result
      const totalCalories = result.reduce((sum, day) => {
        return sum + (day.value || 0);
      }, 0);

      console.log('[GoogleFit] Calories fetched:', totalCalories);
      return totalCalories;
    } catch (error) {
      console.error('[GoogleFit] getCalories error:', error);
      return 0;
    }
  }

  /**
   * Fetch heart rate data for a date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<object>} Heart rate data
   */
  async getHeartRate(startDate, endDate) {
    try {
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
   * @returns {Promise<object>} All synced data
   */
  async syncAll() {
    try {
      // Get yesterday's data to sync
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

