import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';

const SEGMENTS = 8;

const WaterIntakeLogger = ({ intake = 0, goal = 2500, onAdd }) => {
  const { colors } = useAppTheme();
  const pct = Math.min(intake / goal, 1);
  const glasses = Math.floor(intake / 250);
  const filled = Math.round(pct * SEGMENTS);

  return (
    <View>
      <View style={wl.row}>
        <Ionicons name="water" size={40} color={colors.fitnessWater} />
        <View style={wl.textWrap}>
          <Text style={[wl.count, { color: colors.text }]}>{intake} <Text style={[wl.unit, { color: colors.textSecondary }]}>ml</Text></Text>
          <Text style={[wl.label, { color: colors.textSecondary }]}>{glasses} glasses · Goal {goal} ml</Text>
        </View>
        <Text style={[wl.pct, { color: colors.fitnessWater }]}>{Math.round(pct * 100)}%</Text>
      </View>

      {/* Segmented progress */}
      <View style={wl.segments}>
        {Array.from({ length: SEGMENTS }).map((_, i) => (
          <View key={i} style={[wl.seg, { backgroundColor: colors.fitnessWaterBg }, i < filled && { backgroundColor: colors.fitnessWater }]} />
        ))}
      </View>

      {/* Add buttons */}
      <View style={wl.buttons}>
        {[150, 250, 500].map((ml) => (
          <TouchableOpacity key={ml} style={[wl.addBtn, { borderColor: colors.fitnessWater, backgroundColor: colors.fitnessWaterBg }]} onPress={() => onAdd?.(ml)} activeOpacity={0.8}>
            <Ionicons name="add" size={14} color={colors.fitnessWater} />
            <Text style={[wl.addText, { color: colors.fitnessWater }]}>{ml}ml</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const wl = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  textWrap: { flex: 1 },
  count: { fontSize: 28, fontWeight: '800' },
  unit: { fontSize: 16, fontWeight: '500' },
  label: { fontSize: 12, marginTop: 2 },
  pct: { fontSize: 18, fontWeight: '700' },
  segments: { flexDirection: 'row', gap: 4, marginBottom: 16 },
  seg: { flex: 1, height: 8, borderRadius: 4 },
  buttons: { flexDirection: 'row', gap: 10 },
  addBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 10, borderRadius: 12, borderWidth: 1.5 },
  addText: { fontWeight: '700', fontSize: 13 },
});
export default WaterIntakeLogger;
