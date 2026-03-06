import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useAppTheme } from '../../styles/ThemeContext';
import AppointmentDetails from '../../components/appointments/AppointmentDetails';

const AppointmentDetailsScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const appointment = useSelector((state) => state.appointment.appointments.find(a => a._id === id));
  const { colors } = useAppTheme();
  return (
    <ScrollView style={[s.c, { backgroundColor: colors.background }]}>
      <AppointmentDetails appointment={appointment}
        onEdit={() => navigation.navigate('EditAppointment', { id })}
        onDelete={() => navigation.goBack()} />
    </ScrollView>
  );
};
const s = StyleSheet.create({ c: { flex: 1 } });
export default AppointmentDetailsScreen;
