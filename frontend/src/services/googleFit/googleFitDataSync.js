import { fitnessAPI } from '../api/fitnessAPI';

/**
 * Complete Google Fit data sync workflow
 * 1. Fetch data from Google Fit
 * 2. Send to backend for storage
 * 3. Return synced data
 */
export const syncGoogleFitData = async () => {
  try {
    const response = await fitnessAPI.syncGoogleFit();
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      const msg = response?.data?.message || 'Google Fit data synced';
      console.log('[GoogleFitSync] ' + msg);
    }
    return response;
  } catch (error) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.error('[GoogleFitSync] Sync failed:', error?.message);
    }
    throw new Error(`Google Fit sync failed: ${error.message}`);
  }
};

/**
 * Connect Google Fit account (must be called before syncing)
 */
export const connectGoogleFit = async () => {
  try {
    const response = await fitnessAPI.syncGoogleFit();
    return response;
  } catch (error) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.error('[GoogleFitSync] Connection failed:', error?.message);
    }
    throw new Error(`Google Fit connection failed: ${error.message}`);
  }
};
