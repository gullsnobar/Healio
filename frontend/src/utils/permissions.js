import * as Location from 'expo-location';
import Constants from 'expo-constants';

// Load notifications at runtime only when not running in Expo Go (SDK 53+)
let Notifications = null;
try {
  if (Constants.appOwnership !== 'expo') Notifications = require('expo-notifications');
} catch (e) {
  Notifications = null;
}

export const requestNotificationPermission = async () => {
  // Skip notification setup in Expo Go (SDK 53+ removed support)
  if (Constants.appOwnership === 'expo' || !Notifications) {
    console.warn('Push notifications are not supported in Expo Go. Use a development build instead.');
    return false;
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

export const requestLocationPermission = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
};
