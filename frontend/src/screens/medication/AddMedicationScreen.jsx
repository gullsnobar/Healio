import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';
import AddMedicationForm from '../../components/medication/AddMedicationForm';
import { addMedication } from '../../redux/slices/medicationSlice';
import { scheduleLocalNotification } from '../../services/firebase/fcmService';

const AddMedicationScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { colors, isDark } = useAppTheme();
  const handleSubmit = async (data) => {
    const result = await dispatch(addMedication(data));
    if (result.meta?.requestStatus === 'fulfilled') {
      try {
        const toHHMM = (t) => {
          if (!t) return null;
          if (t instanceof Date && !Number.isNaN(t.getTime())) {
            const hh = String(t.getHours()).padStart(2, '0');
            const mm = String(t.getMinutes()).padStart(2, '0');
            return `${hh}:${mm}`;
          }
          const raw = String(t).trim();
          const hhmm = raw.match(/^(\d{1,2}):(\d{2})$/);
          if (hhmm) return `${String(parseInt(hhmm[1], 10)).padStart(2, '0')}:${hhmm[2]}`;
          const ampm = raw.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
          if (!ampm) return null;
          let h = parseInt(ampm[1], 10);
          const m = parseInt(ampm[2], 10);
          const mer = ampm[3].toUpperCase();
          if (mer === 'PM' && h !== 12) h += 12;
          if (mer === 'AM' && h === 12) h = 0;
          return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        };

        const base = data.startDate ? new Date(data.startDate) : new Date();
        const baseDate = Number.isNaN(base.getTime()) ? new Date() : base;
        const times = Array.isArray(data.times) ? data.times : [];
        for (const t of times) {
          const hhmm = toHHMM(typeof t === 'object' ? t.time : t);
          const match = hhmm?.match(/^(\d{2}):(\d{2})$/);
          if (!match) continue;
          const h = parseInt(match[1], 10);
          const m = parseInt(match[2], 10);
          const triggerDate = new Date(baseDate);
          triggerDate.setHours(h, m, 0, 0);
          if (triggerDate.getTime() < Date.now() + 30 * 1000) {
            triggerDate.setDate(triggerDate.getDate() + 1);
          }

          await scheduleLocalNotification({
            title: 'Medication Reminder',
            body: `Time to take ${data.name || 'your medication'}${data.dosage ? ` (${data.dosage})` : ''}`,
            data: { type: 'MEDICATION_REMINDER' },
            triggerDate,
          });
        }
      } catch (_) {}

      Alert.alert('Success', 'Medication added');
      navigation.goBack();
      return;
    }
    const backendMessage = typeof result.payload === 'string' ? result.payload : null;
    const errorMessage =
      backendMessage ||
      result.error?.message ||
      'Failed to save medication. Please try again.';
    Alert.alert('Error', errorMessage);
    return result;
  };
  return (
    <SafeAreaView style={[s.c, { backgroundColor: colors.background }]}>
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
    </SafeAreaView>
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
