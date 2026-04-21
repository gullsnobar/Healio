import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';

const { width: SCREEN_W } = Dimensions.get('window');
const isSmall = SCREEN_W < 400;

const STATS = [
  { key: 'taken',   label: 'Taken',   icon: 'checkmark-circle', color: '#10B981', bg: '#D1FAE5' },
  { key: 'missed',  label: 'Missed',  icon: 'close-circle',     color: '#EF4444', bg: '#FEE2E2' },
  { key: 'pending', label: 'Pending', icon: 'time',             color: '#F59E0B', bg: '#FEF3C7' },
];

const MedicationStatusWidget = ({ data = { taken: 0, missed: 0, pending: 0 }, onPress, onStatusPress }) => {
  const { colors } = useAppTheme();
  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: colors.card }]} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.headerRow}>
        <View style={[styles.iconBadge, { backgroundColor: colors.primaryLight }]}>
          <Ionicons name='medkit' size={18} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>Today's Medications</Text>
        <Ionicons name='chevron-forward' size={18} color={colors.textTertiary} />
      </View>
      <View style={styles.row}>
        {STATS.map(({ key, label, icon, color, bg }) => (
          <TouchableOpacity
            key={key}
            style={[styles.stat, { backgroundColor: bg }]}
            activeOpacity={0.85}
            onPress={() => {
              if (onStatusPress) onStatusPress(key);
              else if (onPress) onPress();
            }}
          >
            <Ionicons name={icon} size={isSmall ? 18 : 22} color={color} />
            <Text style={[styles.num, { color }]}>{data?.[key] ?? 0}</Text>
            <Text style={styles.statLabel}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { borderRadius: 20, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 4 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  iconBadge: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  title: { flex: 1, fontSize: 15, fontWeight: '700' },
  row: { flexDirection: 'row', gap: isSmall ? 6 : 10 },
  stat: { flex: 1, alignItems: 'center', paddingVertical: isSmall ? 10 : 14, borderRadius: 14 },
  num: { fontSize: isSmall ? 18 : 22, fontWeight: '800', marginTop: 4 },
  statLabel: { fontSize: isSmall ? 10 : 11, marginTop: 3, fontWeight: '500' },
});
export default MedicationStatusWidget;
