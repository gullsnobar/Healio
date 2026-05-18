import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { notificationAPI } from '../api/notificationAPI';

// Configure how foreground notifications are displayed (only if not in Expo Go)
if (Constants.appOwnership !== 'expo') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

export const registerForPushNotifications = async () => {
  // Skip notification setup in Expo Go (SDK 53+ removed support)
  if (Constants.appOwnership === 'expo') {
    console.warn('Push notifications are not supported in Expo Go. Use a development build instead.');
    return null;
  }

  if (!Device.isDevice) {
    console.log('Push notifications require a physical device');
    return null;
  }

  // Request permission
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    console.log('Push notification permission denied');
    return null;
  }

  // Get native device push token (FCM on Android, APNs on iOS)
  // This is what Firebase Admin SDK expects
  try {
    const tokenData = await Notifications.getDevicePushTokenAsync();
    const token = tokenData.data;
    await notificationAPI.registerDevice(token);

    // Set notification channel for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('medication', {
        name: 'Medication Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
        vibrationPattern: [0, 250, 250, 250],
      });
      await Notifications.setNotificationChannelAsync('default', {
        name: 'General Notifications',
        importance: Notifications.AndroidImportance.DEFAULT,
        sound: 'default',
      });
    }

    return token;
  } catch (err) {
    console.warn('Failed to get device push token:', err.message);
    return null;
  }
};

export const setupNotificationListeners = (onNotification) => {
  // Skip notification listeners in Expo Go
  if (Constants.appOwnership === 'expo') {
    return () => {};
  }

  const receivedSub = Notifications.addNotificationReceivedListener(() => {
    onNotification?.();
  });
  const responseSub = Notifications.addNotificationResponseReceivedListener(() => {
    onNotification?.();
  });

  // Return cleanup function
  return () => {
    receivedSub.remove();
    responseSub.remove();
  };
};

export const scheduleLocalNotification = async ({ title, body, data, triggerDate }) => {
  if (Constants.appOwnership === 'expo') {
    console.warn('Local notifications are not supported in Expo Go. Use a development build instead.');
    return null;
  }
  return Notifications.scheduleNotificationAsync({
    content: { title, body, data, sound: 'default' },
    trigger: triggerDate ? { date: triggerDate } : null,
  });
};

export const cancelAllScheduledNotifications = async () => {
  if (Constants.appOwnership === 'expo') {
    return;
  }
  await Notifications.cancelAllScheduledNotificationsAsync();
};
