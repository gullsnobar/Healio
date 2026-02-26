import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import AppointmentList from '../../components/appointments/AppointmentList';
import { fetchAppointments } from '../../redux/slices/appointmentSlice';

const AppointmentListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { appointments, loading } = useSelector((state) => state.appointment);
  useEffect(() => { dispatch(fetchAppointments()); }, []);

  return (
    <View style={s.c}>
      <AppointmentList appointments={appointments} loading={loading}
        onItemPress={(apt) => navigation.navigate('AppointmentDetails', { id: apt._id })}
        onRefresh={() => dispatch(fetchAppointments())} />
      <TouchableOpacity style={s.fab} onPress={() => navigation.navigate('AddAppointment')}>
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};
const s = StyleSheet.create({c:{flex:1,backgroundColor:'#F5F7FA'},fab:{position:'absolute',right:20,bottom:20,width:56,height:56,borderRadius:28,backgroundColor:'#4A90D9',alignItems:'center',justifyContent:'center',elevation:4}});
export default AppointmentListScreen;
