import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useAppTheme } from '../../styles/ThemeContext';

const DietLogger = ({ onSubmit }) => {
  const { colors } = useAppTheme();
  const [meal, setMeal] = useState({ type: 'breakfast', name: '', calories: '', notes: '' });
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

  const handleSubmit = () => {
    if (meal.name && meal.calories) onSubmit?.(meal);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Log Meal</Text>
      <View style={styles.typeRow}>
        {mealTypes.map((t) => (
          <TouchableOpacity key={t} style={[styles.typeBtn, { borderColor: colors.primary }, meal.type === t && { backgroundColor: colors.primary }]} onPress={() => setMeal({ ...meal, type: t })}>
            <Text style={[styles.typeText, { color: colors.primary }, meal.type === t && styles.typeTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput style={[styles.input, { borderColor: colors.border, backgroundColor: colors.card, color: colors.text }]} placeholder="Meal name" placeholderTextColor={colors.textTertiary} value={meal.name} onChangeText={(v) => setMeal({ ...meal, name: v })} />
      <TextInput style={[styles.input, { borderColor: colors.border, backgroundColor: colors.card, color: colors.text }]} placeholder="Calories" placeholderTextColor={colors.textTertiary} value={meal.calories} onChangeText={(v) => setMeal({ ...meal, calories: v })} keyboardType="numeric" />
      <TextInput style={[styles.input, styles.textArea, { borderColor: colors.border, backgroundColor: colors.card, color: colors.text }]} placeholder="Notes (optional)" placeholderTextColor={colors.textTertiary} value={meal.notes} onChangeText={(v) => setMeal({ ...meal, notes: v })} multiline />
      <TouchableOpacity style={[styles.submitBtn, { backgroundColor: colors.primary }]} onPress={handleSubmit}>
        <Text style={styles.submitText}>Log Meal</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  typeBtn: { flex: 1, paddingVertical: 8, borderRadius: 20, borderWidth: 1, alignItems: 'center' },
  typeText: { fontWeight: '600', textTransform: 'capitalize' },
  typeTextActive: { color: '#FFF' },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 12 },
  textArea: { height: 80, textAlignVertical: 'top' },
  submitBtn: { padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  submitText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});

export default DietLogger;
