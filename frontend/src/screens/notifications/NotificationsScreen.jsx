import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useAppTheme } from '../../styles/ThemeContext';
import NotificationList from '../../components/notifications/NotificationList';
import { fetchNotifications, markAsRead, markAllRead } from '../../redux/slices/notificationSlice';

const NotificationsScreen = ({ navigation }) => {
  const { colors } = useAppTheme();
  const dispatch = useDispatch();
  const { notifications, unreadCount, loading } = useSelector((s) => s.notification);

  const load = useCallback(() => dispatch(fetchNotifications()), [dispatch]);
  useEffect(() => { load(); }, [load]);

  const handlePress = useCallback((item) => {
    if (!item.isRead) dispatch(markAsRead(item._id));
  }, [dispatch]);

  const handleDismiss = useCallback((id) => {
    dispatch(markAsRead(id));
  }, [dispatch]);

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      {unreadCount > 0 && (
        <TouchableOpacity style={[s.markAllBtn, { backgroundColor: colors.primaryLight }]} onPress={() => dispatch(markAllRead())} activeOpacity={0.7}>
          <Ionicons name="checkmark-done" size={16} color={colors.primary} />
          <Text style={[s.markAllText, { color: colors.primary }]}>Mark all as read</Text>
        </TouchableOpacity>
      )}
      <NotificationList
        notifications={notifications}
        onItemPress={handlePress}
        onDismiss={handleDismiss}
      />
    </View>
  );
};

const s = StyleSheet.create({
  container: { flex: 1 },
  markAllBtn: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, margin: 12, gap: 6 },
  markAllText: { fontSize: 13, fontWeight: '600' },
});
export default NotificationsScreen;
