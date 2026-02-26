import React from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import AddAppointmentForm from '../../components/appointments/AddAppointmentForm';
import { addAppointment } from '../../redux/slices/appointmentSlice';

const AddAppointmentScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const handleSubmit = async (data) => {
    const result = await dispatch(addAppointment(data));
    if (!result.error) { Alert.alert('Success', 'Appointment scheduled'); navigation.goBack(); }
  };
  return <ScrollView style={s.c}><AddAppointmentForm onSubmit={handleSubmit} /></ScrollView>;
};
const s = StyleSheet.create({ c: { flex: 1, backgroundColor: '#F5F7FA' } });
export default AddAppointmentScreen;
