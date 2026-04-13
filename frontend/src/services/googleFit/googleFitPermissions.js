import { Platform } from 'react-native';
import { googleFitAuth } from './googleFitAuth';

// Import PermissionsAndroid only on Android to satisfy linter
const PermissionsAndroid = Platform.OS === 'android' ? require('react-native').PermissionsAndroid : null;

/**
 * Request fitness-related permissions from the device
 * On Android, requests ACTIVITY_RECOGNITION permission
 * On iOS, requests HealthKit access (usually handled by react-native-google-fit)
 */
export const requestFitnessPermissions = async () => {
  try {
    if (Platform.OS === 'android') {
      // Request ACTIVITY_RECOGNITION permission on Android
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
        {
          title: 'Fitness Data Permission',
          message: 'Healio needs access to your activity data from Google Fit',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.warn('[Permissions] ACTIVITY_RECOGNITION permission denied');
        return false;
      }

      // Also initialize Google Fit with OAuth scopes
      const authorized = await googleFitAuth.initialize();
      return authorized;
    } else if (Platform.OS === 'ios') {
      // On iOS, initialize Google Fit which handles HealthKit permissions
      const authorized = await googleFitAuth.initialize();
      return authorized;
    }

    return true;
  } catch (error) {
    console.error('[Permissions] Request failed:', error);
    return false;
  }
};

/**
 * Check if fitness permissions are granted
 */
export const checkFitnessPermissions = async () => {
  try {
    if (Platform.OS === 'android') {
      const status = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
      );
      return status;
    } else if (Platform.OS === 'ios') {
      // On iOS, check if signed in to Google Fit
      return await googleFitAuth.isSignedIn();
    }
    return true;
  } catch (error) {
    console.error('[Permissions] Check failed:', error);
    return false;
  }
};

