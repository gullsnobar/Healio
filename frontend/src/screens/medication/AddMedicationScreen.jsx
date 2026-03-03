import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, StatusBar } from 'react-native';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import AddMedicationForm from '../../components/medication/AddMedicationForm';
import { addMedication } from '../../redux/slices/medicationSlice';

const AddMedicationScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const handleSubmit = async (data) => {
    const result = await dispatch(addMedication(data));
    if (!result.error) { Alert.alert('Success', 'Medication added'); navigation.goBack(); }
  };
  return (
    <View style={s.c}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#475569" />
        </TouchableOpacity>
        <View style={s.headerText}>
          <Text style={s.title}>Add New Medicine</Text>
          <Text style={s.subtitle}>Fill out the fields and hit Save to add it!</Text>
        </View>
      </View>
      <AddMedicationForm onSubmit={handleSubmit} />
    </View>
  );
};
const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 14,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerText: { flex: 1 },
  title: { fontSize: 20, fontWeight: '800', color: '#1E293B', letterSpacing: -0.3 },
  subtitle: { fontSize: 13, color: '#94A3B8', marginTop: 2 },
});
export default AddMedicationScreen;
