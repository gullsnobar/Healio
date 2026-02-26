import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import MedicationList from '../../components/medication/MedicationList';
import { fetchMedications } from '../../redux/slices/medicationSlice';

const MedicationListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { medications, loading } = useSelector((state) => state.medication);
  useEffect(() => { dispatch(fetchMedications()); }, []);

  return (
    <View style={s.c}>
      <MedicationList medications={medications} loading={loading}
        onItemPress={(med) => navigation.navigate('MedicationDetails', { id: med._id })}
        onMarkTaken={(med) => dispatch({ type: 'medication/markAsTaken', payload: med._id })}
        onRefresh={() => dispatch(fetchMedications())} />
      <TouchableOpacity style={s.fab} onPress={() => navigation.navigate('AddMedication')}>
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};
const s = StyleSheet.create({c:{flex:1,backgroundColor:'#F5F7FA'},fab:{position:'absolute',right:20,bottom:20,width:56,height:56,borderRadius:28,backgroundColor:'#4A90D9',alignItems:'center',justifyContent:'center',elevation:4}});
export default MedicationListScreen;
