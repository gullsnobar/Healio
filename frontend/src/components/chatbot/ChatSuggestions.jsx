import React, { useMemo, useCallback } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
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
  
  // Memoize suggestion items to prevent unnecessary re-renders
  const suggestionItems = useMemo(() => 
    suggestions.map((text, index) => ({
      text,
      id: `chip_${index}_${text.substring(0, 10)}`, // Stable, unique key
      icon: CHIP_ICONS[index % CHIP_ICONS.length],
    })),
    [suggestions]
  );
  
  // Memoize the select handler
  const handleSelect = useCallback((text) => {
    onSelect(text);
  }, [onSelect]);

  if (suggestions.length === 0) return null;

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      style={s.c} 
      contentContainerStyle={s.cc}
      scrollEventThrottle={16}
    >
      {suggestionItems.map((item) => (
        <TouchableOpacity 
          key={item.id}
          style={[s.chip, { backgroundColor: colors.primaryLight }]} 
          onPress={() => handleSelect(item.text)}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={item.icon} 
            size={14} 
            color={colors.primary} 
            style={s.chipIcon} 
          />
          <Text style={[s.text, { color: colors.primary }]} numberOfLines={1}>
            {item.text}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const s = StyleSheet.create({
  c: { maxHeight: 50, marginBottom: 4 },
  cc: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  chip: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 14, 
    paddingVertical: 8, 
    borderRadius: 20 
  },
  chipIcon: { marginRight: 6 },
  text: { fontSize: 13, fontWeight: '500' },
});

export default React.memo(ChatSuggestions);
