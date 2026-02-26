import React from 'react';
import { FlatList, Text, StyleSheet } from 'react-native';
import NotificationItem from './NotificationItem';
const NotificationList = ({ notifications = [], onItemPress, onDismiss }) => (
  <FlatList data={notifications} keyExtractor={(i) => i._id} renderItem={({ item }) => <NotificationItem notification={item} onPress={onItemPress} onDismiss={onDismiss} />}
    ListEmptyComponent={<Text style={s.e}>No notifications</Text>} contentContainerStyle={s.c} />
);
const s = StyleSheet.create({c:{padding:16},e:{textAlign:'center',color:'#888',padding:40}});
export default NotificationList;
