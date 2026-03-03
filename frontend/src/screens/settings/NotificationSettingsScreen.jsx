import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import NotificationSettings from '../../components/notifications/NotificationSettings';
import { notificationAPI } from '../../services/api/notificationAPI';
import { useAppTheme } from '../../styles/ThemeContext';

const NotificationSettingsScreen = () => {
  const { isDark } = useAppTheme();
  const [preferences, setPreferences] = useState({ medication: true, appointment: true, fitness: true, general: true });
  const [loading, setLoading] = useState(true);

  // Load saved preferences from user profile
  useEffect(() => {
    (async () => {
      try {
        const res = await notificationAPI.getSettings();
        const prefs = res.data?.data?.notificationPreferences;
        if (prefs) setPreferences(prefs);
      } catch { /* use defaults */ }
      finally { setLoading(false); }
    })();
  }, []);

  // Toggle and persist
  const handleToggle = useCallback(async (key) => {
    const updated = { ...preferences, [key]: !preferences[key] };
    setPreferences(updated); // optimistic update
    try {
      await notificationAPI.updateSettings(updated);
    } catch {
      // revert on failure
      setPreferences(preferences);
      Alert.alert('Error', 'Failed to update notification preferences');
    }
  }, [preferences]);

  return (
    <ScrollView style={[s.c, { backgroundColor: isDark ? '#0F172A' : '#F5F7FA' }]}>
      <NotificationSettings preferences={preferences} onToggle={handleToggle} loading={loading} />
    </ScrollView>
  );
};

const s = StyleSheet.create({ c: { flex: 1, padding: 16 } });
export default NotificationSettingsScreen;
