import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Switch,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../styles/ThemeContext';
import DatePickerField from '../common/DatePickerField';
import Button from '../common/Button';

const { width: SCREEN_W } = Dimensions.get('window');
const IS_SMALL = SCREEN_W < 400;

const MED_TYPES = ['Capsule', 'Tablet', 'Drops', 'Syrup', 'Injection', 'Other'];
const DOSAGE_UNITS = ['mg', 'ml', 'tablets', 'capsules', 'drops', 'units'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/* Dropdown picker modal – defined outside to avoid stale closure issues */
const DropdownModal = ({ visible, onClose, items, onSelect, selected, cardBg, textColor, primaryColor }) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <TouchableOpacity style={s.modalOverlay} activeOpacity={1} onPress={onClose}>
      <View style={[s.modalCard, { backgroundColor: cardBg }]}>
        {items.map((item) => (
          <TouchableOpacity
            key={item}
            style={[s.modalItem, selected === item && { backgroundColor: 'rgba(20,184,166,0.12)' }]}
            onPress={() => { onSelect(item); onClose(); }}
          >
            <Text style={[s.modalItemText, { color: selected === item ? primaryColor : textColor }, selected === item && { fontWeight: '700' }]}>{item}</Text>
            {selected === item && <Ionicons name="checkmark" size={18} color={primaryColor} />}
          </TouchableOpacity>
        ))}
      </View>
    </TouchableOpacity>
  </Modal>
);

