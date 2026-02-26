import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MedicationStatusWidget = ({ data = { taken: 0, missed: 0, pending: 0 } }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Today's Medications</Text>
    <View style={styles.row}>
      {[['Taken', data.taken, '#4CAF50'], ['Missed', data.missed, '#F44336'], ['Pending', data.pending, '#FF9800']].map(([label, val, color]) => (
        <View key={label} style={styles.stat}>
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
  num: { fontSize: 24, fontWeight: '700' },
  label: { fontSize: 12, color: '#888', marginTop: 4 },
});
export default MedicationStatusWidget;
