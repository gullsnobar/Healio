import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FitnessChart from '../fitness/FitnessChart';

const WeeklyProgressChart = ({ data = {} }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Weekly Progress</Text>
    <FitnessChart type='bar' labels={data.labels || ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']} data={data.values || []} />
  </View>
);

const styles = StyleSheet.create({
  container: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, elevation: 2, marginBottom: 12 },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
});
export default WeeklyProgressChart;
