import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const scheduleLocalNotification = async (title, body, trigger) => {
  return await Notifications.scheduleNotificationAsync({ content: { title, body, sound: true }, trigger });
};

export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};
