import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';

const PREF_ITEMS = [
  {
    key: 'medication',
    label: 'Medication Reminders',
    description: 'Alerts for doses and refill schedules',
    icon: 'medkit-outline',
    iconColor: '#14B8A6',
    iconBg: '#14B8A618',
  },
  {
    key: 'appointment',
    label: 'Appointment Alerts',
    description: 'Reminders before upcoming appointments',
    icon: 'calendar-outline',
    iconColor: '#6366F1',
    iconBg: '#6366F118',
  },
  {
    key: 'fitness',
    label: 'Fitness Updates',
    description: 'Daily goals, streaks and activity nudges',
    icon: 'barbell-outline',
    iconColor: '#F59E0B',
    iconBg: '#F59E0B18',
  },
  {
    key: 'general',
    label: 'General Notifications',
    description: 'Reports, AI insights & app updates',
    icon: 'notifications-outline',
    iconColor: '#EC4899',
    iconBg: '#EC489918',
  },
];

const NotificationSettings = ({ preferences, onToggle, loading }) => {
  const { colors } = useAppTheme();

  if (loading) {
    return (
      <View style={s.loadingWrap}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[s.loadingText, { color: colors.textTertiary }]}>Loading preferences…</Text>
      </View>
    );
  }

  const enabledCount = PREF_ITEMS.filter((i) => preferences?.[i.key]).length;

  return (
    <View>
      {/* Summary chip */}
      <View style={[s.summaryRow, { backgroundColor: colors.primary + '12', borderColor: colors.primary + '30' }]}>
        <Ionicons name="notifications" size={16} color={colors.primary} />
        <Text style={[s.summaryText, { color: colors.textSecondary }]}>
          <Text style={{ color: colors.primary, fontWeight: '700' }}>{enabledCount}</Text>
          {' '}of {PREF_ITEMS.length} notification types enabled
        </Text>
      </View>

      {/* Toggle rows */}
      <View style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {PREF_ITEMS.map((item, i) => {
          const on = !!preferences?.[item.key];
          return (
            <View
              key={item.key}
              style={[
                s.row,
                i < PREF_ITEMS.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
              ]}
            >
              <View style={[s.iconBox, { backgroundColor: on ? item.iconBg : colors.border + '40' }]}>
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={on ? item.iconColor : colors.textTertiary}
                />
              </View>
              <View style={s.textWrap}>
                <Text style={[s.label, { color: on ? colors.text : colors.textTertiary }]}>{item.label}</Text>
                <Text style={[s.desc, { color: colors.textTertiary }]}>{item.description}</Text>
              </View>
              <Switch
                value={on}
                onValueChange={() => onToggle(item.key)}
                trackColor={{ false: colors.border, true: item.iconColor + '88' }}
                thumbColor={on ? item.iconColor : colors.textTertiary}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  loadingWrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 12 },
  loadingText: { fontSize: 14 },

  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
  },
  summaryText: { fontSize: 13, flex: 1 },

  card: { borderRadius: 18, borderWidth: 1, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
  },
  iconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  textWrap: { flex: 1 },
  label: { fontSize: 15, fontWeight: '600' },
  desc: { fontSize: 12, marginTop: 2, lineHeight: 17 },
});

export default NotificationSettings;
