import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../styles/ThemeContext';

const WEEKS = ['W1', 'W2', 'W3', 'W4'];

const MonthlyProgressChart = ({ data = {} }) => {
  const { colors } = useAppTheme();
  const labels = data.labels || WEEKS;
  const values = data.values || [0, 0, 0, 0];
  const max = Math.max(...values, 1);

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.chart}>
        {values.map((v, i) => (
          <View key={i} style={styles.col}>
            <Text style={[styles.val, { color: colors.textTertiary }]}>{v || ''}</Text>
            <View style={[styles.fill, { height: Math.max((v / max) * 90, 4), backgroundColor: colors.success }]} />
            <Text style={[styles.label, { color: colors.textTertiary }]}>{labels[i]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { borderRadius: 20, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 4 },
  chart: { flexDirection: 'row', alignItems: 'flex-end', height: 100, gap: 8, justifyContent: 'space-around' },
  col: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  val: { fontSize: 10, marginBottom: 4, fontWeight: '600' },
  fill: { width: '60%', borderRadius: 6 },
  label: { fontSize: 10, marginTop: 6, fontWeight: '600' },
});
export default MonthlyProgressChart;
