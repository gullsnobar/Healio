import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform, Alert, ActivityIndicator, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';
import Button from '../common/Button';
import Dropdown from '../common/Dropdown';
import CustomDatePicker from '../common/CustomDatePicker';

const { width: SCREEN_W } = Dimensions.get('window');
const IS_SMALL = SCREEN_W < 400;

const REPEAT_OPTIONS = ['none', 'daily', 'weekly', 'monthly'];
const FREQUENCY_OPTIONS = ['Once daily', 'Twice daily', 'Three times daily', 'Every 8 hours', 'As needed'];
const APPOINTMENT_TYPES = [
  { label: 'In-person', value: 'in_person' },
  { label: 'Video (Telehealth)', value: 'video' },
  { label: 'Phone', value: 'phone' },
];
const REPORT_TYPES = ['Blood Test', 'Urine Test', 'Imaging', 'Biopsy', 'Other'];

const ReminderForm = ({ initialValues = {}, reminderType = 'medication', onSubmit, loading }) => {
  const { colors, isDark } = useAppTheme();

  const [title, setTitle] = useState(initialValues.title || '');
  const [date, setDate] = useState(initialValues.date ? new Date(initialValues.date) : new Date());
  const [dateValue, setDateValue] = useState(initialValues.date ? initialValues.date.split('T')[0] : '');
  const [time, setTime] = useState(initialValues.time || '09:00');
  const [notes, setNotes] = useState(initialValues.notes || '');
  const [repeat, setRepeat] = useState(initialValues.repeat || 'none');

  // Medication-specific
  const [medicationName, setMedicationName] = useState(initialValues.medicationName || '');
  const [dosage, setDosage] = useState(initialValues.dosage || '');
  const [dosageUnit, setDosageUnit] = useState(initialValues.dosageUnit || 'mg');
  const [frequency, setFrequency] = useState(initialValues.frequency || 'Once daily');
  const [instructions, setInstructions] = useState(initialValues.instructions || '');

  // Appointment-specific
  const [doctorName, setDoctorName] = useState(initialValues.doctorName || '');
  const [specialty, setSpecialty] = useState(initialValues.specialty || '');
  const [location, setLocation] = useState(initialValues.location || '');
  const [appointmentType, setAppointmentType] = useState(initialValues.appointmentType || 'in_person');

  // Lab-specific
  const [labName, setLabName] = useState(initialValues.labName || '');
  const [reportType, setReportType] = useState(initialValues.reportType || 'Blood Test');
  const [testName, setTestName] = useState(initialValues.testName || '');
  const [orderedBy, setOrderedBy] = useState(initialValues.orderedBy || '');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const normalizeTime = (value) => {
    if (!value) return '09:00';
    if (value instanceof Date) {
      const h = String(value.getHours()).padStart(2, '0');
      const m = String(value.getMinutes()).padStart(2, '0');
      return `${h}:${m}`;
    }
    if (typeof value === 'string') {
      const match = value.match(/^(\d{1,2}):(\d{2})/);
      if (match) {
        const h = match[1].padStart(2, '0');
        return `${h}:${match[2]}`;
      }
      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) {
        const h = String(parsed.getHours()).padStart(2, '0');
        const m = String(parsed.getMinutes()).padStart(2, '0');
        return `${h}:${m}`;
      }
      return value;
    }
    return String(value);
  };

  const handleSubmit = () => {
    if (!title.trim()) { Alert.alert('Validation', 'Title is required'); return; }
    const payload = {
      title: title.trim(),
      date: date.toISOString(),
      time: normalizeTime(time),
      notes: notes.trim(),
      repeat,
      reminderType,
    };
    if (reminderType === 'medication') {
      if (!medicationName.trim()) { Alert.alert('Validation', 'Medication name is required'); return; }
      Object.assign(payload, { medicationName: medicationName.trim(), dosage, dosageUnit, frequency, instructions: instructions.trim() });
    }
    if (reminderType === 'appointment') {
      if (!doctorName.trim()) { Alert.alert('Validation', 'Doctor name is required'); return; }
      Object.assign(payload, {
        doctorName: doctorName.trim(),
        specialty: specialty.trim(),
        location: location.trim(),
        appointmentType,
      });
    }
    if (reminderType === 'lab') {
      Object.assign(payload, { labName: labName.trim(), reportType, testName: testName.trim(), orderedBy: orderedBy.trim() });
    }
    onSubmit(payload);
  };

  const bg = colors.card;
  const inputBg = colors.cardAlt;
  const textColor = colors.text;
  const placeholderColor = colors.textSecondary;

  const InputField = ({ label, value, onChangeText, placeholder, multiline, ...rest }) => (
    <View style={s.fieldGroup}>
      <Text style={[s.fieldLabel, { color: colors.textSecondary }]}>{label}</Text>
      <TextInput
        style={[s.input, { backgroundColor: inputBg, color: textColor, borderColor: colors.border }, multiline && { minHeight: 80, textAlignVertical: 'top' }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        multiline={multiline}
        {...rest}
      />
    </View>
  );

  const ChipSelect = ({ label, options, value, onChange }) => (
    <View style={s.fieldGroup}>
      <Text style={[s.fieldLabel, { color: isDark ? '#94A3B8' : '#475569' }]}>{label}</Text>
      <View style={s.chipRow}>
        {options.map((opt) => {
          const active = value === opt;
          return (
            <TouchableOpacity
              key={opt}
              style={[s.chip, active ? { backgroundColor: colors.primary + '22', borderColor: colors.primary } : { backgroundColor: inputBg, borderColor: 'transparent' }]}
              onPress={() => onChange(opt)}
            >
              <Text style={[s.chipText, { color: active ? colors.primary : textColor }]}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <ScrollView
      style={[s.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ padding: 16, paddingBottom: 92 }}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="none"
    >
      {/* Common fields */}
      <View style={[s.section, { backgroundColor: bg }]}
      >
        <Text style={[s.sectionTitle, { color: colors.primary }]}>Basic Info</Text>
        <InputField label="Title" value={title} onChangeText={setTitle} placeholder="e.g. Morning medication" autoFocus />

        {/* Date */}
        <View style={s.fieldGroup}>
          <Text style={[s.fieldLabel, { color: colors.textSecondary }]}>Date</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderRadius: 12,
              borderWidth: 1.5,
              borderColor: colors.border,
              backgroundColor: inputBg,
              paddingHorizontal: 16,
              height: 52,
            }}
          >
      <Text style={{ color: textColor, fontSize: 15 }}>
              {dateValue || 'Select date'}
            </Text>
            <Ionicons name="calendar-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <CustomDatePicker
          visible={showDatePicker}
          value={dateValue}
          onConfirm={(date) => {
            setDateValue(date);
            setDate(new Date(date + 'T00:00:00'));
            setShowDatePicker(false);
          }}
          onCancel={() => setShowDatePicker(false)}
        />

        {/* Time */}
        <Dropdown
          label="Time"
          value={time}
          placeholder="Select time"
          mode="time"
          onChange={setTime}
          required
        />

        <Dropdown
          label="Repeat"
          value={repeat}
          options={REPEAT_OPTIONS}
          placeholder="Select repeat frequency"
          onSelect={setRepeat}
        />
        <InputField label="Notes" value={notes} onChangeText={setNotes} placeholder="Optional notes…" multiline />
      </View>

      {/* Medication-specific */}
      {reminderType === 'medication' && (
        <View style={[s.section, { backgroundColor: bg }]}>
          <Text style={[s.sectionTitle, { color: colors.primary }]}>
            <Ionicons name="medical-outline" size={16} /> Medication Details
          </Text>
          <InputField label="Medication Name *" value={medicationName} onChangeText={setMedicationName} placeholder="e.g. Metformin" />
          <View style={s.row}>
            <View style={[s.rowItem, { flex: 1, marginRight: IS_SMALL ? 0 : 8 }]}> 
              <InputField label="Dosage" value={dosage} onChangeText={setDosage} placeholder="500" keyboardType="numeric" />
            </View>
            <View style={[s.rowItem, { flex: IS_SMALL ? 1 : 0.4, marginTop: IS_SMALL ? 10 : 0 }]}> 
              <Dropdown
                label="Unit"
                value={dosageUnit}
                options={['mg', 'ml', 'g', 'IU']}
                placeholder="Unit"
                onSelect={setDosageUnit}
              />
            </View>
          </View>
          <Dropdown
            label="Frequency"
            value={frequency}
            options={FREQUENCY_OPTIONS}
            placeholder="Select frequency"
            onSelect={setFrequency}
          />
          <InputField label="Instructions" value={instructions} onChangeText={setInstructions} placeholder="Take with food…" multiline />
        </View>
      )}

      {/* Appointment-specific */}
      {reminderType === 'appointment' && (
        <View style={[s.section, { backgroundColor: bg }]}>
          <Text style={[s.sectionTitle, { color: colors.primary }]}>
            <Ionicons name="calendar-outline" size={16} /> Appointment Details
          </Text>
          <InputField label="Doctor Name *" value={doctorName} onChangeText={setDoctorName} placeholder="e.g. Dr. Smith" />
          <InputField label="Specialty" value={specialty} onChangeText={setSpecialty} placeholder="e.g. Cardiology" />
          <InputField label="Location" value={location} onChangeText={setLocation} placeholder="e.g. City Hospital" />
          <Dropdown
            label="Appointment Type"
            value={appointmentType}
            options={APPOINTMENT_TYPES}
            placeholder="Select type"
            onSelect={setAppointmentType}
          />
        </View>
      )}

      {/* Lab-specific */}
      {reminderType === 'lab' && (
        <View style={[s.section, { backgroundColor: bg }]}>
          <Text style={[s.sectionTitle, { color: colors.primary }]}>
            <Ionicons name="flask-outline" size={16} /> Lab Report Details
          </Text>
          <InputField label="Lab Name" value={labName} onChangeText={setLabName} placeholder="e.g. HealthLab" />
          <Dropdown
            label="Report Type"
            value={reportType}
            options={REPORT_TYPES}
            placeholder="Select report type"
            onSelect={setReportType}
          />
          <InputField label="Test Name" value={testName} onChangeText={setTestName} placeholder="e.g. Complete Blood Count" />
          <InputField label="Ordered By" value={orderedBy} onChangeText={setOrderedBy} placeholder="Doctor who ordered" />
        </View>
      )}

      {/* Submit */}
      <View style={s.submitWrapper}>
        <Button
          variant="primary"
          size="large"
          onPress={handleSubmit}
          disabled={loading}
          loading={loading}
          icon="checkmark-circle-outline"
          colors={colors}
        >
          {loading ? 'Saving...' : 'Save Reminder'}
        </Button>
        <Text style={[s.buttonDesc, { color: colors.textSecondary }]}> 
          {reminderType === 'medication' ? 'Set up medication reminders to stay on track with your treatment' :
           reminderType === 'appointment' ? 'Schedule appointment reminders to never miss important visits' :
           'Create lab report reminders to track your health tests'}
        </Text>
      </View>
    </ScrollView>
  );
};

const s = StyleSheet.create({
  container: { flex: 1 },
  section: { borderRadius: 14, padding: IS_SMALL ? 12 : 16, marginBottom: 16, elevation: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4 },
  sectionTitle: { fontSize: IS_SMALL ? 14 : 15, fontWeight: '700', marginBottom: 14 },
  fieldGroup: { marginBottom: 14 },
  fieldLabel: { fontSize: IS_SMALL ? 12 : 13, fontWeight: '600', marginBottom: 6 },
  input: { borderRadius: 12, paddingHorizontal: 16, paddingVertical: IS_SMALL ? 12 : 14, fontSize: 15, minHeight: 52, borderColor: 'transparent', borderWidth: 1.5 },
  dateBtn: { flexDirection: 'row', alignItems: 'center', borderRadius: 10, paddingHorizontal: IS_SMALL ? 12 : 14, paddingVertical: IS_SMALL ? 12 : 14 },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start' },
  rowItem: { minWidth: 120, flexBasis: '48%' },
  dateBtnText: { fontSize: IS_SMALL ? 13 : 14, marginLeft: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: IS_SMALL ? 4 : 6 },
  chip: { paddingHorizontal: IS_SMALL ? 10 : 12, paddingVertical: IS_SMALL ? 6 : 7, borderRadius: 20, borderWidth: 1.5 },
  chipText: { fontSize: IS_SMALL ? 11 : 12, fontWeight: '500' },
  submitWrapper: { marginTop: 16, marginBottom: 32 },
  buttonDesc: { fontSize: IS_SMALL ? 11 : 12, textAlign: 'center', marginTop: 8, lineHeight: IS_SMALL ? 16 : 18 },
});

export default ReminderForm;
