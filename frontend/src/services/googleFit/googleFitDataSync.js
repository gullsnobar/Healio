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
    const errorMessage = error?.message || 'Unknown error';
    
    // Handle session expired / no refresh token case
    if (error?.code === 'NO_REFRESH_TOKEN' || errorMessage.includes('Session expired') || errorMessage.includes('No refresh token')) {
      if (typeof __DEV__ !== 'undefined' && __DEV__) {
        console.error('[GoogleFitSync] Session expired:', errorMessage);
      }
      throw new Error('Session expired. Please log in again to continue syncing with Google Fit.');
    }
    
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.error('[GoogleFitSync] Sync failed:', errorMessage);
    }
    throw new Error(`Google Fit sync failed: ${errorMessage}`);
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
    const errorMessage = error?.message || 'Unknown error';
    
    // Handle session expired / no refresh token case
    if (error?.code === 'NO_REFRESH_TOKEN' || errorMessage.includes('Session expired') || errorMessage.includes('No refresh token')) {
      if (typeof __DEV__ !== 'undefined' && __DEV__) {
        console.error('[GoogleFitSync] Session expired during connection:', errorMessage);
      }
      throw new Error('Session expired. Please log in again to connect Google Fit.');
    }
    
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.error('[GoogleFitSync] Connection failed:', errorMessage);
    }
    throw new Error(`Google Fit connection failed: ${errorMessage}`);
  }
};
