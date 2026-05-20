import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { TextInput } from 'react-native-paper';
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

const SUBMIT_LABEL_COLOR = '#FFFFFF';

const AddAppointmentForm = ({ onSubmit }) => {
  PropTypes.checkPropTypes(AddAppointmentForm.propTypes, { onSubmit }, 'prop', 'AddAppointmentForm');
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
  const [submitting, setSubmitting] = useState(false);

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

  // Paper theme overrides for TextInput to avoid passing backgroundColor via style
  const inputTheme = {
    colors: {
      background: colors.card,
      outline: colors.border,
      primary: colors.primary,
    },
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.form}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Doctor Information</Text>

        <TextInput
          label="Doctor Name *"
          value={doctorName}
          onChangeText={setDoctorName}
          mode="outlined"
          style={styles.input}
          theme={inputTheme}
          left={<TextInput.Icon icon="doctor" />}
        />

        <TextInput
          label="Specialty"
          value={specialty}
          onChangeText={setSpecialty}
          mode="outlined"
          style={styles.input}
          theme={inputTheme}
          left={<TextInput.Icon icon="medical-bag" />}
        />

        <TextInput
          label="Location *"
          value={location}
          onChangeText={setLocation}
          mode="outlined"
          style={styles.input}
          theme={inputTheme}
          left={<TextInput.Icon icon="map-marker" />}
        />

        <Text style={[styles.sectionTitleWithMargin, { color: colors.text }]}>Date & Time</Text>

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
            newTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));
            setTime(newTime);
          }}
          required
        />

        <Text style={[styles.sectionTitleWithMargin, { color: colors.text }]}>Details</Text>

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
            style={styles.input}
            theme={inputTheme}
          />
        )}

        <TextInput
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          mode="outlined"
          style={styles.input}
          theme={inputTheme}
          multiline
          numberOfLines={3}
          left={<TextInput.Icon icon="note-text" />}
        />

        <View
          style={[
            styles.reminderRow,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.reminderInfo}>
            <Ionicons name="notifications-outline" size={22} color={colors.primary} />
            <View style={styles.reminderText}>
              <Text style={[styles.reminderLabel, { color: colors.text }]}>Enable Reminder</Text>
              <Text style={[styles.reminderDesc, { color: colors.textTertiary }]}>
                Get notified before appointment
              </Text>
            </View>
          </View>
          <Switch
            value={enableReminder}
            onValueChange={setEnableReminder}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={enableReminder ? colors.primary : colors.textTertiary}
          />
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={submitting}
          style={[
            styles.submitButton,
            { backgroundColor: submitting ? colors.border : colors.primary },
          ]}
          activeOpacity={0.8}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitLabel}>Save Appointment</Text>
          )}
        </TouchableOpacity>
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
  input: {
    marginBottom: 12,
  },
  reminderDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  reminderInfo: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  reminderLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  reminderRow: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 8,
    padding: 14,
  },
  reminderText: {
    marginLeft: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  sectionTitleWithMargin: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 20,
  },
  submitButton: {
    alignItems: 'center',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
  },
  submitLabel: {
    color: SUBMIT_LABEL_COLOR,
    fontSize: 16,
    fontWeight: '700',
  },
});

AddAppointmentForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default AddAppointmentForm;