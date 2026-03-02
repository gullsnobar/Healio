import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SEGMENTS = 8;

const WaterIntakeLogger = ({ intake = 0, goal = 2500, onAdd }) => {
  const pct = Math.min(intake / goal, 1);
  const glasses = Math.floor(intake / 250);
  const filled = Math.round(pct * SEGMENTS);

  return (
    <View>
      <View style={wl.row}>
        <Ionicons name="water" size={40} color="#06B6D4" />
        <View style={wl.textWrap}>
          <Text style={wl.count}>{intake} <Text style={wl.unit}>ml</Text></Text>
          <Text style={wl.label}>{glasses} glasses · Goal {goal} ml</Text>
        </View>
        <Text style={wl.pct}>{Math.round(pct * 100)}%</Text>
      </View>

      {/* Segmented progress */}
      <View style={wl.segments}>
        {Array.from({ length: SEGMENTS }).map((_, i) => (
          <View key={i} style={[wl.seg, i < filled && wl.segFilled]} />
        ))}
      </View>

      {/* Add buttons */}
      <View style={wl.buttons}>
        {[150, 250, 500].map((ml) => (
          <TouchableOpacity key={ml} style={wl.addBtn} onPress={() => onAdd?.(ml)} activeOpacity={0.8}>
            <Ionicons name="add" size={14} color="#06B6D4" />
            <Text style={wl.addText}>{ml}ml</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const wl = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  textWrap: { flex: 1 },
  count: { fontSize: 28, fontWeight: '800', color: '#1E293B' },
  unit: { fontSize: 16, fontWeight: '500', color: '#64748B' },
  label: { fontSize: 12, color: '#64748B', marginTop: 2 },
  pct: { fontSize: 18, fontWeight: '700', color: '#06B6D4' },
  segments: { flexDirection: 'row', gap: 4, marginBottom: 16 },
  seg: { flex: 1, height: 8, borderRadius: 4, backgroundColor: '#E0F7FA' },
  segFilled: { backgroundColor: '#06B6D4' },
  buttons: { flexDirection: 'row', gap: 10 },
  addBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 10, borderRadius: 12, borderWidth: 1.5, borderColor: '#06B6D4', backgroundColor: '#ECFEFF' },
  addText: { color: '#06B6D4', fontWeight: '700', fontSize: 13 },
});
export default WaterIntakeLogger;
