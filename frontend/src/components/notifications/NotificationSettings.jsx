import React from 'react';
import { View, Text, StyleSheet, Switch, ActivityIndicator } from 'react-native';
import { useAppTheme } from '../../styles/ThemeContext';

const PREF_ITEMS = [
  { key: 'medication', label: 'Medication Reminders', description: 'Get notified about medication doses' },
  { key: 'appointment', label: 'Appointment Reminders', description: 'Reminders for upcoming appointments' },
  { key: 'fitness', label: 'Fitness Reminders', description: 'Stay on track with fitness goals' },
  { key: 'general', label: 'General Notifications', description: 'Reports, recommendations & updates' },
];

const NotificationSettings = ({ preferences, onToggle, loading }) => {
  const { colors, isDark } = useAppTheme();
  const bg = isDark ? '#1E293B' : '#FFF';

  if (loading) {
    return (
      <View style={[s.c, { backgroundColor: bg }, s.loadingWrap]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[s.c, { backgroundColor: bg }]}>
      <Text style={[s.t, { color: colors.text }]}>Notification Preferences</Text>
      {PREF_ITEMS.map(({ key, label, description }) => (
        <View key={key} style={[s.r, { borderBottomColor: isDark ? '#334155' : '#F0F0F0' }]}>
          <View style={s.labelWrap}>
            <Text style={[s.l, { color: colors.text }]}>{label}</Text>
            <Text style={[s.desc, { color: colors.textSecondary }]}>{description}</Text>
          </View>
          <Switch
            value={!!preferences?.[key]}
            onValueChange={() => onToggle(key)}
            trackColor={{ false: isDark ? '#475569' : '#D1D5DB', true: colors.primary + '80' }}
            thumbColor={preferences?.[key] ? colors.primary : isDark ? '#94A3B8' : '#F3F4F6'}
          />
        </View>
      ))}
    </View>
  );
};

const s = StyleSheet.create({
  c: { borderRadius: 12, padding: 16 },
  loadingWrap: { alignItems: 'center', justifyContent: 'center', minHeight: 200 },
  t: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  r: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1 },
  labelWrap: { flex: 1, marginRight: 12 },
  l: { fontSize: 15, fontWeight: '500' },
  desc: { fontSize: 12, marginTop: 2 },
});

export default NotificationSettings;
