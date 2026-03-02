import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const METRICS = [
  { key: 'steps', icon: 'footsteps-outline', label: 'Steps',    color: '#3B82F6', bg: '#DBEAFE', goal: 10000, fmt: (v) => (v || 0).toLocaleString() },
  { key: 'sleep', icon: 'moon-outline',       label: 'Sleep',    color: '#7C3AED', bg: '#EDE9FE', goal: 8,     fmt: (v) => `${(v || 0).toFixed(1)}h` },
  { key: 'water', icon: 'water-outline',      label: 'Water',    color: '#06B6D4', bg: '#CFFAFE', goal: 2500,  fmt: (v) => `${v || 0}ml` },
];

const FitnessProgressWidget = ({ data = {}, onPress }) => (
  <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.85}>
    <View style={styles.headerRow}>
      <View style={styles.iconBadge}>
        <Ionicons name='fitness' size={18} color='#10B981' />
      </View>
      <Text style={styles.title}>Fitness Today</Text>
      <Ionicons name='chevron-forward' size={18} color='#94A3B8' />
    </View>
    <View style={styles.row}>
      {METRICS.map(({ key, icon, label, color, bg, goal, fmt }) => {
        const val = data?.[key] ?? 0;
        const pct = Math.min(val / goal, 1);
        return (
          <View key={key} style={[styles.stat, { backgroundColor: bg }]}>
            <Ionicons name={icon} size={22} color={color} />
            <Text style={[styles.num, { color }]}>{fmt(val)}</Text>
            <Text style={styles.statLabel}>{label}</Text>
            <View style={styles.miniTrack}>
              <View style={[styles.miniFill, { width: `${pct * 100}%`, backgroundColor: color }]} />
            </View>
          </View>
        );
      })}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 4 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  iconBadge: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#D1FAE5', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  title: { flex: 1, fontSize: 15, fontWeight: '700', color: '#1E293B' },
  row: { flexDirection: 'row', gap: 10 },
  stat: { flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: 14, paddingHorizontal: 4 },
  num: { fontSize: 16, fontWeight: '800', marginTop: 6 },
  statLabel: { fontSize: 11, color: '#64748B', marginTop: 3, fontWeight: '500' },
  miniTrack: { width: '80%', height: 4, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 2, marginTop: 8, overflow: 'hidden' },
  miniFill: { height: 4, borderRadius: 2 },
});
export default FitnessProgressWidget;