const AddMedicationForm = ({ onSubmit, initialData }) => {
  const { colors } = useAppTheme();
  const [form, setForm] = useState({
    name: initialData?.name || '',
    type: initialData?.type || 'Capsule',
    dosage: initialData?.dosage || '',
    dosageUnit: initialData?.dosageUnit || 'mg',
    amount: initialData?.amount || '',
    frequency: initialData?.frequency || 'Daily',
    times: initialData?.times ? initialData.times.map(t => typeof t === 'string' ? t : t.time) : ['08:00'],
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    selectedDays: initialData?.selectedDays || [0, 2, 4], // Mon, Wed, Fri
    alarmEnabled: initialData?.alarmEnabled ?? true,
    doctorName: initialData?.prescribedBy || initialData?.doctorName || '',
    notes: initialData?.instructions || initialData?.notes || '',
  });

  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [showUnitMenu, setShowUnitMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const toggleDay = (index) => {
    const next = form.selectedDays.includes(index)
      ? form.selectedDays.filter((d) => d !== index)
      : [...form.selectedDays, index];
    update('selectedDays', next);
  };

  const addTime = () => update('times', [...form.times, '12:00']);
  const removeTime = (index) => {
    if (form.times.length <= 1) return;
    update('times', form.times.filter((_, i) => i !== index));
  };
  const updateTime = (index, value) => {
    const next = [...form.times];
    next[index] = value;
    update('times', next);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return Alert.alert('Validation', 'Medication name is required');
    if (!form.dosage.trim()) return Alert.alert('Validation', 'Dosage is required');
    setLoading(true);
    try {
      await onSubmit?.({
        ...form,
        name: form.name.trim(),
        dosage: form.dosage.trim(),
        amount: form.amount.trim(),
        startDate: form.startDate.trim(),
        endDate: form.endDate.trim() || null,
        doctorName: form.doctorName.trim(),
        notes: form.notes.trim(),
      });
    } finally {
      setLoading(false);
    }
  };

  const disabled = loading || !form.name.trim() || !form.dosage.trim();

  return (
    <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      {/* Section: Medication Info */}
      <Text style={[s.sectionLabel, { color: colors.textTertiary }]}>Medication Info</Text>

      {/* Name */}
      <View style={[s.inputWrap, { backgroundColor: colors.cardAlt, borderColor: focusedField === 'name' ? colors.primary : colors.cardAlt }]}>
        <TextInput
          style={[s.input, { color: colors.text }]}
          placeholder="Medicine Name *"
          placeholderTextColor={colors.textTertiary}
          value={form.name}
          onChangeText={(v) => update('name', v)}
          onFocus={() => setFocusedField('name')}
          onBlur={() => setFocusedField(null)}
        />
      </View>

      {/* Type dropdown */}
      <TouchableOpacity style={[s.dropdownWrap, { backgroundColor: colors.cardAlt, borderColor: colors.cardAlt }]} onPress={() => setShowTypeMenu(true)} activeOpacity={0.8}>
        <Text style={form.type ? [s.dropdownValue, { color: colors.text }] : [s.dropdownPlaceholder, { color: colors.textTertiary }]}>{form.type || 'Type *'}</Text>
        <Ionicons name="chevron-down" size={18} color={colors.textTertiary} />
      </TouchableOpacity>
      <DropdownModal
        visible={showTypeMenu}
        onClose={() => setShowTypeMenu(false)}
        items={MED_TYPES}
        onSelect={(v) => update('type', v)}
        selected={form.type}
        cardBg={colors.card}
        textColor={colors.text}
        primaryColor={colors.primary}
      />

      {/* Dose + Unit */}
      <View style={s.rowGap}>
        <View style={[s.inputWrap, { flex: 1, backgroundColor: colors.cardAlt, borderColor: focusedField === 'dosage' ? colors.primary : colors.cardAlt }]}>
          <TextInput
            style={[s.input, { color: colors.text }]}
            placeholder="Dose *"
            placeholderTextColor={colors.textTertiary}
            keyboardType="numeric"
            value={form.dosage}
            onChangeText={(v) => update('dosage', v)}
            onFocus={() => setFocusedField('dosage')}
            onBlur={() => setFocusedField(null)}
          />
        </View>
        <TouchableOpacity style={[s.dropdownWrap, { flex: 0.6, backgroundColor: colors.cardAlt, borderColor: colors.cardAlt }]} onPress={() => setShowUnitMenu(true)}>
          <Text style={[s.dropdownValue, { color: colors.text }]}>{form.dosageUnit}</Text>
          <Ionicons name="chevron-down" size={16} color={colors.textTertiary} />
        </TouchableOpacity>
        <DropdownModal
          visible={showUnitMenu}
          onClose={() => setShowUnitMenu(false)}
          items={DOSAGE_UNITS}
          onSelect={(v) => update('dosageUnit', v)}
          selected={form.dosageUnit}
          cardBg={colors.card}
          textColor={colors.text}
          primaryColor={colors.primary}
        />
      </View>

      {/* Amount */}
      <View style={[s.inputWrap, { backgroundColor: colors.cardAlt, borderColor: focusedField === 'amount' ? colors.primary : colors.cardAlt }]}>
        <TextInput
          style={[s.input, { color: colors.text }]}
          placeholder="Amount (e.g. 1 pill)"
          placeholderTextColor={colors.textTertiary}
          value={form.amount}
          onChangeText={(v) => update('amount', v)}
          onFocus={() => setFocusedField('amount')}
          onBlur={() => setFocusedField(null)}
        />
      </View>

      {/* Section: Reminders */}
      <Text style={[s.sectionLabel, { marginTop: 8, color: colors.textTertiary }]}>Reminders</Text>

      {/* Start Date */}
      <DatePickerField
        value={form.startDate}
        onChange={(v) => update('startDate', v)}
        placeholder="Start Date"
      />

      {/* Day chips */}
      <View style={s.dayRow}>
        {DAYS.map((day, i) => (
          <TouchableOpacity
            key={day}
            style={[s.dayChip, form.selectedDays.includes(i) && { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}
            onPress={() => toggleDay(i)}
          >
            <Text style={[s.dayChipText, { color: colors.textSecondary }, form.selectedDays.includes(i) && { color: colors.primary }]}>{day}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Times */}
      {form.times.map((time, i) => (
        <View key={i} style={s.timeRow}>
          <View style={[s.inputWrap, { flex: 1, marginBottom: 0, backgroundColor: colors.cardAlt, borderColor: focusedField === `time${i}` ? colors.primary : colors.cardAlt }]}>
            <Ionicons name="time-outline" size={18} color={colors.textTertiary} style={{ marginRight: 8 }} />
            <TextInput
              style={[s.input, { color: colors.text }]}
              placeholder="HH:MM"
              placeholderTextColor={colors.textTertiary}
              value={time}
              onChangeText={(v) => updateTime(i, v)}
              onFocus={() => setFocusedField(`time${i}`)}
              onBlur={() => setFocusedField(null)}
            />
          </View>
          {form.times.length > 1 && (
            <TouchableOpacity onPress={() => removeTime(i)} style={s.removeTimeBtn}>
              <Ionicons name="close-circle" size={22} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>
      ))}
      <TouchableOpacity onPress={addTime} style={s.addTimeBtn}>
        <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
        <Text style={[s.addTimeText, { color: colors.primary }]}>Add Time</Text>
      </TouchableOpacity>

      {/* Alarm toggle */}
      <View style={[s.alarmRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View>
          <Text style={[s.alarmTitle, { color: colors.text }]}>Turn on Alarm</Text>
          <Text style={[s.alarmSub, { color: colors.textTertiary }]}>Get notified at scheduled times</Text>
        </View>
        <Switch
          value={form.alarmEnabled}
          onValueChange={(v) => update('alarmEnabled', v)}
          trackColor={{ false: colors.border, true: '#99F6E4' }}
          thumbColor={form.alarmEnabled ? colors.primary : colors.textTertiary}
        />
      </View>

      {/* Section: Additional (collapsed by default – always visible) */}
      <Text style={[s.sectionLabel, { marginTop: 8, color: colors.textTertiary }]}>Additional</Text>

      <View style={[s.inputWrap, { backgroundColor: colors.cardAlt, borderColor: focusedField === 'doctor' ? colors.primary : colors.cardAlt }]}>
        <TextInput
          style={[s.input, { color: colors.text }]}
          placeholder="Doctor Name"
          placeholderTextColor={colors.textTertiary}
          value={form.doctorName}
          onChangeText={(v) => update('doctorName', v)}
          onFocus={() => setFocusedField('doctor')}
          onBlur={() => setFocusedField(null)}
        />
      </View>

      <View style={[s.inputWrap, { minHeight: 80, alignItems: 'flex-start', backgroundColor: colors.cardAlt, borderColor: focusedField === 'notes' ? colors.primary : colors.cardAlt }]}>
        <TextInput
          style={[s.input, { textAlignVertical: 'top', paddingTop: 14, color: colors.text }]}
          placeholder="Notes"
          placeholderTextColor={colors.textTertiary}
          multiline
          numberOfLines={3}
          value={form.notes}
          onChangeText={(v) => update('notes', v)}
          onFocus={() => setFocusedField('notes')}
          onBlur={() => setFocusedField(null)}
        />
      </View>

      {/* Save button */}
      <Button
        variant={disabled ? 'outline' : 'primary'}
        size="large"
        icon="checkmark-circle-outline"
        onPress={handleSubmit}
        loading={loading}
        disabled={disabled}
        colors={colors}
        style={{ marginTop: 16 }}
      >
        {initialData ? 'Update Medicine' : 'Save Medicine'}
      </Button>
      <Text style={[s.buttonDesc, { color: colors.textTertiary }]}>
        {initialData ? 'Update your medication details and schedule' : 'Add this medicine to your daily routine'}
      </Text>
    </ScrollView>
  );
};

const s = StyleSheet.create({
  container: { padding: IS_SMALL ? 16 : 24, paddingBottom: 48 },
  sectionLabel: {
    fontSize: IS_SMALL ? 13 : 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: IS_SMALL ? 12 : 16,
    marginBottom: 14,
    borderWidth: 1.5,
    height: IS_SMALL ? 52 : 56,
  },
  input: {
    flex: 1,
    fontSize: IS_SMALL ? 14 : 15,
    letterSpacing: 0.2,
    height: '100%',
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
  },
  dropdownWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    paddingHorizontal: IS_SMALL ? 12 : 16,
    height: IS_SMALL ? 52 : 56,
    marginBottom: 14,
    borderWidth: 1.5,
  },
  dropdownValue: { fontSize: IS_SMALL ? 14 : 15, fontWeight: '500' },
  dropdownPlaceholder: { fontSize: IS_SMALL ? 14 : 15 },
  rowGap: { flexDirection: 'row', gap: IS_SMALL ? 8 : 10 },
  dayRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: IS_SMALL ? 6 : 8,
    marginBottom: 16,
  },
  dayChip: {
    paddingHorizontal: IS_SMALL ? 12 : 14,
    paddingVertical: IS_SMALL ? 8 : 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  dayChipText: { fontSize: IS_SMALL ? 12 : 13, fontWeight: '600' },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: IS_SMALL ? 6 : 8,
    marginBottom: 10,
  },
  removeTimeBtn: { padding: 4 },
  addTimeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  addTimeText: { fontSize: IS_SMALL ? 13 : 14, fontWeight: '600' },
  alarmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    padding: IS_SMALL ? 14 : 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  alarmTitle: { fontSize: IS_SMALL ? 14 : 15, fontWeight: '700' },
  alarmSub: { fontSize: 12, marginTop: 2 },
  buttonDesc: { fontSize: IS_SMALL ? 12 : 13, textAlign: 'center', marginTop: 8, marginBottom: 16 },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 40,
  },
  modalCard: {
    borderRadius: 16,
    paddingVertical: 8,
    maxHeight: 400,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  modalItemActive: { backgroundColor: 'rgba(20,184,166,0.08)' },
  modalItemText: { fontSize: 16 },
});

export default AddMedicationForm;
