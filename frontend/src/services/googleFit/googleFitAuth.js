import GoogleFit from 'react-native-google-fit';
import { Platform } from 'react-native';

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
      if (Platform.OS !== 'android' && Platform.OS !== 'ios') {
        throw new Error('Google Fit is only available on Android and iOS');
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
      await GoogleFit.removeAllListeners();
      // Note: react-native-google-fit doesn't have explicit signOut
      // User must revoke access in Google Account settings
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
    // react-native-google-fit handles tokens internally
    // Token is not directly exposed, always returns null
    return null;
  },
};

