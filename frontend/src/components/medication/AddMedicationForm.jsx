import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Button, Menu } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = '#4A90D9';

const DOSAGE_UNITS = ['mg', 'ml', 'tablets', 'capsules', 'drops', 'units'];
const FREQUENCIES = ['Daily', 'Twice Daily', 'Weekly', 'Custom'];

const AddMedicationForm = ({ onSubmit, initialData }) => {
  const [form, setForm] = useState({
    name: initialData?.name || '',
    dosage: initialData?.dosage || '',
    dosageUnit: initialData?.dosageUnit || 'mg',
    frequency: initialData?.frequency || 'Daily',
    times: initialData?.times || ['08:00'],
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    doctorName: initialData?.doctorName || '',
    notes: initialData?.notes || '',
  });
  const [unitMenuVisible, setUnitMenuVisible] = useState(false);
  const [freqMenuVisible, setFreqMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const addTime = () => {
    update('times', [...form.times, '12:00']);
  };

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
    if (!form.name.trim()) {
      Alert.alert('Validation', 'Medication name is required');
      return;
    }
    if (!form.dosage.trim()) {
      Alert.alert('Validation', 'Dosage is required');
      return;
    }
    if (!form.startDate.trim()) {
      Alert.alert('Validation', 'Start date is required');
      return;
    }
    setLoading(true);
    try {
      await onSubmit?.({
        ...form,
        name: form.name.trim(),
        dosage: form.dosage.trim(),
        startDate: form.startDate.trim(),
        endDate: form.endDate.trim() || null,
        doctorName: form.doctorName.trim(),
        notes: form.notes.trim(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.sectionTitle}>Medication Info</Text>

      <Text style={styles.label}>Name *</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="e.g. Amoxicillin"
          placeholderTextColor="#aaa"
          value={form.name}
          onChangeText={(v) => update('name', v)}
        />
      </View>

      <Text style={styles.label}>Dosage *</Text>
      <View style={styles.dosageRow}>
        <View style={[styles.inputWrapper, { flex: 1 }]}>
          <TextInput
            style={styles.input}
            placeholder="e.g. 500"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={form.dosage}
            onChangeText={(v) => update('dosage', v)}
          />
        </View>
        <Menu
          visible={unitMenuVisible}
          onDismiss={() => setUnitMenuVisible(false)}
          anchor={
            <TouchableOpacity style={styles.dropdown} onPress={() => setUnitMenuVisible(true)}>
              <Text style={styles.dropdownText}>{form.dosageUnit}</Text>
              <Ionicons name="chevron-down" size={16} color="#555" />
            </TouchableOpacity>
          }
        >
          {DOSAGE_UNITS.map((unit) => (
            <Menu.Item
              key={unit}
              title={unit}
              onPress={() => {
                update('dosageUnit', unit);
                setUnitMenuVisible(false);
              }}
            />
          ))}
        </Menu>
      </View>

      <Text style={styles.label}>Frequency</Text>
      <Menu
        visible={freqMenuVisible}
        onDismiss={() => setFreqMenuVisible(false)}
        anchor={
          <TouchableOpacity style={styles.dropdownFull} onPress={() => setFreqMenuVisible(true)}>
            <Text style={styles.dropdownText}>{form.frequency}</Text>
            <Ionicons name="chevron-down" size={16} color="#555" />
          </TouchableOpacity>
        }
      >
        {FREQUENCIES.map((freq) => (
          <Menu.Item
            key={freq}
            title={freq}
            onPress={() => {
              update('frequency', freq);
              setFreqMenuVisible(false);
            }}
          />
        ))}
      </Menu>

      <Text style={styles.label}>Times</Text>
      {form.times.map((time, i) => (
        <View key={i} style={styles.timeRow}>
          <View style={[styles.inputWrapper, { flex: 1, marginBottom: 0 }]}>
            <Ionicons name="time-outline" size={18} color="#888" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.input}
              placeholder="HH:MM"
              placeholderTextColor="#aaa"
              value={time}
              onChangeText={(v) => updateTime(i, v)}
            />
          </View>
          {form.times.length > 1 && (
            <TouchableOpacity onPress={() => removeTime(i)} style={styles.removeTimeBtn}>
              <Ionicons name="close-circle" size={24} color="#e74c3c" />
            </TouchableOpacity>
          )}
        </View>
      ))}
      <TouchableOpacity onPress={addTime} style={styles.addTimeBtn}>
        <Ionicons name="add-circle-outline" size={20} color={PRIMARY} />
        <Text style={styles.addTimeText}>Add Time</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Schedule</Text>

      <Text style={styles.label}>Start Date *</Text>
      <View style={styles.inputWrapper}>
        <Ionicons name="calendar-outline" size={18} color="#888" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#aaa"
          value={form.startDate}
          onChangeText={(v) => update('startDate', v)}
        />
      </View>

      <Text style={styles.label}>End Date (optional)</Text>
      <View style={styles.inputWrapper}>
        <Ionicons name="calendar-outline" size={18} color="#888" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#aaa"
          value={form.endDate}
          onChangeText={(v) => update('endDate', v)}
        />
      </View>

      <Text style={styles.sectionTitle}>Additional</Text>

      <Text style={styles.label}>Doctor Name</Text>
      <View style={styles.inputWrapper}>
        <Ionicons name="person-outline" size={18} color="#888" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.input}
          placeholder="Prescribing doctor"
          placeholderTextColor="#aaa"
          value={form.doctorName}
          onChangeText={(v) => update('doctorName', v)}
        />
      </View>

      <Text style={styles.label}>Notes</Text>
      <View style={[styles.inputWrapper, { minHeight: 80, alignItems: 'flex-start' }]}>
        <TextInput
          style={[styles.input, { textAlignVertical: 'top', paddingTop: 12 }]}
          placeholder="Additional notes..."
          placeholderTextColor="#aaa"
          multiline
          numberOfLines={3}
          value={form.notes}
          onChangeText={(v) => update('notes', v)}
        />
      </View>

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
        style={styles.submitBtn}
        buttonColor={PRIMARY}
        textColor="#fff"
        contentStyle={styles.submitBtnContent}
      >
        {initialData ? 'Update Medication' : 'Add Medication'}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 48,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 20,
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 15,
    color: '#1a1a1a',
  },
  dosageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    gap: 6,
  },
  dropdownFull: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 14,
  },
  dropdownText: {
    fontSize: 15,
    color: '#1a1a1a',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  removeTimeBtn: {
    padding: 4,
  },
  addTimeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  addTimeText: {
    fontSize: 14,
    color: PRIMARY,
    fontWeight: '600',
  },
  submitBtn: {
    borderRadius: 12,
    marginTop: 24,
  },
  submitBtnContent: {
    height: 50,
  },
});

export default AddMedicationForm;
