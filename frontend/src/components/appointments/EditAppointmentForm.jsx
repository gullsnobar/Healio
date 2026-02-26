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
import DateTimePicker from '@react-native-community/datetimepicker';

const PRIMARY_COLOR = '#4A90D9';

const PURPOSE_OPTIONS = [
  'General Checkup',
  'Follow-up',
  'Consultation',
  'Lab Work',
  'Vaccination',
  'Surgery',
  'Other',
];

const EditAppointmentForm = ({ initialData = {}, onSubmit, onDelete, onCancel }) => {
  const [doctorName, setDoctorName] = useState(initialData.doctorName || '');
  const [specialty, setSpecialty] = useState(initialData.specialty || '');
  const [location, setLocation] = useState(initialData.location || '');
  const [date, setDate] = useState(
    initialData.date ? new Date(initialData.date) : new Date()
  );
  const [time, setTime] = useState(
    initialData.time ? new Date(initialData.time) : new Date()
  );
  const [purpose, setPurpose] = useState(
    PURPOSE_OPTIONS.includes(initialData.purpose) ? initialData.purpose : initialData.purpose ? 'Other' : ''
  );
  const [customPurpose, setCustomPurpose] = useState(
    PURPOSE_OPTIONS.includes(initialData.purpose) ? '' : initialData.purpose || ''
  );
  const [notes, setNotes] = useState(initialData.notes || '');
  const [enableReminder, setEnableReminder] = useState(
    initialData.enableReminder ?? true
  );

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
        id: initialData.id,
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
      Alert.alert('Error', 'Failed to update appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Appointment',
      'Are you sure you want to delete this appointment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete?.(initialData.id),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Doctor Information</Text>

        <TextInput
          label="Doctor Name *"
          value={doctorName}
          onChangeText={setDoctorName}
          mode="outlined"
          style={styles.input}
          outlineColor="#ddd"
          activeOutlineColor={PRIMARY_COLOR}
          left={<TextInput.Icon icon="doctor" />}
        />

        <TextInput
          label="Specialty"
          value={specialty}
          onChangeText={setSpecialty}
          mode="outlined"
          style={styles.input}
          outlineColor="#ddd"
          activeOutlineColor={PRIMARY_COLOR}
          left={<TextInput.Icon icon="medical-bag" />}
        />

        <TextInput
          label="Location *"
          value={location}
          onChangeText={setLocation}
          mode="outlined"
          style={styles.input}
          outlineColor="#ddd"
          activeOutlineColor={PRIMARY_COLOR}
          left={<TextInput.Icon icon="map-marker" />}
        />

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Date & Time</Text>

        <TouchableOpacity style={styles.pickerButton} onPress={() => setShowDatePicker(true)}>
          <Ionicons name="calendar-outline" size={20} color={PRIMARY_COLOR} />
          <Text style={styles.pickerText}>{formatDate(date)}</Text>
          <Ionicons name="chevron-down" size={18} color="#888" />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}

        <TouchableOpacity style={styles.pickerButton} onPress={() => setShowTimePicker(true)}>
          <Ionicons name="time-outline" size={20} color={PRIMARY_COLOR} />
          <Text style={styles.pickerText}>{formatTime(time)}</Text>
          <Ionicons name="chevron-down" size={18} color="#888" />
        </TouchableOpacity>

        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleTimeChange}
          />
        )}

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Details</Text>

        <Menu
          visible={showPurposeMenu}
          onDismiss={() => setShowPurposeMenu(false)}
          anchor={
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowPurposeMenu(true)}
            >
              <Ionicons name="document-text-outline" size={20} color={PRIMARY_COLOR} />
              <Text style={[styles.pickerText, !purpose && { color: '#999' }]}>
                {purpose || 'Select Purpose *'}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#888" />
            </TouchableOpacity>
          }
        >
          {PURPOSE_OPTIONS.map((opt) => (
            <Menu.Item
              key={opt}
              title={opt}
              onPress={() => {
                setPurpose(opt);
                setShowPurposeMenu(false);
              }}
            />
          ))}
        </Menu>

        {purpose === 'Other' && (
          <TextInput
            label="Custom Purpose *"
            value={customPurpose}
            onChangeText={setCustomPurpose}
            mode="outlined"
            style={styles.input}
            outlineColor="#ddd"
            activeOutlineColor={PRIMARY_COLOR}
          />
        )}

        <TextInput
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          mode="outlined"
          style={styles.input}
          outlineColor="#ddd"
          activeOutlineColor={PRIMARY_COLOR}
          multiline
          numberOfLines={3}
          left={<TextInput.Icon icon="note-text" />}
        />

        <View style={styles.reminderRow}>
          <View style={styles.reminderInfo}>
            <Ionicons name="notifications-outline" size={22} color={PRIMARY_COLOR} />
            <View style={styles.reminderTextContainer}>
              <Text style={styles.reminderLabel}>Enable Reminder</Text>
              <Text style={styles.reminderDesc}>Get notified before appointment</Text>
            </View>
          </View>
          <Switch
            value={enableReminder}
            onValueChange={setEnableReminder}
            color={PRIMARY_COLOR}
          />
        </View>

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={submitting}
          disabled={submitting}
          style={styles.submitButton}
          buttonColor={PRIMARY_COLOR}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          Update Appointment
        </Button>

        <View style={styles.actionRow}>
          <Button
            mode="outlined"
            onPress={onCancel}
            style={[styles.actionButton, styles.cancelButton]}
            textColor="#666"
            contentStyle={styles.buttonContent}
          >
            Cancel
          </Button>
          <Button
            mode="outlined"
            onPress={handleDelete}
            style={[styles.actionButton, styles.deleteButton]}
            textColor="#F44336"
            contentStyle={styles.buttonContent}
          >
            Delete
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  form: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 14,
    marginBottom: 12,
  },
  pickerText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    marginLeft: 10,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    marginTop: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#eee',
  },
  reminderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reminderTextContainer: {
    marginLeft: 12,
  },
  reminderLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  reminderDesc: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  submitButton: {
    borderRadius: 8,
  },
  buttonContent: {
    height: 48,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
  },
  cancelButton: {
    borderColor: '#ccc',
  },
  deleteButton: {
    borderColor: '#F44336',
  },
});

export default EditAppointmentForm;
