import React from 'react';
import { ScrollView, TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';

const CHIP_ICONS = [
  'bulb-outline',
  'heart-outline',
  'fitness-outline',
  'nutrition-outline',
  'medkit-outline',
  'help-circle-outline',
  'pulse-outline',
  'leaf-outline',
];

const ChatSuggestions = ({ suggestions = [], onSelect }) => {
  const { colors } = useAppTheme();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.c} contentContainerStyle={s.cc}>
      {suggestions.map((s2, i) => (
        <TouchableOpacity key={i} style={[s.chip, { backgroundColor: colors.primaryLight }]} onPress={() => onSelect(s2)}>
          <Ionicons name={CHIP_ICONS[i % CHIP_ICONS.length]} size={14} color={colors.primary} style={s.chipIcon} />
          <Text style={[s.text, { color: colors.primary }]}>{s2}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};
const s = StyleSheet.create({
  c: { maxHeight: 50, marginBottom: 4 },
  cc: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  chipIcon: { marginRight: 6 },
  text: { fontSize: 13, fontWeight: '500' },
});
export default ChatSuggestions;
