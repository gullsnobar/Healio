import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { useAppTheme } from '../../styles/ThemeContext';
import DietLogger from '../../components/fitness/DietLogger';
import { logDiet } from '../../redux/slices/fitnessSlice';

const DietLogScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { colors } = useAppTheme();
  return (
    <ScrollView style={[s.c, { backgroundColor: colors.background }]}>
      <DietLogger onSubmit={(data) => { dispatch(logDiet(data)); navigation.goBack(); }} />
    </ScrollView>
  );
};
const s = StyleSheet.create({ c: { flex: 1 } });
export default DietLogScreen;
