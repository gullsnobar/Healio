import React from 'react';
import { FlatList, Text, StyleSheet } from 'react-native';
import NotificationItem from './NotificationItem';
import { useAppTheme } from '../../styles/ThemeContext';
const NotificationList = ({ notifications = [], onItemPress, onDismiss }) => {
  const { colors } = useAppTheme();
  return (
  <FlatList data={notifications} keyExtractor={(i) => i._id} renderItem={({ item }) => <NotificationItem notification={item} onPress={onItemPress} onDismiss={onDismiss} />}
    ListEmptyComponent={<Text style={[s.e, { color: colors.textSecondary }]}>No notifications</Text>} contentContainerStyle={s.c} />
  );
};
const s = StyleSheet.create({c:{padding:16},e:{textAlign:'center',padding:40}});
export default NotificationList;
