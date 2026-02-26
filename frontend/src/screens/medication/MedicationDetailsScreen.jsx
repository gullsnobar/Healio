import React, { useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import MedicationDetails from '../../components/medication/MedicationDetails';

const MedicationDetailsScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const medication = useSelector((state) => state.medication.medications.find(m => m._id === id));

  return (
    <ScrollView style={s.c}>
      <MedicationDetails medication={medication} logs={medication?.logs || []}
        onEdit={() => navigation.navigate('EditMedication', { id })}
        onDelete={() => navigation.goBack()} />
    </ScrollView>
  );
};
const s = StyleSheet.create({ c: { flex: 1, backgroundColor: '#F5F7FA' } });
export default MedicationDetailsScreen;
