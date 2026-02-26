import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import SleepTracker from '../../components/fitness/SleepTracker';
import FitnessChart from '../../components/fitness/FitnessChart';

const SleepScreen = () => {
  const { dailyData, weeklyData } = useSelector((state) => state.fitness);
  return (
    <ScrollView style={s.c}>
      <SleepTracker hours={dailyData?.sleep || 0} />
      <FitnessChart type="line" title="Weekly Sleep" labels={weeklyData?.labels || ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']} data={weeklyData?.sleep || []} />
    </ScrollView>
  );
};
const s = StyleSheet.create({ c: { flex: 1, backgroundColor: '#F5F7FA', padding: 16 } });
export default SleepScreen;
