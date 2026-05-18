import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAppTheme } from '../../styles/ThemeContext';

/**
 * DateInput Component
 * A clean, modern date picker input field
 * On web: uses TextInput with date format placeholder
 * On native: uses native DateTimePicker
 */
const DateInput = ({
  label,
  value,
  onChange,
  placeholder = 'Select Date',
  required = false,
  minimumDate,
  maximumDate,
  style,
}) => {
  const { colors, isDark } = useAppTheme();
  const [showPicker, setShowPicker] = useState(false);
  const [webInputValue, setWebInputValue] = useState('');

  const parseDateValue = (input) => {
    if (!input) return undefined;
    if (input instanceof Date) return input;
    const parsed = new Date(input);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateForISO = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const inputBg = colors.cardAlt;
  const textColor = colors.text;
  const placeholderColor = colors.textSecondary;
  const borderColor = colors.border;
  const normalizedValue = parseDateValue(value);
  const displayValue = normalizedValue ? formatDate(normalizedValue) : '';

  // Handle native picker changes (Android/iOS)
  const handleChange = (event, selectedDate) => {
    const eventType = event?.type;
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (eventType === 'dismissed') {
      return;
    }
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  // Web platform: return custom date picker trigger
  if (Platform.OS === 'web') {
    const min = minimumDate ? formatDateForISO(minimumDate) : undefined;
    const max = maximumDate ? formatDateForISO(maximumDate) : undefined;
    const webValue = typeof value === 'string' ? value : (normalizedValue ? formatDateForISO(normalizedValue) : '');
    return (
      <View style={[styles.container, style]}>
        {label && (
          <Text style={[styles.label, { color: isDark ? '#94A3B8' : '#475569' }]}>
            {label}{required && <Text style={{ color: colors.error }}> *</Text>}
          </Text>
        )}
        <View
          style={[
            styles.input,
            {
              backgroundColor: inputBg,
              borderColor,
              borderWidth: 1.5,
              borderRadius: 12,
              height: 52,
              paddingVertical: 0,
            },
          ]}
        >
          <Ionicons
            name="calendar-outline"
            size={20}
            color={webValue ? colors.primary : colors.textTertiary}
            style={styles.icon}
          />
          <TextInput
            value={webValue}
            onChangeText={(t) => onChange(t)}
            placeholder={placeholder}
            placeholderTextColor={placeholderColor}
            style={[styles.text, { color: webValue ? textColor : placeholderColor }]}
            autoCapitalize="none"
            {...(min ? { min } : {})}
            {...(max ? { max } : {})}
            type="date"
          />
          <Ionicons name="chevron-down" size={16} color={colors.textTertiary} />
        </View>
      </View>
    );
  }

  // Native platforms: return TouchableOpacity with DateTimePicker
  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: isDark ? '#94A3B8' : '#475569' }]}>
          {label}{required && <Text style={{ color: colors.error }}> *</Text>}
        </Text>
      )}

      <TouchableOpacity
        style={[styles.input, {
          backgroundColor: inputBg,
          borderColor,
          borderWidth: 1.5,
          borderRadius: 12,
          height: 52,
        }]}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.7}
      >
        <Ionicons
          name="calendar-outline"
          size={20}
          color={displayValue ? colors.primary : colors.textTertiary}
          style={styles.icon}
        />
        <Text style={[styles.text, {
          color: displayValue ? textColor : placeholderColor
        }]}>
          {displayValue || placeholder}
        </Text>
        <Ionicons
          name="chevron-down"
          size={16}
          color={colors.textTertiary}
        />
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={normalizedValue || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          textColor={colors.text}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 48,
  },
  icon: {
    marginRight: 12,
  },
  text: {
    flex: 1,
    fontSize: 16,
  },
});

export default DateInput;
