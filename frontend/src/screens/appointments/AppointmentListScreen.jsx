import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useAppTheme } from '../../styles/ThemeContext';
import AppointmentList from '../../components/appointments/AppointmentList';
import FAB from '../../components/common/FloatingActionButton';
import { fetchAppointments } from '../../redux/slices/appointmentSlice';

const AppointmentListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { appointments, loading } = useSelector((state) => state.appointment);
  const { colors } = useAppTheme();
  useEffect(() => { dispatch(fetchAppointments()); }, []);

  return (
    <View style={[s.c, { backgroundColor: colors.background }]}>
      <AppointmentList
        appointments={appointments}
        loading={loading}
        onItemPress={(apt) => navigation.navigate('AppointmentDetails', { id: apt._id })}
        onRefresh={() => dispatch(fetchAppointments())}
      />
      <FAB
        icon="add"
        onPress={() => navigation.navigate('AddAppointment')}
        size="medium"
        position="bottom-right"
        offsetY={100}
      />
    </View>
  );
};
const s = StyleSheet.create({c:{flex:1}});
export default AppointmentListScreen;
