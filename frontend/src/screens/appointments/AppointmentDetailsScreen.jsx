import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import AppointmentDetails from '../../components/appointments/AppointmentDetails';

const AppointmentDetailsScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const appointment = useSelector((state) => state.appointment.appointments.find(a => a._id === id));
  return (
    <ScrollView style={s.c}>
      <AppointmentDetails appointment={appointment}
        onEdit={() => navigation.navigate('EditAppointment', { id })}
        onDelete={() => navigation.goBack()} />
    </ScrollView>
  );
};
const s = StyleSheet.create({ c: { flex: 1, backgroundColor: '#F5F7FA' } });
export default AppointmentDetailsScreen;
