import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';

const DietLogger = ({ onSubmit }) => {
  const [meal, setMeal] = useState({ type: 'breakfast', name: '', calories: '', notes: '' });
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

  const handleSubmit = () => {
    if (meal.name && meal.calories) onSubmit?.(meal);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Log Meal</Text>
      <View style={styles.typeRow}>
        {mealTypes.map((t) => (
          <TouchableOpacity key={t} style={[styles.typeBtn, meal.type === t && styles.typeBtnActive]} onPress={() => setMeal({ ...meal, type: t })}>
            <Text style={[styles.typeText, meal.type === t && styles.typeTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput style={styles.input} placeholder="Meal name" value={meal.name} onChangeText={(v) => setMeal({ ...meal, name: v })} />
      <TextInput style={styles.input} placeholder="Calories" value={meal.calories} onChangeText={(v) => setMeal({ ...meal, calories: v })} keyboardType="numeric" />
      <TextInput style={[styles.input, styles.textArea]} placeholder="Notes (optional)" value={meal.notes} onChangeText={(v) => setMeal({ ...meal, notes: v })} multiline />
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>Log Meal</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#333', marginBottom: 16 },
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  typeBtn: { flex: 1, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#4A90D9', alignItems: 'center' },
  typeBtnActive: { backgroundColor: '#4A90D9' },
  typeText: { color: '#4A90D9', fontWeight: '600', textTransform: 'capitalize' },
  typeTextActive: { color: '#FFF' },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 12, backgroundColor: '#FFF' },
  textArea: { height: 80, textAlignVertical: 'top' },
  submitBtn: { backgroundColor: '#4A90D9', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  submitText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});

export default DietLogger;
