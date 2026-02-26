import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FitnessChart from '../fitness/FitnessChart';

const MonthlyProgressChart = ({ data = {} }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Monthly Progress</Text>
    <FitnessChart type='line' labels={data.labels || ['W1','W2','W3','W4']} data={data.values || []} />
  </View>
);

const styles = StyleSheet.create({
  container: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, elevation: 2, marginBottom: 12 },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
});
export default MonthlyProgressChart;
