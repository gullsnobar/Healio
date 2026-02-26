import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HealthScoreWidget = ({ score = 0 }) => {
  const color = score >= 80 ? '#4CAF50' : score >= 50 ? '#FF9800' : '#F44336';
  return (
    <View style={styles.container}>
      <Ionicons name='heart-circle' size={48} color={color} />
      <Text style={[styles.score, { color }]}>{score}</Text>
      <Text style={styles.label}>Health Score</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, alignItems: 'center', elevation: 2, marginBottom: 12 },
  score: { fontSize: 36, fontWeight: '800', marginTop: 8 },
  label: { fontSize: 14, color: '#888', marginTop: 4 },
});
export default HealthScoreWidget;
