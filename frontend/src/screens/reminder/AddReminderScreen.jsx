import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import ReminderForm from '../../components/reminder/ReminderForm';
import { addReminder } from '../../redux/slices/reminderSlice';
import { useAppTheme } from '../../styles/ThemeContext';
import { scheduleLocalNotification } from '../../services/firebase/fcmService';

const TYPES = [
  { key: 'medication', label: 'Medication', icon: 'medical-outline', color: '#14B8A6' },
  { key: 'appointment', label: 'Appointment', icon: 'calendar-outline', color: '#6366F1' },
  { key: 'lab', label: 'Lab Report', icon: 'flask-outline', color: '#F59E0B' },
];

const AddReminderScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { colors, isDark } = useAppTheme();
  const { loading } = useSelector((s) => s.reminder);
  const preselectedType = route?.params?.type || null;
  const [selectedType, setSelectedType] = useState(preselectedType);

  const handleSubmit = async (data) => {
    try {
      await dispatch(addReminder(data)).unwrap();
      try {
        const timeStr = typeof data.time === 'string' ? data.time : '';
        const match = timeStr.match(/^(\d{2}):(\d{2})$/);
        const baseDate = data.date ? new Date(data.date) : new Date();
        if (match && !Number.isNaN(baseDate.getTime())) {
          const h = parseInt(match[1], 10);
          const m = parseInt(match[2], 10);
          const triggerDate = new Date(baseDate);
          triggerDate.setHours(h, m, 0, 0);
          if (triggerDate.getTime() > Date.now() - 60 * 1000) {
            const title = data.reminderType === 'medication'
              ? 'Medication Reminder'
              : data.reminderType === 'appointment'
                ? 'Appointment Reminder'
                : 'Lab Report Reminder';
            const body = data.reminderType === 'medication'
              ? `Time to take ${data.medicationName || data.title}`
              : data.reminderType === 'appointment'
                ? `Reminder: ${data.title}`
                : `Reminder: ${data.title}`;
            await scheduleLocalNotification({ title, body, data: { type: 'REMINDER' }, triggerDate });
          }
        }
      } catch (_) {}
      navigation.goBack();
    } catch (err) {
      const msg = typeof err === 'string' ? err : 'Failed to save reminder. Please try again.';
      Alert.alert('Save Reminder', msg);
    }
  };

  // Step 1 — pick type (unless pre-selected)
  if (!selectedType) {
    return (
      <View style={[s.container, { backgroundColor: colors.background }]}> 
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
        <Text style={[s.heading, { color: colors.text }]}>What type of reminder?</Text>
        <View style={s.typeGrid}>
          {TYPES.map((t) => (
            <TouchableOpacity
              key={t.key}
              style={[s.typeCard, { backgroundColor: colors.card }]}
              onPress={() => setSelectedType(t.key)}
              activeOpacity={0.8}
            >
              <View style={[s.typeIcon, { backgroundColor: t.color + '18' }]}>
                <Ionicons name={t.icon} size={32} color={t.color} />
              </View>
              <Text style={[s.typeLabel, { color: colors.text }]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  // Step 2 — form
  return <ReminderForm reminderType={selectedType} onSubmit={handleSubmit} loading={loading} />;
};

const s = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  heading: { fontSize: 22, fontWeight: '700', marginTop: 20, marginBottom: 30, textAlign: 'center' },
  typeGrid: { gap: 16 },
  typeCard: {
    flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 16,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6,
  },
  typeIcon: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  typeLabel: { fontSize: 17, fontWeight: '600' },
});

export default AddReminderScreen;
