import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { useAppTheme } from '../../styles/ThemeContext';
import MedicationList from '../../components/medication/MedicationList';
import { fetchMedications, markAsTaken } from '../../redux/slices/medicationSlice';
import Tooltip from '../../components/common/Tooltip';
import FAB from '../../components/common/FloatingActionButton';

const MedicationListScreen = ({ navigation }) => {
  const { colors, isDark } = useAppTheme();
  const dispatch = useDispatch();
  const { medications, loading } = useSelector((state) => state.medication);

  // Re-fetch every time this screen comes into focus (e.g. after adding a med)
  useFocusEffect(useCallback(() => { dispatch(fetchMedications()); }, [dispatch]));

  return (
    <View style={[ms.c, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      
      {/* Header with back button */}
      <View style={[ms.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={ms.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[ms.headerTitle, { color: colors.text }]}>Medications</Text>
        <View style={ms.headerSpacer} />
      </View>

      <MedicationList
        medications={medications}
        loading={loading}
        onItemPress={(med) => navigation.navigate('MedicationDetails', { id: med._id })}
        onMarkTaken={(med) => dispatch(markAsTaken(med._id))}
        onRefresh={() => dispatch(fetchMedications())}
      />

      <FAB
        icon="add"
        onPress={() => navigation.navigate('AddMedication')}
        size="medium"
        position="bottom-right"
        offsetY={100}
      />
    </View>
  );
};

const ms = StyleSheet.create({
  c: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', flex: 1, textAlign: 'center' },
  headerSpacer: { width: 32 },
});
export default MedicationListScreen;
