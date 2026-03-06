import React from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useAppTheme } from '../../styles/ThemeContext';
import EditMedicationForm from '../../components/medication/EditMedicationForm';
import { updateMedication, deleteMedication } from '../../redux/slices/medicationSlice';

const EditMedicationScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const dispatch = useDispatch();
  const medication = useSelector((state) => state.medication.medications.find(m => m._id === id));

  const handleSubmit = async (data) => {
    const result = await dispatch(updateMedication({ id, data }));
    if (!result.error) { Alert.alert('Success', 'Medication updated'); navigation.goBack(); }
  };

  const handleDelete = async () => {
    const result = await dispatch(deleteMedication(id));
    if (!result.error) navigation.navigate('Medications');
  };

  const { colors } = useAppTheme();
  return <ScrollView style={[s.c, { backgroundColor: colors.background }]}><EditMedicationForm initialData={medication} onSubmit={handleSubmit} onDelete={handleDelete} /></ScrollView>;
};
const s = StyleSheet.create({ c: { flex: 1 } });
export default EditMedicationScreen;
