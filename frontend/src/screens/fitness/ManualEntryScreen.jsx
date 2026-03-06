import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { useAppTheme } from '../../styles/ThemeContext';
import ManualFitnessEntry from '../../components/fitness/ManualFitnessEntry';
import { logManualEntry } from '../../redux/slices/fitnessSlice';

const ManualEntryScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { colors } = useAppTheme();
  return (
    <ScrollView style={[s.c, { backgroundColor: colors.background }]}>
      <ManualFitnessEntry onSubmit={(data) => { dispatch(logManualEntry(data)); navigation.goBack(); }} />
    </ScrollView>
  );
};
const s = StyleSheet.create({ c: { flex: 1 } });
export default ManualEntryScreen;
