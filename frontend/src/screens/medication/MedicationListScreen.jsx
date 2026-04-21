import React, { useCallback, useState, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar, Text, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { useAppTheme } from '../../styles/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MedicationList from '../../components/medication/MedicationList';
import { fetchMedications, markAsTaken } from '../../redux/slices/medicationSlice';
import { fetchDashboardData, fetchHealthScore } from '../../redux/slices/userSlice';
import Tooltip from '../../components/common/Tooltip';

const MedicationListScreen = ({ navigation, route }) => {
  const { colors, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { medications, loading } = useSelector((state) => state.medication);
  const [markingId, setMarkingId] = useState(null);
  const filterStatus = route?.params?.filterStatus || null;

  const handleMarkTaken = async (med) => {
    if (!med?._id) return;
    setMarkingId(med._id);
    try {
      const result = await dispatch(markAsTaken(med._id));
      if (result.meta?.requestStatus === 'fulfilled') {
        await dispatch(fetchDashboardData());
        await dispatch(fetchHealthScore());
        Alert.alert('Success', 'Medication marked as taken');
      } else {
        const backendMessage = typeof result.payload === 'string' ? result.payload : null;
        const errorMessage =
          backendMessage ||
          result.error?.message ||
          'Failed to mark medication as taken. Please try again.';
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setMarkingId(null);
    }
  };

  // Re-fetch every time this screen comes into focus (e.g. after adding a med)
  useFocusEffect(useCallback(() => { dispatch(fetchMedications()); }, [dispatch]));

  const filteredMedications = useMemo(() => {
    if (!filterStatus) return medications;
    const key = String(filterStatus).toLowerCase();
    return medications.filter((m) => (m.status || 'pending').toLowerCase() === key);
  }, [medications, filterStatus]);

  return (
    <View style={[ms.c, { backgroundColor: colors.background, paddingTop: insets.top }]}>
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
        medications={filteredMedications}
        loading={loading}
        onItemPress={(med) => navigation.navigate('MedicationDetails', { id: med._id })}
        onMarkTaken={handleMarkTaken}
        markingId={markingId}
        onRefresh={() => dispatch(fetchMedications())}
      />

      <Tooltip text="Add medication">
        <TouchableOpacity
          style={ms.fabWrap}
          onPress={() => navigation.navigate('AddMedication')}
          activeOpacity={0.9}
        >
          <LinearGradient colors={colors.primaryGrad} style={ms.fab}>
            <Ionicons name="add" size={30} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </Tooltip>
    </View>
  );
};

const ms = StyleSheet.create({
  c: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', flex: 1, textAlign: 'center' },
  headerSpacer: { width: 32 },
  fabWrap: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    shadowColor: '#14B8A6', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 10,
  },
  fab: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
});
export default MedicationListScreen;
