import React, { useState } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { useAppTheme } from '../../styles/ThemeContext';
import ManualFitnessEntry from '../../components/fitness/ManualFitnessEntry';
import { logManualEntry, logWaterIntake, fetchFitnessData } from '../../redux/slices/fitnessSlice';
import { fetchDashboardData } from '../../redux/slices/userSlice';

const ManualEntryScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { colors } = useAppTheme();
  const [saving, setSaving] = useState(false);
  const handleSubmit = async (entry) => {
    try {
      setSaving(true);
      const numericValue = Number(entry.value || 0);
      if (!numericValue || Number.isNaN(numericValue) || numericValue <= 0) {
        Alert.alert('Missing value', 'Please enter a valid number.');
        return;
      }

      if (entry.type === 'water') {
        await dispatch(logWaterIntake(numericValue)).unwrap();
      } else {
        const payload = {};
        if (entry.type === 'steps') {
          payload.steps = { count: numericValue };
        } else if (entry.type === 'sleep') {
          payload.sleep = { duration: numericValue };
        } else if (entry.type === 'calories') {
          payload.calories = { burned: numericValue };
        } else if (entry.type === 'weight') {
          payload.weight = { value: numericValue, unit: 'kg' };
        }
        await dispatch(logManualEntry(payload)).unwrap();
      }

      await dispatch(fetchFitnessData());
      await dispatch(fetchDashboardData());

      Alert.alert('Saved', 'Your entry has been saved.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Error', 'Failed to save entry. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  return (
    <ScrollView style={[s.c, { backgroundColor: colors.background }]}>
      <ManualFitnessEntry onSubmit={handleSubmit} loading={saving} />
    </ScrollView>
  );
};
const s = StyleSheet.create({ c: { flex: 1 } });
export default ManualEntryScreen;
