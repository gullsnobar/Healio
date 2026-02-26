import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width - 32;

const chartConfig = {
  backgroundGradientFrom: '#FFF',
  backgroundGradientTo: '#FFF',
  color: (opacity = 1) => `rgba(74, 144, 217, ${opacity})`,
  strokeWidth: 2,
  decimalPlaces: 0,
  propsForLabels: { fontSize: 11 },
};

const FitnessChart = ({ type = 'line', title, labels = [], data = [], suffix = '' }) => {
  const chartData = { labels, datasets: [{ data: data.length ? data : [0] }] };

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      {type === 'bar' ? (
        <BarChart data={chartData} width={screenWidth} height={200} chartConfig={chartConfig} style={styles.chart} fromZero />
      ) : (
        <LineChart data={chartData} width={screenWidth} height={200} chartConfig={chartConfig} style={styles.chart} bezier />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  title: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 },
  chart: { borderRadius: 8 },
});

export default FitnessChart;
