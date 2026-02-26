import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import DietLogger from '../../components/fitness/DietLogger';
import { logDiet } from '../../redux/slices/fitnessSlice';

const DietLogScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  return (
    <ScrollView style={s.c}>
      <DietLogger onSubmit={(data) => { dispatch(logDiet(data)); navigation.goBack(); }} />
    </ScrollView>
  );
};
const s = StyleSheet.create({ c: { flex: 1, backgroundColor: '#F5F7FA' } });
export default DietLogScreen;
