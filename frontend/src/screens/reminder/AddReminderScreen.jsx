import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import ReminderForm from '../../components/reminder/ReminderForm';
import { addReminder } from '../../redux/slices/reminderSlice';
import { useAppTheme } from '../../styles/ThemeContext';

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
      navigation.goBack();
    } catch { /* error handled in slice */ }
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
