import googleFitService from './googleFitService';
import { fitnessAPI } from '../api/fitnessAPI';

/**
 * Complete Google Fit data sync workflow
 * 1. Fetch data from Google Fit
 * 2. Send to backend for storage
 * 3. Return synced data
 */
export const syncGoogleFitData = async () => {
  try {
    console.log('[GoogleFitSync] Starting sync...');

    // Ensure Google Fit is initialized
    const isInitialized = await googleFitService.isInitialized;
    if (!isInitialized) {
      await googleFitService.initialize();
    }

    // Fetch all available data from Google Fit
    const data = await googleFitService.syncAll();

    if (!data) {
      throw new Error('Failed to fetch Google Fit data');
    }

    // Send synced data to backend for storage
    const response = await fitnessAPI.syncGoogleFit(data);

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
    console.log('[GoogleFitSync] Connecting Google Fit...');

    // Initialize and request permissions
    const authorized = await googleFitService.initialize();

    if (!authorized) {
      throw new Error('Google Fit authorization failed');
    }

    console.log('[GoogleFitSync] Connected successfully');
    return { connected: true };
  } catch (error) {
    console.error('[GoogleFitSync] Connection failed:', error.message);
    throw new Error(`Google Fit connection failed: ${error.message}`);
  }
};

