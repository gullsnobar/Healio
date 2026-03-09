import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNotifications, markAsRead, markAllRead } from '../redux/slices/notificationSlice';
import { registerForPushNotifications, setupNotificationListeners } from '../services/firebase/fcmService';

export const useNotifications = () => {
  const dispatch = useDispatch();
  const state = useSelector((s) => s.notification);

  useEffect(() => {
    registerForPushNotifications();
    dispatch(fetchNotifications());
    const cleanup = setupNotificationListeners(() => dispatch(fetchNotifications()));
    return cleanup;
  }, [dispatch]);

  return {
    ...state,
    markRead: (id) => dispatch(markAsRead(id)),
    markAllRead: () => dispatch(markAllRead()),
    refresh: () => dispatch(fetchNotifications()),
  };
};
