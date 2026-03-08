import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { useAppTheme } from '../../styles/ThemeContext';
import MedicationList from '../../components/medication/MedicationList';
import { fetchMedications } from '../../redux/slices/medicationSlice';

const MedicationListScreen = ({ navigation }) => {
  const { colors, isDark } = useAppTheme();
  const dispatch = useDispatch();
  const { medications, loading } = useSelector((state) => state.medication);

  // Re-fetch every time this screen comes into focus (e.g. after adding a med)
  useFocusEffect(useCallback(() => { dispatch(fetchMedications()); }, [dispatch]));

  return (
    <View style={[ms.c, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      <MedicationList
        medications={medications}
        loading={loading}
        onItemPress={(med) => navigation.navigate('MedicationDetails', { id: med._id })}
        onMarkTaken={(med) => dispatch({ type: 'medication/markAsTaken', payload: med._id })}
        onRefresh={() => dispatch(fetchMedications())}
      />

      <TouchableOpacity
        style={ms.fabWrap}
        onPress={() => navigation.navigate('AddMedication')}
        activeOpacity={0.9}
      >
        <LinearGradient colors={colors.primaryGrad} style={ms.fab}>
          <Ionicons name="add" size={30} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const ms = StyleSheet.create({
  c: { flex: 1 },
  fabWrap: {
    position: 'absolute', right: 20, bottom: 24,
    shadowColor: '#14B8A6', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 10,
  },
  fab: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
});
export default MedicationListScreen;
