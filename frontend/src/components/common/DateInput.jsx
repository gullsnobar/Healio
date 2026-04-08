import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
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

  // Web platform: return HTML date input
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, style]}>
        {label && (
          <Text style={[styles.label, { color: isDark ? '#94A3B8' : '#475569' }]}>
            {label}{required && <Text style={{ color: colors.error }}> *</Text>}
          </Text>
        )}
        <input
          type="date"
          value={webInputValue || formatDateForISO(normalizedValue)}
          onChange={(e) => {
            setWebInputValue(e.target.value);
            if (e.target.value && /^\d{4}-\d{2}-\d{2}$/.test(e.target.value)) {
              const parsed = new Date(e.target.value + 'T00:00:00');
              if (!Number.isNaN(parsed.getTime())) {
                onChange(parsed);
              }
            }
          }}
          style={{
            width: '100%',
            height: 48,
            fontSize: 15,
            paddingLeft: 16,
            paddingRight: 16,
            borderWidth: 1,
            border: `1.5px solid ${isDark ? '#475569' : '#E2E8F0'}`,
            borderRadius: '12px',
            outline: 'none',
            fontFamily: 'inherit',
            cursor: 'pointer',
            backgroundColor: isDark ? '#334155' : '#F1F5F9',
            color: colors.text,
            marginBottom: 16,
            boxSizing: 'border-box',
          }}
        />
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
          backgroundColor: isDark ? '#334155' : '#F1F5F9',
          borderColor: colors.border
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
          color: displayValue ? colors.text : colors.textTertiary
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