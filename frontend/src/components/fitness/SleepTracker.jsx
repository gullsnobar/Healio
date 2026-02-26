import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SleepTracker = ({ hours = 0, goal = 8 }) => {
  const progress = Math.min(hours / goal, 1);
  return (
    <View style={styles.container}>
      <Ionicons name="moon-outline" size={32} color="#6C63FF" />
      <Text style={styles.count}>{hours.toFixed(1)}h</Text>
      <Text style={styles.label}>/ {goal}h sleep goal</Text>
      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 16 },
  count: { fontSize: 28, fontWeight: '700', color: '#333', marginTop: 8 },
  label: { fontSize: 14, color: '#888', marginTop: 2 },
  progressBg: { width: '100%', height: 8, backgroundColor: '#E0E0E0', borderRadius: 4, marginTop: 12 },
  progressFill: { height: 8, backgroundColor: '#6C63FF', borderRadius: 4 },
});

export default SleepTracker;
