import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNotifications, markAsRead } from '../redux/slices/notificationSlice';
import { registerForPushNotifications, setupNotificationListeners } from '../services/firebase/fcmService';

export const useNotifications = () => {
  const dispatch = useDispatch();
  const state = useSelector((s) => s.notification);
  useEffect(() => { registerForPushNotifications(); dispatch(fetchNotifications()); setupNotificationListeners(() => dispatch(fetchNotifications())); }, []);
  return { ...state, markRead: (id) => dispatch(markAsRead(id)), refresh: () => dispatch(fetchNotifications()) };
};
