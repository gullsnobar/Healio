import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';

const ManualFitnessEntry = ({ onSubmit }) => {
  const [entry, setEntry] = useState({ type: 'steps', value: '', date: new Date().toISOString().split('T')[0], notes: '' });
  const entryTypes = ['steps', 'sleep', 'water', 'calories', 'weight'];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Manual Entry</Text>
      <View style={styles.typeRow}>
        {entryTypes.map((t) => (
          <TouchableOpacity key={t} style={[styles.typeBtn, entry.type === t && styles.active]} onPress={() => setEntry({ ...entry, type: t })}>
            <Text style={[styles.typeText, entry.type === t && styles.activeText]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput style={styles.input} placeholder={`Enter ${entry.type} value`} value={entry.value} onChangeText={(v) => setEntry({ ...entry, value: v })} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Date (YYYY-MM-DD)" value={entry.date} onChangeText={(v) => setEntry({ ...entry, date: v })} />
      <TextInput style={[styles.input, { height: 80 }]} placeholder="Notes" value={entry.notes} onChangeText={(v) => setEntry({ ...entry, notes: v })} multiline />
      <TouchableOpacity style={styles.submitBtn} onPress={() => onSubmit?.(entry)}>
        <Text style={styles.submitText}>Save Entry</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  typeBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#4A90D9' },
  active: { backgroundColor: '#4A90D9' },
  typeText: { color: '#4A90D9', fontWeight: '600', textTransform: 'capitalize' },
  activeText: { color: '#FFF' },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 12, backgroundColor: '#FFF' },
  submitBtn: { backgroundColor: '#4A90D9', padding: 14, borderRadius: 8, alignItems: 'center' },
  submitText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});

export default ManualFitnessEntry;
