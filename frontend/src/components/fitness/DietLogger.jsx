import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';
import Dropdown from '../common/Dropdown';

const MEAL_ICONS = { breakfast: 'sunny-outline', lunch: 'restaurant-outline', dinner: 'moon-outline', snack: 'cafe-outline' };

const DietLogger = ({ onSubmit }) => {
  const { colors, isDark } = useAppTheme();
  const [meal, setMeal] = useState({ type: 'breakfast', name: '', calories: '', notes: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const mealTypeOptions = [
    { label: 'Breakfast', value: 'breakfast', icon: 'sunny-outline' },
    { label: 'Lunch', value: 'lunch', icon: 'restaurant-outline' },
    { label: 'Dinner', value: 'dinner', icon: 'moon-outline' },
    { label: 'Snack', value: 'snack', icon: 'cafe-outline' },
  ];

  const validate = () => {
    const errs = {};
    if (!meal.name.trim()) errs.name = 'Meal name is required';
    if (!meal.calories.trim()) errs.calories = 'Calories is required';
    else if (isNaN(Number(meal.calories)) || Number(meal.calories) <= 0) errs.calories = 'Enter a valid calorie count';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit?.({
        type: meal.type,
        items: [{ name: meal.name.trim(), calories: Number(meal.calories) }],
        totalCalories: Number(meal.calories),
        notes: meal.notes.trim(),
      });
    } finally {
      setLoading(false);
    }
  };

  const update = (key, value) => {
    setMeal((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const inputBg = isDark ? colors.cardAlt : colors.card;
  const inputBorder = colors.inputBorder;

  return (
    <ScrollView style={[s.container, { backgroundColor: colors.background }]} keyboardShouldPersistTaps="handled">
      <Text style={[s.title, { color: colors.text }]}>Log Meal</Text>
      <Text style={[s.subtitle, { color: colors.textSecondary }]}>What did you eat today?</Text>

      {/* Meal type selector */}
      <View style={s.fieldWrap}>
        <Text style={[s.label, { color: colors.textSecondary }]}>Meal Type</Text>
        <Dropdown
          options={mealTypeOptions}
          value={meal.type}
          onChange={(value) => setMeal({ ...meal, type: value })}
          placeholder="Select meal type"
          required
        />
      </View>

      {/* Meal name */}
      <View style={s.fieldWrap}>
        <Text style={[s.label, { color: colors.textSecondary }]}>Meal Name</Text>
        <View style={[s.inputWrap, { borderColor: errors.name ? colors.error : inputBorder, backgroundColor: inputBg }]}>
          <Ionicons name="fast-food-outline" size={20} color={colors.textTertiary} style={s.inputIcon} />
          <TextInput
            style={[s.input, { color: colors.text }]}
            placeholder="e.g. Grilled Chicken Salad"
            placeholderTextColor={colors.textTertiary}
            value={meal.name}
            onChangeText={(v) => update('name', v)}
          />
        </View>
        {errors.name && <Text style={[s.errorText, { color: colors.error }]}>{errors.name}</Text>}
      </View>

      {/* Calories */}
      <View style={s.fieldWrap}>
        <Text style={[s.label, { color: colors.textSecondary }]}>Calories</Text>
        <View style={[s.inputWrap, { borderColor: errors.calories ? colors.error : inputBorder, backgroundColor: inputBg }]}>
          <Ionicons name="flame-outline" size={20} color={colors.textTertiary} style={s.inputIcon} />
          <TextInput
            style={[s.input, { color: colors.text }]}
            placeholder="e.g. 350"
            placeholderTextColor={colors.textTertiary}
            value={meal.calories}
            onChangeText={(v) => update('calories', v)}
            keyboardType="numeric"
          />
          <Text style={[s.unit, { color: colors.textTertiary }]}>kcal</Text>
        </View>
        {errors.calories && <Text style={[s.errorText, { color: colors.error }]}>{errors.calories}</Text>}
      </View>

      {/* Notes */}
      <View style={s.fieldWrap}>
        <Text style={[s.label, { color: colors.textSecondary }]}>Notes (optional)</Text>
        <View style={[s.inputWrap, s.textAreaWrap, { borderColor: inputBorder, backgroundColor: inputBg }]}>
          <TextInput
            style={[s.input, s.textArea, { color: colors.text }]}
            placeholder="Any additional notes..."
            placeholderTextColor={colors.textTertiary}
            value={meal.notes}
            onChangeText={(v) => update('notes', v)}
            multiline
          />
        </View>
      </View>

      {/* Submit button */}
      <TouchableOpacity
        style={[s.submitBtn, { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 }]}
        onPress={handleSubmit}
        disabled={loading}
        activeOpacity={0.85}
      >
        <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
        <Text style={s.submitText}>{loading ? 'Saving...' : 'Log Meal'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const s = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  subtitle: { fontSize: 14, marginBottom: 20 },
  fieldWrap: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6, marginLeft: 2 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
  },
  textAreaWrap: { height: 90, alignItems: 'flex-start', paddingVertical: 10 },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    fontSize: 15,
    height: '100%',
    backgroundColor: 'transparent',
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
  },
  textArea: { textAlignVertical: 'top' },
  unit: { fontSize: 14, fontWeight: '500', marginLeft: 8 },
  errorText: { fontSize: 12, fontWeight: '500', marginTop: 4, marginLeft: 2 },
  submitBtn: {
    flexDirection: 'row',
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#14B8A6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});

export default DietLogger;
