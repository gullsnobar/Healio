import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useAppTheme } from '../../styles/ThemeContext';
import Button from '../common/Button';

const ManualFitnessEntry = ({ onSubmit }) => {
  const { colors } = useAppTheme();
  const [entry, setEntry] = useState({ type: 'steps', value: '', date: new Date().toISOString().split('T')[0], notes: '' });
  const entryTypes = ['steps', 'sleep', 'water', 'calories', 'weight'];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Manual Entry</Text>
      <View style={styles.typeRow}>
        {entryTypes.map((t) => (
          <TouchableOpacity key={t} style={[styles.typeBtn, { borderColor: colors.primary }, entry.type === t && { backgroundColor: colors.primary }]} onPress={() => setEntry({ ...entry, type: t })}>
            <Text style={[styles.typeText, { color: colors.primary }, entry.type === t && styles.activeText]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput style={[styles.input, { borderColor: colors.border, backgroundColor: colors.card, color: colors.text }]} placeholder={`Enter ${entry.type} value`} placeholderTextColor={colors.textTertiary} value={entry.value} onChangeText={(v) => setEntry({ ...entry, value: v })} keyboardType="numeric" />
      <TextInput style={[styles.input, { borderColor: colors.border, backgroundColor: colors.card, color: colors.text }]} placeholder="Date (YYYY-MM-DD)" placeholderTextColor={colors.textTertiary} value={entry.date} onChangeText={(v) => setEntry({ ...entry, date: v })} />
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
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  typeBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  typeText: { fontWeight: '600', textTransform: 'capitalize' },
  activeText: { color: '#FFF' },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 12 },
});

export default ManualFitnessEntry;
