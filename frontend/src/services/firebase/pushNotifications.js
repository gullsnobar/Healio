import Constants from 'expo-constants';

// Load notifications at runtime only when not running in Expo Go (SDK 53+)
let Notifications = null;
try {
  if (Constants.appOwnership !== 'expo') Notifications = require('expo-notifications');
} catch (e) {
  Notifications = null;
}

// Only set notification handler if not in Expo Go
if (Constants.appOwnership !== 'expo' && Notifications) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

export const scheduleLocalNotification = async (title, body, trigger) => {
  if (Constants.appOwnership === 'expo' || !Notifications) {
    console.warn('Local notifications are not supported in Expo Go. Use a development build instead.');
    return null;
  }
  return await Notifications.scheduleNotificationAsync({ content: { title, body, sound: true }, trigger });
};

export const cancelAllNotifications = async () => {
  if (Constants.appOwnership === 'expo') {
    return;
  }
  await Notifications.cancelAllScheduledNotificationsAsync();
};
