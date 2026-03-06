import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../styles/ThemeContext';
import FitnessChart from '../fitness/FitnessChart';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const WeeklyProgressChart = ({ data = {} }) => {
  const { colors } = useAppTheme();
  const labels = data.labels || DAYS;
  const values = data.values || [0, 0, 0, 0, 0, 0, 0];
  const max = Math.max(...values, 1);

  return (
    <View style={[styles.container, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
      <View style={styles.bars}>
        {values.map((v, i) => (
          <View key={i} style={styles.barCol}>
            <Text style={[styles.barVal, { color: colors.textTertiary }]}>{v || ''}</Text>
            <View style={[styles.barTrack, { backgroundColor: colors.cardAlt }]}>
              <View style={[styles.barFill, { height: `${Math.max((v / max) * 100, 4)}%`, backgroundColor: colors.primary }]} />
            </View>
            <Text style={[styles.barLabel, { color: colors.textTertiary }]}>{labels[i]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { borderRadius: 20, padding: 16, marginBottom: 16, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 4 },
  bars: { flexDirection: 'row', alignItems: 'flex-end', height: 120, gap: 4, justifyContent: 'space-between' },
  barCol: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  barVal: { fontSize: 9, marginBottom: 2, fontWeight: '600' },
  barTrack: { width: '100%', height: '80%', justifyContent: 'flex-end', borderRadius: 6, overflow: 'hidden' },
  barFill: { width: '100%', borderRadius: 6 },
  barLabel: { fontSize: 9, marginTop: 4, fontWeight: '600' },
});
export default WeeklyProgressChart;
