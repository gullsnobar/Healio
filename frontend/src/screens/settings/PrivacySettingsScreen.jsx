import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useAppTheme } from '../../styles/ThemeContext';
import PrivacySettings from '../../components/profile/PrivacySettings';

const PrivacySettingsScreen = () => {
  const { colors } = useAppTheme();
  return (
    <ScrollView style={[s.c, { backgroundColor: colors.background }]}><PrivacySettings settings={null} onUpdate={() => {}} /></ScrollView>
  );
};
const s = StyleSheet.create({ c: { flex: 1, padding: 16 } });
export default PrivacySettingsScreen;
