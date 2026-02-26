import React from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import AddMedicationForm from '../../components/medication/AddMedicationForm';
import { addMedication } from '../../redux/slices/medicationSlice';

const AddMedicationScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const handleSubmit = async (data) => {
    const result = await dispatch(addMedication(data));
    if (!result.error) { Alert.alert('Success', 'Medication added'); navigation.goBack(); }
  };
  return <ScrollView style={s.c}><AddMedicationForm onSubmit={handleSubmit} /></ScrollView>;
};
const s = StyleSheet.create({ c: { flex: 1, backgroundColor: '#F5F7FA' } });
export default AddMedicationScreen;
