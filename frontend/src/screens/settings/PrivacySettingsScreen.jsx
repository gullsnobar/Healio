﻿import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { useAppTheme } from '../../styles/ThemeContext';
import PrivacySettings from '../../components/profile/PrivacySettings';
import { notificationAPI } from '../../services/api/notificationAPI';
import { locationService } from '../../services/location/locationService';

const PrivacySettingsScreen = () => {
  const { colors } = useAppTheme();
  const [settings, setSettings] = useState({ shareWithContacts: true, dataCollection: true, locationTracking: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await notificationAPI.getSettings();
        const data = res.data?.data;
        const priv = data?.privacySettings || {};
        setSettings((prev) => ({
          shareWithContacts: priv.shareWithContacts ?? prev.shareWithContacts,
          dataCollection: priv.dataCollection ?? prev.dataCollection,
          locationTracking: priv.locationTracking ?? prev.locationTracking,
        }));
      } catch {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleUpdate = useCallback(async (next) => {
    const prev = settings;
    setSettings(next);
    try {
      if (!prev.locationTracking && next.locationTracking) {
        const granted = await locationService.requestPermission();
        if (!granted) {
          const reverted = { ...next, locationTracking: false };
          setSettings(reverted);
          await notificationAPI.updatePrivacy(reverted);
          Alert.alert('Location Permission', 'Location access is required to enable tracking.');
          return;
        }
      }
      await notificationAPI.updatePrivacy(next);
    } catch {
      setSettings(prev);
      Alert.alert('Error', 'Failed to update privacy settings');
    }
  }, [settings]);
  return (
    <ScrollView style={[s.c, { backgroundColor: colors.background }]}>
      <PrivacySettings settings={settings} onUpdate={handleUpdate} disabled={loading} />
    </ScrollView>
  );
};
const s = StyleSheet.create({ c: { flex: 1, padding: 16 } });
export default PrivacySettingsScreen;
