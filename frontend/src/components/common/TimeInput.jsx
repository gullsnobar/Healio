import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAppTheme } from '../../styles/ThemeContext';
import CustomTimePicker from './CustomTimePicker';

/**
 * TimeInput Component
 * A clean, modern time picker input field
 * On web: uses TextInput with HH:MM format
 * On native: uses native DateTimePicker
 */
const TimeInput = ({
  label,
  value,
  onChange,
  placeholder = 'Select Time',
  required = false,
  style,
}) => {
  const { colors, isDark } = useAppTheme();
  const [showPicker, setShowPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [webInputValue, setWebInputValue] = useState('');

  const parseTimeValue = (input) => {
    if (!input) return undefined;
    if (input instanceof Date) return input;
    if (typeof input === 'string' && /^[0-9]{2}:[0-9]{2}/.test(input)) {
      const parsed = new Date(`1970-01-01T${input}:00`);
      return Number.isNaN(parsed.getTime()) ? undefined : parsed;
    }
    const parsed = new Date(input);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  };

  const formatTime = (time) => {
    if (!time) return '';
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatTimeForISO = (time) => {
    if (!time) return '';
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const normalizedValue = parseTimeValue(value);
  const displayValue = normalizedValue ? formatTime(normalizedValue) : '';

  // Handle native picker changes (Android/iOS)
  const handleChange = (event, selectedTime) => {
    const eventType = event?.type;
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (eventType === 'dismissed') {
      return;
    }
    if (selectedTime) {
      onChange(selectedTime);
    }
  };

  // Web platform: return custom time picker trigger
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, style]}>
        {label && (
          <Text style={[styles.label, { color: isDark ? '#94A3B8' : '#475569' }]}>
            {label}{required && <Text style={{ color: colors.error }}> *</Text>}
          </Text>
        )}
        <TouchableOpacity
          onPress={() => setShowTimePicker(true)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#1E293B',
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: '#334155',
            paddingHorizontal: 16,
            height: 52,
          }}
        >
          <Text style={{ color: '#F8FAFC', fontSize: 15 }}>
            {value || 'Select time'}
          </Text>
          <Ionicons name="time-outline" size={20} color="#14B8A6" />
        </TouchableOpacity>
        <CustomTimePicker
          visible={showTimePicker}
          value={displayValue}
          onConfirm={(timeString) => {
            const match = timeString.match(/(\d+):(\d+)\s*(AM|PM)/i);
            if (match) {
              let hour = parseInt(match[1]);
              const minute = parseInt(match[2]);
              const ampm = match[3].toUpperCase();
              if (ampm === 'PM' && hour !== 12) hour += 12;
              if (ampm === 'AM' && hour === 12) hour = 0;
              const date = new Date();
              date.setHours(hour, minute, 0, 0);
              onChange(date);
            }
            setShowTimePicker(false);
          }}
          onCancel={() => setShowTimePicker(false)}
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
          name="time-outline"
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
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
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

export default TimeInput;