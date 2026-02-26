import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import NotificationSettings from '../../components/notifications/NotificationSettings';

const NotificationSettingsScreen = () => (
  <ScrollView style={s.c}><NotificationSettings settings={null} onUpdate={() => {}} /></ScrollView>
);
const s = StyleSheet.create({ c: { flex: 1, backgroundColor: '#F5F7FA', padding: 16 } });
export default NotificationSettingsScreen;
