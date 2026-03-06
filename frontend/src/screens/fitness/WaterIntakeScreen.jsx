import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useAppTheme } from '../../styles/ThemeContext';
import WaterIntakeLogger from '../../components/fitness/WaterIntakeLogger';
import FitnessChart from '../../components/fitness/FitnessChart';
import { logWaterIntake } from '../../redux/slices/fitnessSlice';

const WaterIntakeScreen = () => {
  const dispatch = useDispatch();
  const { dailyData, weeklyData } = useSelector((state) => state.fitness);
  const { colors } = useAppTheme();
  return (
    <ScrollView style={[s.c, { backgroundColor: colors.background }]}>
      <WaterIntakeLogger intake={dailyData?.water || 0} onAdd={(ml) => dispatch(logWaterIntake(ml))} />
      <FitnessChart type="bar" title="Weekly Water Intake" labels={weeklyData?.labels || []} data={weeklyData?.water || []} />
    </ScrollView>
  );
};
const s = StyleSheet.create({ c: { flex: 1, padding: 16 } });
export default WaterIntakeScreen;
