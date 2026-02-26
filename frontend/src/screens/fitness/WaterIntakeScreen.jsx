import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import WaterIntakeLogger from '../../components/fitness/WaterIntakeLogger';
import FitnessChart from '../../components/fitness/FitnessChart';
import { logWaterIntake } from '../../redux/slices/fitnessSlice';

const WaterIntakeScreen = () => {
  const dispatch = useDispatch();
  const { dailyData, weeklyData } = useSelector((state) => state.fitness);
  return (
    <ScrollView style={s.c}>
      <WaterIntakeLogger intake={dailyData?.water || 0} onAdd={(ml) => dispatch(logWaterIntake(ml))} />
      <FitnessChart type="bar" title="Weekly Water Intake" labels={weeklyData?.labels || []} data={weeklyData?.water || []} />
    </ScrollView>
  );
};
const s = StyleSheet.create({ c: { flex: 1, backgroundColor: '#F5F7FA', padding: 16 } });
export default WaterIntakeScreen;
