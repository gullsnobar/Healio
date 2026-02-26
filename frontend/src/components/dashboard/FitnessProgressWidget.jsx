import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FitnessProgressWidget = ({ data = { steps: 0, sleep: 0, water: 0 } }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Fitness Today</Text>
    <View style={styles.row}>
      {[['footsteps', data.steps, 'Steps', '#4A90D9'], ['moon', data.sleep + 'h', 'Sleep', '#6C63FF'], ['water', data.water + 'ml', 'Water', '#00BCD4']].map(([icon, val, label, color]) => (
        <View key={label} style={styles.stat}>
          <Ionicons name={icon + '-outline'} size={24} color={color} />
          <Text style={[styles.num, { color }]}>{val}</Text>
          <Text style={styles.label}>{label}</Text>
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, elevation: 2, marginBottom: 12 },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-around' },
  stat: { alignItems: 'center' },
  num: { fontSize: 18, fontWeight: '700', marginTop: 4 },
  label: { fontSize: 12, color: '#888', marginTop: 2 },
});
export default FitnessProgressWidget;
