import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const WaterIntakeLogger = ({ intake = 0, goal = 2500, onAdd }) => {
  const glasses = Math.floor(intake / 250);
  const progress = Math.min(intake / goal, 1);

  return (
    <View style={styles.container}>
      <Ionicons name="water-outline" size={32} color="#00BCD4" />
      <Text style={styles.count}>{intake} ml</Text>
      <Text style={styles.label}>/ {goal} ml ({glasses} glasses)</Text>
      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
      <View style={styles.buttons}>
        {[150, 250, 500].map((ml) => (
          <TouchableOpacity key={ml} style={styles.addBtn} onPress={() => onAdd?.(ml)}>
            <Text style={styles.addBtnText}>+{ml}ml</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 16 },
  count: { fontSize: 28, fontWeight: '700', color: '#333', marginTop: 8 },
  label: { fontSize: 14, color: '#888', marginTop: 2 },
  progressBg: { width: '100%', height: 8, backgroundColor: '#E0E0E0', borderRadius: 4, marginTop: 12 },
  progressFill: { height: 8, backgroundColor: '#00BCD4', borderRadius: 4 },
  buttons: { flexDirection: 'row', marginTop: 16, gap: 12 },
  addBtn: { backgroundColor: '#00BCD4', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  addBtnText: { color: '#FFF', fontWeight: '600' },
});

export default WaterIntakeLogger;
