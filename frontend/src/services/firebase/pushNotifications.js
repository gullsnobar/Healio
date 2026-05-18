import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

// Only set notification handler if not in Expo Go
if (Constants.appOwnership !== 'expo') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

export const scheduleLocalNotification = async (title, body, trigger) => {
  if (Constants.appOwnership === 'expo') {
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
