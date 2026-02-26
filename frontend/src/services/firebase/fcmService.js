import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { notificationAPI } from '../api/notificationAPI';

export const registerForPushNotifications = async () => {
  if (!Device.isDevice) return null;
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return null;
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  await notificationAPI.registerDevice(token);
  return token;
};

export const setupNotificationListeners = (onNotification) => {
  Notifications.addNotificationReceivedListener(onNotification);
  Notifications.addNotificationResponseReceivedListener((response) => {
    onNotification(response.notification);
  });
};
