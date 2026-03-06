import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform, Alert, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAppTheme } from '../../styles/ThemeContext';

const REPEAT_OPTIONS = ['none', 'daily', 'weekly', 'monthly'];
const FREQUENCY_OPTIONS = ['Once daily', 'Twice daily', 'Three times daily', 'Every 8 hours', 'As needed'];
const APPOINTMENT_TYPES = ['In-person', 'Telehealth', 'Phone', 'Follow-up'];
const REPORT_TYPES = ['Blood Test', 'Urine Test', 'Imaging', 'Biopsy', 'Other'];

const ReminderForm = ({ initialValues = {}, reminderType = 'medication', onSubmit, loading }) => {
  const { colors, isDark } = useAppTheme();

  const [title, setTitle] = useState(initialValues.title || '');
  const [date, setDate] = useState(initialValues.date ? new Date(initialValues.date) : new Date());
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
  const [appointmentType, setAppointmentType] = useState(initialValues.appointmentType || 'In-person');

  // Lab-specific
  const [labName, setLabName] = useState(initialValues.labName || '');
  const [reportType, setReportType] = useState(initialValues.reportType || 'Blood Test');
  const [testName, setTestName] = useState(initialValues.testName || '');
  const [orderedBy, setOrderedBy] = useState(initialValues.orderedBy || '');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSubmit = () => {
    if (!title.trim()) { Alert.alert('Validation', 'Title is required'); return; }
    const payload = {
      title: title.trim(),
      date: date.toISOString(),
      time,
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
      Object.assign(payload, { doctorName: doctorName.trim(), specialty: specialty.trim(), location: location.trim(), appointmentType });
    }
    if (reminderType === 'lab') {
      Object.assign(payload, { labName: labName.trim(), reportType, testName: testName.trim(), orderedBy: orderedBy.trim() });
    }
    onSubmit(payload);
  };

  const bg = isDark ? '#1E293B' : '#FFF';
  const inputBg = isDark ? '#334155' : '#F1F5F9';
  const textColor = isDark ? '#E2E8F0' : '#1F2937';
  const placeholderColor = isDark ? '#64748B' : '#94A3B8';

  const InputField = ({ label, value, onChangeText, placeholder, multiline, ...rest }) => (
    <View style={s.fieldGroup}>
      <Text style={[s.fieldLabel, { color: isDark ? '#94A3B8' : '#475569' }]}>{label}</Text>
      <TextInput
        style={[s.input, { backgroundColor: inputBg, color: textColor }, multiline && { minHeight: 80, textAlignVertical: 'top' }]}
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
    <ScrollView style={[s.container, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      {/* Common fields */}
      <View style={[s.section, { backgroundColor: bg }]}>
        <Text style={[s.sectionTitle, { color: colors.primary }]}>Basic Info</Text>
        <InputField label="Title" value={title} onChangeText={setTitle} placeholder="e.g. Morning medication" />

        {/* Date */}
        <View style={s.fieldGroup}>
          <Text style={[s.fieldLabel, { color: isDark ? '#94A3B8' : '#475569' }]}>Date</Text>
          <TouchableOpacity style={[s.dateBtn, { backgroundColor: inputBg }]} onPress={() => setShowDatePicker(true)}>
            <Ionicons name="calendar-outline" size={18} color={colors.primary} />
            <Text style={[s.dateBtnText, { color: textColor }]}>{date.toLocaleDateString()}</Text>
          </TouchableOpacity>
        </View>

        {/* Time */}
        <View style={s.fieldGroup}>
          <Text style={[s.fieldLabel, { color: isDark ? '#94A3B8' : '#475569' }]}>Time</Text>
          <TouchableOpacity style={[s.dateBtn, { backgroundColor: inputBg }]} onPress={() => setShowTimePicker(true)}>
            <Ionicons name="time-outline" size={18} color={colors.primary} />
            <Text style={[s.dateBtnText, { color: textColor }]}>{time}</Text>
          </TouchableOpacity>
        </View>

        <ChipSelect label="Repeat" options={REPEAT_OPTIONS} value={repeat} onChange={setRepeat} />
        <InputField label="Notes" value={notes} onChangeText={setNotes} placeholder="Optional notes…" multiline />
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(e, d) => { setShowDatePicker(false); if (d) setDate(d); }}
          minimumDate={new Date()}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          value={(() => { const [h, m] = time.split(':'); const d = new Date(); d.setHours(+h, +m); return d; })()}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(e, d) => {
            setShowTimePicker(false);
            if (d) setTime(`${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`);
          }}
        />
      )}

      {/* Medication-specific */}
      {reminderType === 'medication' && (
        <View style={[s.section, { backgroundColor: bg }]}>
          <Text style={[s.sectionTitle, { color: colors.primary }]}>
            <Ionicons name="medical-outline" size={16} /> Medication Details
          </Text>
          <InputField label="Medication Name *" value={medicationName} onChangeText={setMedicationName} placeholder="e.g. Metformin" />
          <View style={s.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <InputField label="Dosage" value={dosage} onChangeText={setDosage} placeholder="500" keyboardType="numeric" />
            </View>
            <View style={{ width: 100 }}>
              <ChipSelect label="Unit" options={['mg', 'ml', 'g', 'IU']} value={dosageUnit} onChange={setDosageUnit} />
            </View>
          </View>
          <ChipSelect label="Frequency" options={FREQUENCY_OPTIONS} value={frequency} onChange={setFrequency} />
          <InputField label="Instructions" value={instructions} onChangeText={setInstructions} placeholder="Take with food…" multiline />
        </View>
      )}

      {/* Appointment-specific */}
      {reminderType === 'appointment' && (
        <View style={[s.section, { backgroundColor: bg }]}>
          <Text style={[s.sectionTitle, { color: '#6366F1' }]}>
            <Ionicons name="calendar-outline" size={16} /> Appointment Details
          </Text>
          <InputField label="Doctor Name *" value={doctorName} onChangeText={setDoctorName} placeholder="e.g. Dr. Smith" />
          <InputField label="Specialty" value={specialty} onChangeText={setSpecialty} placeholder="e.g. Cardiology" />
          <InputField label="Location" value={location} onChangeText={setLocation} placeholder="e.g. City Hospital" />
          <ChipSelect label="Type" options={APPOINTMENT_TYPES} value={appointmentType} onChange={setAppointmentType} />
        </View>
      )}

      {/* Lab-specific */}
      {reminderType === 'lab' && (
        <View style={[s.section, { backgroundColor: bg }]}>
          <Text style={[s.sectionTitle, { color: '#F59E0B' }]}>
            <Ionicons name="flask-outline" size={16} /> Lab Report Details
          </Text>
          <InputField label="Lab Name" value={labName} onChangeText={setLabName} placeholder="e.g. HealthLab" />
          <ChipSelect label="Report Type" options={REPORT_TYPES} value={reportType} onChange={setReportType} />
          <InputField label="Test Name" value={testName} onChangeText={setTestName} placeholder="e.g. Complete Blood Count" />
          <InputField label="Ordered By" value={orderedBy} onChangeText={setOrderedBy} placeholder="Doctor who ordered" />
        </View>
      )}

      {/* Submit */}
      <TouchableOpacity style={[s.submitBtn, { opacity: loading ? 0.6 : 1 }]} onPress={handleSubmit} disabled={loading} activeOpacity={0.85}>
        <LinearGradient colors={[colors.primary, colors.primaryDark]} style={s.submitGrad}>
          {loading ? <ActivityIndicator color="#FFF" /> : (
            <>
              <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" />
              <Text style={s.submitText}>Save Reminder</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
};

const s = StyleSheet.create({
  container: { flex: 1 },
  section: { borderRadius: 14, padding: 16, marginBottom: 16, elevation: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4 },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 14 },
  fieldGroup: { marginBottom: 14 },
  fieldLabel: { fontSize: 12, fontWeight: '600', marginBottom: 6 },
  input: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14 },
  dateBtn: { flexDirection: 'row', alignItems: 'center', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12 },
  dateBtnText: { fontSize: 14, marginLeft: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5 },
  chipText: { fontSize: 12, fontWeight: '500' },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  submitBtn: { marginTop: 8 },
  submitGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 12 },
  submitText: { color: '#FFF', fontSize: 16, fontWeight: '700', marginLeft: 8 },
});

export default ReminderForm;
