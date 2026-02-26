import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const StepCounter = ({ steps = 0, goal = 10000 }) => {
  const progress = Math.min(steps / goal, 1);
  return (
    <View style={styles.container}>
      <Ionicons name="footsteps-outline" size={32} color="#4A90D9" />
      <Text style={styles.count}>{steps.toLocaleString()}</Text>
      <Text style={styles.label}>/ {goal.toLocaleString()} steps</Text>
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
  progressFill: { height: 8, backgroundColor: '#4A90D9', borderRadius: 4 },
});

export default StepCounter;
