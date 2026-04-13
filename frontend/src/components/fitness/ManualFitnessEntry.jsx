import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useAppTheme } from '../../styles/ThemeContext';
import Button from '../common/Button';
import Dropdown from '../common/Dropdown';

const ManualFitnessEntry = ({ onSubmit }) => {
  const { colors } = useAppTheme();
  const [entry, setEntry] = useState({ type: 'steps', value: '', date: new Date().toISOString().split('T')[0], notes: '' });
  const entryTypes = ['steps', 'sleep', 'water', 'calories', 'weight'];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Manual Entry</Text>
      <Dropdown
        label="Entry Type"
        value={entry.type}
        options={entryTypes}
        placeholder="Select entry type"
        onSelect={(value) => setEntry({ ...entry, type: value })}
        required
      />

      <TextInput style={[styles.input, { borderColor: colors.border, backgroundColor: colors.card, color: colors.text }]} placeholder={`Enter ${entry.type} value`} placeholderTextColor={colors.textTertiary} value={entry.value} onChangeText={(v) => setEntry({ ...entry, value: v })} keyboardType="numeric" />

      <Dropdown
        label="Date"
        value={entry.date}
        placeholder="Select date"
        mode="date"
        onChange={(dateString) => setEntry({ ...entry, date: dateString })}
        required
      />
      <TextInput style={[styles.input, { height: 80, borderColor: colors.border, backgroundColor: colors.card, color: colors.text }]} placeholder="Notes" placeholderTextColor={colors.textTertiary} value={entry.notes} onChangeText={(v) => setEntry({ ...entry, notes: v })} multiline />
      <Button
        variant="primary"
        size="large"
        icon="checkmark-circle-outline"
        onPress={() => onSubmit?.(entry)}
        colors={colors}
      >
        Save Entry
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 12 },
});

export default ManualFitnessEntry;
