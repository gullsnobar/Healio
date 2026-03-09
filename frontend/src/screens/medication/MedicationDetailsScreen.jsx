import React, { useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useAppTheme } from '../../styles/ThemeContext';
import MedicationDetails from '../../components/medication/MedicationDetails';

const MedicationDetailsScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const medication = useSelector((state) => state.medication.medications.find(m => m._id === id));

  const { colors } = useAppTheme();
  return (
    <ScrollView style={[s.c, { backgroundColor: colors.background }]}>
      <MedicationDetails medication={medication} logs={medication?.adherenceHistory || []}
        onEdit={() => navigation.navigate('EditMedication', { id })}
        onDelete={() => navigation.goBack()} />
    </ScrollView>
  );
};
const s = StyleSheet.create({ c: { flex: 1 } });
export default MedicationDetailsScreen;
