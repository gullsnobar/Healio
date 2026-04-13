import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { TextInput, Switch, Menu, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';
import Dropdown from '../common/Dropdown';

const PURPOSE_OPTIONS = [
  'General Checkup',
  'Follow-up',
  'Consultation',
  'Lab Work',
  'Vaccination',
  'Surgery',
  'Other',
];

const AddAppointmentForm = ({ onSubmit }) => {
  const { colors } = useAppTheme();
  const [doctorName, setDoctorName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [purpose, setPurpose] = useState('');
  const [customPurpose, setCustomPurpose] = useState('');
  const [notes, setNotes] = useState('');
  const [enableReminder, setEnableReminder] = useState(true);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showPurposeMenu, setShowPurposeMenu] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const formatDate = (d) =>
    d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const formatTime = (t) =>
    t.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setDate(selectedDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) setTime(selectedTime);
  };

  const validate = () => {
    if (!doctorName.trim()) {
      Alert.alert('Validation Error', 'Please enter the doctor name.');
      return false;
    }
    if (!location.trim()) {
      Alert.alert('Validation Error', 'Please enter the location.');
      return false;
    }
    if (!purpose && !customPurpose.trim()) {
      Alert.alert('Validation Error', 'Please select or enter a purpose.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit?.({
        doctorName: doctorName.trim(),
        specialty: specialty.trim(),
        location: location.trim(),
        date: date.toISOString(),
        time: time.toISOString(),
        purpose: purpose === 'Other' ? customPurpose.trim() : purpose,
        notes: notes.trim(),
        enableReminder,
      });
    } catch {
      Alert.alert('Error', 'Failed to save appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={styles.form}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Doctor Information</Text>

        <TextInput
          label="Doctor Name *"
          value={doctorName}
          onChangeText={setDoctorName}
          mode="outlined"
          style={[styles.input, { backgroundColor: colors.card }]}
          outlineColor={colors.border}
          activeOutlineColor={colors.primary}
          left={<TextInput.Icon icon="doctor" />}
        />

        <TextInput
          label="Specialty"
          value={specialty}
          onChangeText={setSpecialty}
          mode="outlined"
          style={[styles.input, { backgroundColor: colors.card }]}
          outlineColor={colors.border}
          activeOutlineColor={colors.primary}
          left={<TextInput.Icon icon="medical-bag" />}
        />

        <TextInput
          label="Location *"
          value={location}
          onChangeText={setLocation}
          mode="outlined"
          style={[styles.input, { backgroundColor: colors.card }]}
          outlineColor={colors.border}
          activeOutlineColor={colors.primary}
          left={<TextInput.Icon icon="map-marker" />}
        />

        <Text style={[styles.sectionTitle, { marginTop: 20, color: colors.text }]}>Date & Time</Text>

        <Dropdown
          label="Date"
          value={date.toISOString().split('T')[0]}
          placeholder="Select date"
          mode="date"
          onChange={(dateString) => setDate(new Date(dateString + 'T00:00:00'))}
          required
        />

        <Dropdown
          label="Time"
          value={time.toTimeString().slice(0, 5)}
          placeholder="Select time"
          mode="time"
          onChange={(timeString) => {
            const [hours, minutes] = timeString.split(':');
            const newTime = new Date(time);
            newTime.setHours(parseInt(hours), parseInt(minutes));
            setTime(newTime);
          }}
          required
        />

        <Text style={[styles.sectionTitle, { marginTop: 20, color: colors.text }]}>Details</Text>

        <Dropdown
          label="Purpose"
          value={purpose}
          options={PURPOSE_OPTIONS}
          placeholder="Select purpose"
          onSelect={setPurpose}
          required
        />

        {purpose === 'Other' && (
          <TextInput
            label="Custom Purpose *"
            value={customPurpose}
            onChangeText={setCustomPurpose}
            mode="outlined"
            style={[styles.input, { backgroundColor: colors.card }]}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
          />
        )}

        <TextInput
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          mode="outlined"
          style={[styles.input, { backgroundColor: colors.card }]}
          outlineColor={colors.border}
          activeOutlineColor={colors.primary}
          multiline
          numberOfLines={3}
          left={<TextInput.Icon icon="note-text" />}
        />

        <View style={[styles.reminderRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.reminderInfo}>
            <Ionicons name="notifications-outline" size={22} color={colors.primary} />
            <View style={styles.reminderText}>
              <Text style={[styles.reminderLabel, { color: colors.text }]}>Enable Reminder</Text>
              <Text style={[styles.reminderDesc, { color: colors.textTertiary }]}>Get notified before appointment</Text>
            </View>
          </View>
          <Switch
            value={enableReminder}
            onValueChange={setEnableReminder}
            color={colors.primary}
          />
        </View>

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={submitting}
          disabled={submitting}
          style={styles.submitButton}
          buttonColor={colors.primary}
          contentStyle={styles.submitContent}
          labelStyle={styles.submitLabel}
        >
          Save Appointment
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    marginBottom: 12,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 6,
    padding: 14,
    marginBottom: 12,
  },
  pickerText: {
    flex: 1,
    fontSize: 15,
    marginLeft: 10,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    padding: 14,
    marginTop: 8,
    marginBottom: 24,
    borderWidth: 1,
  },
  reminderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reminderText: {
    marginLeft: 12,
  },
  reminderLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  reminderDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  submitButton: {
    borderRadius: 8,
  },
  submitContent: {
    height: 50,
  },
  submitLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
});

export default AddAppointmentForm;
