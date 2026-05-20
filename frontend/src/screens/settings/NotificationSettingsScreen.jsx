import React, { useEffect, useState, useCallback } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';
import NotificationSettings from '../../components/notifications/NotificationSettings';
import { notificationAPI } from '../../services/api/notificationAPI';

const NotificationSettingsScreen = () => {
  const { colors } = useAppTheme();
  const [preferences, setPreferences] = useState({
    medication: true,
    appointment: true,
    fitness: true,
    general: true,
  });
  const [loading, setLoading] = useState(true);

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

  const handleToggle = useCallback(async (key) => {
    const updated = { ...preferences, [key]: !preferences[key] };
    setPreferences(updated);
    try {
      await notificationAPI.updateSettings(updated);
    } catch {
      setPreferences(preferences);
      Alert.alert('Error', 'Failed to update notification preferences.');
    }
  }, [preferences]);

  return (
    <ScrollView
      style={[s.c, { backgroundColor: colors.background }]}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Info banner */}
      <View style={[s.banner, { backgroundColor: colors.primary + '12', borderColor: colors.primary + '30' }]}>
        <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
        <Text style={[s.bannerText, { color: colors.textSecondary }]}>
          Control which notifications MR & FT sends you. Changes take effect immediately.
        </Text>
      </View>

      <NotificationSettings
        preferences={preferences}
        onToggle={handleToggle}
        loading={loading}
      />
    </ScrollView>
  );
};

const s = StyleSheet.create({
  c: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
  },
  bannerText: { flex: 1, fontSize: 13, lineHeight: 19 },
});

export default NotificationSettingsScreen;
