import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useAppTheme } from '../../styles/ThemeContext';
import StepCounter from '../../components/fitness/StepCounter';
import FitnessChart from '../../components/fitness/FitnessChart';

const StepsScreen = () => {
  const { dailyData, weeklyData } = useSelector((state) => state.fitness);
  const { colors } = useAppTheme();
  return (
    <ScrollView style={[s.c, { backgroundColor: colors.background }]}>
      <StepCounter steps={dailyData?.steps || 0} />
      <FitnessChart type="bar" title="Weekly Steps" labels={weeklyData?.labels || ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']} data={weeklyData?.steps || []} />
    </ScrollView>
  );
};
const s = StyleSheet.create({ c: { flex: 1, padding: 16 } });
export default StepsScreen;
