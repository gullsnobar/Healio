import React, { useState } from 'react';
import {
  ScrollView, View, Text, StyleSheet, TextInput,
  TouchableOpacity, Alert, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { useAppTheme } from '../../styles/ThemeContext';
import { logExercise } from '../../redux/slices/fitnessSlice';

const EXERCISE_TYPES = [
  { key: 'walking', label: 'Walking', icon: 'walk', cal: 4 },
  { key: 'running', label: 'Running', icon: 'fitness', cal: 10 },
  { key: 'cycling', label: 'Cycling', icon: 'bicycle', cal: 8 },
  { key: 'swimming', label: 'Swimming', icon: 'water', cal: 9 },
  { key: 'yoga', label: 'Yoga', icon: 'body', cal: 3 },
  { key: 'gym', label: 'Weight Training', icon: 'barbell', cal: 6 },
  { key: 'stretching', label: 'Stretching', icon: 'accessibility', cal: 2 },
  { key: 'other', label: 'Other', icon: 'ellipsis-horizontal', cal: 5 },
];

const ExerciseLogScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { colors } = useAppTheme();
  const [selected, setSelected] = useState(null);
  const [duration, setDuration] = useState('');
  const [customCal, setCustomCal] = useState('');

  const estimated = selected
    ? customCal || Math.round((EXERCISE_TYPES.find((e) => e.key === selected)?.cal || 5) * Number(duration || 0))
    : 0;

  const handleSubmit = () => {
    if (!selected || !duration || Number(duration) <= 0) {
      Alert.alert('Missing Info', 'Select an exercise type and enter duration.');
      return;
    }
    dispatch(logExercise({
      type: selected,
      duration: Number(duration),
      calories: Number(customCal) || Number(estimated),
    })).then(() => {
      Alert.alert('Logged!', 'Exercise recorded successfully.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    });
  };

  return (
    <ScrollView style={[s.container, { backgroundColor: colors.background }]} contentContainerStyle={s.content}>
      <Text style={[s.sectionTitle, { color: colors.text }]}>Select Exercise</Text>
      <View style={s.typeGrid}>
        {EXERCISE_TYPES.map((ex) => (
          <TouchableOpacity
            key={ex.key}
            style={[
              s.typeCard, { backgroundColor: colors.card, borderColor: colors.border },
              selected === ex.key && { borderColor: colors.primary, backgroundColor: colors.primaryLight },
            ]}
            onPress={() => setSelected(ex.key)}
          >
            <Ionicons name={ex.icon} size={24} color={selected === ex.key ? colors.primary : colors.textSecondary} />
            <Text style={[s.typeLabel, { color: selected === ex.key ? colors.primary : colors.text }]}>{ex.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[s.sectionTitle, { color: colors.text }]}>Duration (minutes)</Text>
      <TextInput
        style={[s.input, { borderColor: colors.border, backgroundColor: colors.card, color: colors.text }]}
        placeholder="e.g. 30"
        placeholderTextColor={colors.textTertiary}
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
      />

      <Text style={[s.sectionTitle, { color: colors.text }]}>Calories Burned</Text>
      <TextInput
        style={[s.input, { borderColor: colors.border, backgroundColor: colors.card, color: colors.text }]}
        placeholder={`Estimated: ${estimated} kcal`}
        placeholderTextColor={colors.textTertiary}
        value={customCal}
        onChangeText={setCustomCal}
        keyboardType="numeric"
      />

      {duration > 0 && selected && (
        <View style={[s.previewCard, { backgroundColor: colors.card },
          Platform.select({
            ios: { shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
            android: { elevation: 3 },
          })]}>
          <Ionicons name="flame" size={28} color={colors.fitnessCal} />
          <View style={s.previewText}>
            <Text style={[s.previewVal, { color: colors.text }]}>{customCal || estimated} kcal</Text>
            <Text style={[s.previewSub, { color: colors.textSecondary }]}>
              {duration} min of {EXERCISE_TYPES.find((e) => e.key === selected)?.label}
            </Text>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[s.submitBtn, { backgroundColor: colors.primary }, (!selected || !duration) && { opacity: 0.5 }]}
        onPress={handleSubmit}
        disabled={!selected || !duration}
      >
        <Ionicons name="checkmark-circle" size={20} color="#FFF" />
        <Text style={s.submitText}>Log Exercise</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const s = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 10, marginTop: 16 },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  typeCard: { width: '22%', flexGrow: 1, alignItems: 'center', paddingVertical: 14, borderRadius: 14, borderWidth: 1.5 },
  typeLabel: { fontSize: 10, fontWeight: '600', marginTop: 4, textAlign: 'center' },
  input: { borderWidth: 1, borderRadius: 10, padding: 14, fontSize: 16, marginBottom: 4 },
  previewCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 14, marginTop: 16 },
  previewText: { flex: 1 },
  previewVal: { fontSize: 22, fontWeight: '800' },
  previewSub: { fontSize: 12, marginTop: 2 },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 12, gap: 8, marginTop: 24 },
  submitText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});

export default ExerciseLogScreen;
