import React from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useAppTheme } from '../../styles/ThemeContext';
import EditAppointmentForm from '../../components/appointments/EditAppointmentForm';
import { updateAppointment, deleteAppointment } from '../../redux/slices/appointmentSlice';

const EditAppointmentScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const dispatch = useDispatch();
  const appointment = useSelector((state) => state.appointment.appointments.find(a => a._id === id));
  const handleSubmit = async (data) => {
    await dispatch(updateAppointment({ id, data }));
    navigation.goBack();
  };
  const handleDelete = async () => { await dispatch(deleteAppointment(id)); navigation.goBack(); };
  const { colors } = useAppTheme();
  return <ScrollView style={[s.c, { backgroundColor: colors.background }]}><EditAppointmentForm initialData={appointment} onSubmit={handleSubmit} onDelete={handleDelete} /></ScrollView>;
};
const s = StyleSheet.create({ c: { flex: 1 } });
export default EditAppointmentScreen;
