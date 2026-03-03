import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import MedicationList from '../../components/medication/MedicationList';
import { fetchMedications } from '../../redux/slices/medicationSlice';

const MedicationListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { medications, loading } = useSelector((state) => state.medication);
  useEffect(() => { dispatch(fetchMedications()); }, []);

  return (
    <View style={ms.c}>
      <StatusBar barStyle="light-content" backgroundColor="#0F766E" />
      <MedicationList
        medications={medications}
        loading={loading}
        onItemPress={(med) => navigation.navigate('MedicationDetails', { id: med._id })}
        onMarkTaken={(med) => dispatch({ type: 'medication/markAsTaken', payload: med._id })}
        onRefresh={() => dispatch(fetchMedications())}
      />

      {/* Gradient FAB */}
      <TouchableOpacity
        style={ms.fabWrap}
        onPress={() => navigation.navigate('AddMedication')}
        activeOpacity={0.9}
      >
        <LinearGradient colors={['#0F766E', '#0D6560']} style={ms.fab}>
          <Ionicons name="add" size={30} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const ms = StyleSheet.create({
  c: { flex: 1, backgroundColor: '#F8FAFC' },
  fabWrap: {
    position: 'absolute', right: 20, bottom: 24,
    shadowColor: '#0F766E', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 10,
  },
  fab: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
});
export default MedicationListScreen;
