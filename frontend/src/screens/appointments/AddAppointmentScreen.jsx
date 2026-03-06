import React from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { useAppTheme } from '../../styles/ThemeContext';
import AddAppointmentForm from '../../components/appointments/AddAppointmentForm';
import { addAppointment } from '../../redux/slices/appointmentSlice';

const AddAppointmentScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const handleSubmit = async (data) => {
    const result = await dispatch(addAppointment(data));
    if (!result.error) { Alert.alert('Success', 'Appointment scheduled'); navigation.goBack(); }
  };
  const { colors } = useAppTheme();
  return <ScrollView style={[s.c, { backgroundColor: colors.background }]}><AddAppointmentForm onSubmit={handleSubmit} /></ScrollView>;
};
const s = StyleSheet.create({ c: { flex: 1 } });
export default AddAppointmentScreen;
