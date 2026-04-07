import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { reminderAPI } from '../../services/api/reminderAPI';
import { deleteReminder, completeReminder, snoozeReminder } from '../../redux/slices/reminderSlice';
import { useAppTheme } from '../../styles/ThemeContext';

const TYPE_META = {
  medication: { color: '#14B8A6', icon: 'medical-outline', label: 'Medication' },
  appointment: { color: '#6366F1', icon: 'calendar-outline', label: 'Appointment' },
  lab: { color: '#F59E0B', icon: 'flask-outline', label: 'Lab Report' },
};

const ReminderDetailsScreen = ({ navigation, route }) => {
  const { id } = route.params;
  const dispatch = useDispatch();
  const { colors, isDark } = useAppTheme();
  const [reminder, setReminder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await reminderAPI.getById(id);
        setReminder(res.data.data || res.data);
      } catch { Alert.alert('Error', 'Failed to load reminder'); navigation.goBack(); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const handleDelete = () => {
    Alert.alert('Delete Reminder', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => { await dispatch(deleteReminder(id)); navigation.goBack(); },
      },
    ]);
  };

  const handleComplete = async () => {
    try {
      const result = await dispatch(completeReminder(id)).unwrap();
      setReminder(result.data || result);
      
      // If medication reminder, also record dose in adherence history
      if (reminder.reminderType === 'medication') {
        try {
          // Save dose to medication adherence history (optional - for tracking)
          // This would be called if you have a linked medication ID
          Alert.alert('✓ Medicine Taken', `${reminder.medicationName} recorded as taken at ${new Date().toLocaleTimeString()}`);
        } catch (err) {
          console.error('Failed to record adherence:', err);
        }
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to mark as taken');
    }
  };

  const handleSnooze = async () => {
    const result = await dispatch(snoozeReminder({ id, minutes: 15 })).unwrap();
    setReminder(result.data || result);
  };

  if (loading) {
    return (
      <View style={[s.centered, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!reminder) return null;

  const meta = TYPE_META[reminder.reminderType] || TYPE_META.medication;
  const bg = isDark ? '#1E293B' : '#FFF';
  const textColor = isDark ? '#E2E8F0' : '#1F2937';
  const subColor = isDark ? '#94A3B8' : '#64748B';

  const InfoRow = ({ icon, label, value }) => value ? (
    <View style={s.infoRow}>
      <Ionicons name={icon} size={16} color={meta.color} style={{ marginTop: 2 }} />
      <View style={{ marginLeft: 10, flex: 1 }}>
        <Text style={[s.infoLabel, { color: subColor }]}>{label}</Text>
        <Text style={[s.infoValue, { color: textColor }]}>{value}</Text>
      </View>
    </View>
  ) : null;

  return (
    <View style={[s.container, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        {/* Header card */}
        <View style={[s.headerCard, { backgroundColor: bg }]}>
          <View style={[s.typeBadge, { backgroundColor: meta.color + '18' }]}>
            <Ionicons name={meta.icon} size={22} color={meta.color} />
            <Text style={[s.typeText, { color: meta.color }]}>{meta.label}</Text>
          </View>
          <Text style={[s.title, { color: textColor }]}>{reminder.title}</Text>
          {reminder.isCompleted && (
            <View style={s.completedBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text style={{ color: '#10B981', fontWeight: '600', marginLeft: 4, fontSize: 13 }}>Completed</Text>
            </View>
          )}
        </View>

        {/* Scheduling */}
        <View style={[s.section, { backgroundColor: bg }]}>
          <Text style={[s.sectionTitle, { color: colors.primary }]}>Schedule</Text>
          <InfoRow icon="calendar-outline" label="Date" value={new Date(reminder.date).toLocaleDateString()} />
          <InfoRow icon="time-outline" label="Time" value={reminder.time} />
          <InfoRow icon="repeat-outline" label="Repeat" value={reminder.repeat !== 'none' ? reminder.repeat : null} />
        </View>

        {/* Type-specific details */}
        {reminder.reminderType === 'medication' && (
          <View style={[s.section, { backgroundColor: bg }]}>
            <Text style={[s.sectionTitle, { color: meta.color }]}>Medication Details</Text>
            <InfoRow icon="medical-outline" label="Medication" value={reminder.medicationName} />
            <InfoRow icon="fitness-outline" label="Dosage" value={reminder.dosage ? `${reminder.dosage} ${reminder.dosageUnit || ''}` : null} />
            <InfoRow icon="refresh-outline" label="Frequency" value={reminder.frequency} />
            <InfoRow icon="document-text-outline" label="Instructions" value={reminder.instructions} />
          </View>
        )}
        {reminder.reminderType === 'appointment' && (
          <View style={[s.section, { backgroundColor: bg }]}>
            <Text style={[s.sectionTitle, { color: meta.color }]}>Appointment Details</Text>
            <InfoRow icon="person-outline" label="Doctor" value={reminder.doctorName ? `Dr. ${reminder.doctorName}` : null} />
            <InfoRow icon="medkit-outline" label="Specialty" value={reminder.specialty} />
            <InfoRow icon="location-outline" label="Location" value={reminder.location} />
            <InfoRow icon="options-outline" label="Type" value={reminder.appointmentType} />
          </View>
        )}
        {reminder.reminderType === 'lab' && (
          <View style={[s.section, { backgroundColor: bg }]}>
            <Text style={[s.sectionTitle, { color: meta.color }]}>Lab Details</Text>
            <InfoRow icon="business-outline" label="Lab" value={reminder.labName} />
            <InfoRow icon="document-outline" label="Report Type" value={reminder.reportType} />
            <InfoRow icon="flask-outline" label="Test" value={reminder.testName} />
            <InfoRow icon="person-outline" label="Ordered By" value={reminder.orderedBy} />
          </View>
        )}

        {/* Notes */}
        {reminder.notes ? (
          <View style={[s.section, { backgroundColor: bg }]}>
            <Text style={[s.sectionTitle, { color: colors.primary }]}>Notes</Text>
            <Text style={{ color: textColor, fontSize: 14, lineHeight: 21 }}>{reminder.notes}</Text>
          </View>
        ) : null}
      </ScrollView>

      {/* Bottom action bar */}
      {!reminder.isCompleted && (
        <View style={[s.actionBar, { backgroundColor: bg, borderTopColor: isDark ? '#334155' : '#E2E8F0' }]}>
          <TouchableOpacity style={s.actionBtn} onPress={handleSnooze}>
            <Ionicons name="alarm-outline" size={22} color="#F59E0B" />
            <Text style={[s.actionLabel, { color: '#F59E0B' }]}>Snooze 15m</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleComplete} activeOpacity={0.85}>
            <LinearGradient colors={['#10B981', '#059669']} style={s.completeBtn}>
              <Ionicons name="checkmark-outline" size={22} color="#FFF" />
              <Text style={s.completeText}>
                {reminder.reminderType === 'medication' ? 'Taken ✓' : 'Complete'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={s.actionBtn} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={22} color="#EF4444" />
            <Text style={[s.actionLabel, { color: '#EF4444' }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headerCard: { borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6 },
  typeBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  typeText: { fontWeight: '600', fontSize: 13, marginLeft: 6 },
  title: { fontSize: 22, fontWeight: '700', marginTop: 12 },
  completedBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  section: { borderRadius: 14, padding: 16, marginBottom: 16, elevation: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4 },
  sectionTitle: { fontSize: 14, fontWeight: '700', marginBottom: 12 },
  infoRow: { flexDirection: 'row', marginBottom: 12 },
  infoLabel: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.3 },
  infoValue: { fontSize: 14, marginTop: 2 },
  actionBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    paddingVertical: 14, paddingHorizontal: 16, borderTopWidth: 1,
    elevation: 8,
  },
  actionBtn: { alignItems: 'center' },
  actionLabel: { fontSize: 11, fontWeight: '600', marginTop: 4 },
  completeBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 30 },
  completeText: { color: '#FFF', fontWeight: '700', fontSize: 15, marginLeft: 6 },
});

export default ReminderDetailsScreen;
