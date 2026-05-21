import { Platform } from 'react-native';

// react-native-google-fit is a native module — only available on Android/iOS
let GoogleFit = null;
if (Platform.OS === 'android' || Platform.OS === 'ios') {
  try { GoogleFit = require('react-native-google-fit').default; } catch (_) {}
}

const IS_NATIVE = Platform.OS === 'android' || Platform.OS === 'ios';

// Define required scopes for Google Fit
const GOOGLE_FIT_SCOPES = [
  'https://www.googleapis.com/auth/fitness.activity.read',
  'https://www.googleapis.com/auth/fitness.body.read',
  'https://www.googleapis.com/auth/fitness.sleep.read',
  'https://www.googleapis.com/auth/fitness.heart_rate.read',
];

export const googleFitAuth = {
  /**
   * Initialize Google Fit auth and request permissions
   */
  initialize: async () => {
    try {
      if (!IS_NATIVE || !GoogleFit) {
        console.warn('[GoogleFit] Not available on this platform');
        return false;
      }

      // Request permissions from the device
      const authorized = await GoogleFit.authorize({
        scopes: GOOGLE_FIT_SCOPES,
      });

      return authorized;
    } catch (error) {
      console.error('[GoogleFit] Auth initialization failed:', error);
      throw error;
    }
  },

  /**
   * Check if user is signed in to Google Fit
   */
  isSignedIn: async () => {
    try {
      if (!IS_NATIVE || !GoogleFit) return false;
      const result = await GoogleFit.isAuthorized();
      return result;
    } catch (error) {
      console.error('[GoogleFit] isSignedIn check failed:', error);
      return false;
    }
  },

  /**
   * Sign out from Google Fit
   */
  signOut: async () => {
    try {
      if (!IS_NATIVE || !GoogleFit) return true;
      await GoogleFit.removeAllListeners();
      return true;
    } catch (error) {
      console.error('[GoogleFit] Sign out failed:', error);
      throw error;
    }
  },

  /**
   * Get access token for Google Fit (note: react-native-google-fit manages tokens internally)
   */
  getAccessToken: async () => {
    return null;
  },
};

