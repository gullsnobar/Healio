import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import ManualFitnessEntry from '../../components/fitness/ManualFitnessEntry';
import { logManualEntry } from '../../redux/slices/fitnessSlice';

const ManualEntryScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  return (
    <ScrollView style={s.c}>
      <ManualFitnessEntry onSubmit={(data) => { dispatch(logManualEntry(data)); navigation.goBack(); }} />
    </ScrollView>
  );
};
const s = StyleSheet.create({ c: { flex: 1, backgroundColor: '#F5F7FA' } });
export default ManualEntryScreen;
