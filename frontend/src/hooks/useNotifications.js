import { useEffect } from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNotifications, markAsRead, markAllRead } from '../redux/slices/notificationSlice';
import { registerForPushNotifications, setupNotificationListeners } from '../services/firebase/fcmService';

export const useNotifications = () => {
  const dispatch = useDispatch();
  const state = useSelector((s) => s.notification);
  const { isAuthenticated, isAuthLoading } = useSelector((s) => s.auth);

  useEffect(() => {
    if (isAuthLoading || !isAuthenticated) {
      return undefined;
    }

    const isExpoGo = Constants.appOwnership === 'expo' || Constants.executionEnvironment === 'storeClient';
    const isAndroidExpoGo = isExpoGo && Platform.OS === 'android';
    if (!isExpoGo && Platform.OS !== 'web') {
      registerForPushNotifications();
    }

    dispatch(fetchNotifications());

    const cleanup = isAndroidExpoGo
      ? null
      : setupNotificationListeners(() => {
        dispatch(fetchNotifications());
      });

    const interval = setInterval(() => {
      dispatch(fetchNotifications());
    }, 60000);

    return () => {
      clearInterval(interval);
      cleanup?.();
    };
  }, [dispatch, isAuthenticated, isAuthLoading]);

  return {
    ...state,
    markRead: (id) => dispatch(markAsRead(id)),
    markAllRead: () => dispatch(markAllRead()),
    refresh: () => dispatch(fetchNotifications()),
  };
};
