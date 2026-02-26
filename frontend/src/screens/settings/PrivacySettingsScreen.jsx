import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import PrivacySettings from '../../components/profile/PrivacySettings';

const PrivacySettingsScreen = () => (
  <ScrollView style={s.c}><PrivacySettings settings={null} onUpdate={() => {}} /></ScrollView>
);
const s = StyleSheet.create({ c: { flex: 1, backgroundColor: '#F5F7FA', padding: 16 } });
export default PrivacySettingsScreen;
