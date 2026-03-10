import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';

const StepCounter = ({ steps = 0, goal = 10000, dark }) => {
  const { colors, isDark } = useAppTheme();
  const pct = Math.min(steps / goal, 1);
  const onGrad = dark;
  const mainColor = onGrad ? '#FFFFFF' : colors.text;
  const subColor = onGrad ? 'rgba(255,255,255,0.75)' : colors.textSecondary;
  const fillColor = onGrad ? '#FFFFFF' : '#38BDF8';
  const trackColor = onGrad ? 'rgba(255,255,255,0.25)' : colors.border;

  return (
    <View style={sc.container}>
      <View style={sc.row}>
        <Ionicons name="footsteps" size={40} color={onGrad ? '#FFFFFF' : (isDark ? '#fff' : '#38BDF8')} />
        <View style={sc.textWrap}>
          <Text style={[sc.count, { color: mainColor }]}>{steps.toLocaleString()}</Text>
          <Text style={[sc.label, { color: subColor }]}>of {goal.toLocaleString()} steps</Text>
        </View>
        <Text style={[sc.pct, { color: mainColor }]}>{Math.round(pct * 100)}%</Text>
      </View>
      <View style={[sc.track, { backgroundColor: trackColor }]}>
        <View style={[sc.fill, { width: `${pct * 100}%`, backgroundColor: fillColor }]} />
      </View>
    </View>
  );
};

const sc = StyleSheet.create({
  container: { paddingVertical: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  textWrap: { flex: 1 },
  count: { fontSize: 30, fontWeight: '800', letterSpacing: -0.5 },
  label: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  pct: { fontSize: 18, fontWeight: '700' },
  track: { height: 6, borderRadius: 3, marginTop: 14, overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3 },
});
export default StepCounter;
