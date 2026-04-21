import { fitnessAPI } from '../api/fitnessAPI';

/**
 * Complete Google Fit data sync workflow
 * 1. Fetch data from Google Fit
 * 2. Send to backend for storage
 * 3. Return synced data
 */
export const syncGoogleFitData = async () => {
  try {
    console.log('[GoogleFitSync] Starting backend sync...');
    const response = await fitnessAPI.syncGoogleFit();
    console.log('[GoogleFitSync] Sync successful:', response);
    return response;
  } catch (error) {
    console.error('[GoogleFitSync] Sync failed:', error.message);
    throw new Error(`Google Fit sync failed: ${error.message}`);
  }
};

/**
 * Connect Google Fit account (must be called before syncing)
 */
export const connectGoogleFit = async () => {
  try {
    console.log('[GoogleFitSync] Connecting Google Fit via backend...');
    const response = await fitnessAPI.syncGoogleFit();
    return response;
  } catch (error) {
    console.error('[GoogleFitSync] Connection failed:', error.message);
    throw new Error(`Google Fit connection failed: ${error.message}`);
  }
};
