import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';

const QUALITY = (h) => h >= 7 ? 'Great sleep!' : h >= 5 ? 'Fair sleep' : 'Needs improvement';

const SleepTracker = ({ hours = 0, goal = 8, dark }) => {
  const { colors, isDark } = useAppTheme();
  const pct = Math.min(hours / goal, 1);
  const onGrad = dark;
  const mainColor = onGrad ? '#FFFFFF' : colors.text;
  const subColor = onGrad ? 'rgba(255,255,255,0.75)' : colors.textSecondary;
  const fillColor = onGrad ? '#C7D2FE' : '#6366F1';
  const trackColor = onGrad ? 'rgba(255,255,255,0.25)' : colors.border;

  return (
    <View style={sl.container}>
      <View style={sl.row}>
        <Ionicons name="moon" size={40} color={onGrad ? '#E0E7FF' : (isDark ? '#A5B4FC' : '#6366F1')} />
        <View style={sl.textWrap}>
          <Text style={[sl.count, { color: mainColor }]}>{Number(hours).toFixed(1)}h</Text>
          <Text style={[sl.label, { color: subColor }]}>{QUALITY(hours)}</Text>
        </View>
        <Text style={[sl.goal, { color: subColor }]}>Goal: {goal}h</Text>
      </View>
      <View style={[sl.track, { backgroundColor: trackColor }]}>
        <View style={[sl.fill, { width: `${pct * 100}%`, backgroundColor: fillColor }]} />
      </View>
    </View>
  );
};

const sl = StyleSheet.create({
  container: { paddingVertical: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  textWrap: { flex: 1 },
  count: { fontSize: 30, fontWeight: '800', letterSpacing: -0.5 },
  label: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  goal: { fontSize: 12, fontWeight: '600' },
  track: { height: 6, borderRadius: 3, marginTop: 14, overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3 },
});
export default SleepTracker;
