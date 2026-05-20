import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';

const PRIVACY_ITEMS = [
  {
    key: 'shareWithContacts',
    icon: 'people-outline',
    label: 'Share Data with Contacts',
    desc: 'Allow trusted contacts to view your health summary',
    iconBg: '#14B8A618',
    iconColor: '#14B8A6',
  },
  {
    key: 'dataCollection',
    icon: 'analytics-outline',
    label: 'Allow Data Collection',
    desc: 'Help improve the app with anonymous usage data',
    iconBg: '#6366F118',
    iconColor: '#6366F1',
  },
  {
    key: 'locationTracking',
    icon: 'location-outline',
    label: 'Location Tracking',
    desc: 'Enable location-based features and nearby services',
    iconBg: '#F59E0B18',
    iconColor: '#F59E0B',
  },
];

const PrivacySettings = ({ settings, onUpdate, disabled = false }) => {
  const { colors } = useAppTheme();
  const [state, setState] = useState(
    settings || { shareWithContacts: true, dataCollection: true, locationTracking: false },
  );

  useEffect(() => {
    if (settings) setState((prev) => ({ ...prev, ...settings }));
  }, [settings]);

  const toggle = (key) => {
    const next = { ...state, [key]: !state[key] };
    setState(next);
    onUpdate?.(next);
  };

  return (
    <View style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {PRIVACY_ITEMS.map((item, i) => (
        <View
          key={item.key}
          style={[
            s.row,
            i < PRIVACY_ITEMS.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
          ]}
        >
          {/* Icon */}
          <View style={[s.iconBox, { backgroundColor: item.iconBg }]}>
            <Ionicons name={item.icon} size={18} color={item.iconColor} />
          </View>

          {/* Label + desc */}
          <View style={s.mid}>
            <Text style={[s.label, { color: colors.text }]}>{item.label}</Text>
            <Text style={[s.desc, { color: colors.textTertiary }]}>{item.desc}</Text>
          </View>

          {/* Toggle */}
          <Switch
            value={!!state[item.key]}
            onValueChange={() => !disabled && toggle(item.key)}
            disabled={disabled}
            trackColor={{ false: colors.border, true: item.iconColor + '88' }}
            thumbColor={state[item.key] ? item.iconColor : colors.textTertiary}
          />
        </View>
      ))}
    </View>
  );
};

const s = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mid: { flex: 1 },
  label: { fontSize: 15, fontWeight: '600' },
  desc: { fontSize: 12, marginTop: 2, lineHeight: 17 },
});

export default PrivacySettings;
