import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, StatusBar } from 'react-native';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';
import AddMedicationForm from '../../components/medication/AddMedicationForm';
import { addMedication } from '../../redux/slices/medicationSlice';

const AddMedicationScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { colors, isDark } = useAppTheme();
  const handleSubmit = async (data) => {
    const result = await dispatch(addMedication(data));
    if (!result.error) { Alert.alert('Success', 'Medication added'); navigation.goBack(); }
  };
  return (
    <View style={[s.c, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[s.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={s.headerText}>
          <Text style={[s.title, { color: colors.text }]}>Add New Medicine</Text>
          <Text style={[s.subtitle, { color: colors.textTertiary }]}>Fill out the fields and hit Save to add it!</Text>
        </View>
      </View>
      <AddMedicationForm onSubmit={handleSubmit} />
    </View>
  );
};
const s = StyleSheet.create({
  c: { flex: 1 },
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
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  headerText: { flex: 1 },
  title: { fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  subtitle: { fontSize: 13, marginTop: 2 },
});
export default AddMedicationScreen;
