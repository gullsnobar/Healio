import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';
import CustomDatePicker from './CustomDatePicker';

/**
 * Web-only DatePickerField — renders a native browser <input type="date"> styled
 * to match the app design system. The browser shows its built-in calendar popup.
 */
const DatePickerField = ({ value, onChange, placeholder = 'Select Date', containerStyle }) => {
  const { colors, isDark } = useAppTheme();
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <View
      style={[{
        marginBottom: 14,
      }, containerStyle]}
    >
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        activeOpacity={0.7}
        style={{
          width: '100%',
          height: 52,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 16,
          paddingRight: 16,
          borderWidth: 1.5,
          borderColor: '#334155',
          borderRadius: 12,
          backgroundColor: '#F1F5F9',
          cursor: 'pointer',
          boxSizing: 'border-box',
        }}
      >
        <Text style={{ color: value ? '#1F2937' : '#94A3B8', fontSize: 15 }}>
          {value ? new Date(value + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : placeholder}
        </Text>
        <Ionicons name="calendar-outline" size={20} color="#14B8A6" />
      </TouchableOpacity>
      <CustomDatePicker
        visible={showDatePicker}
        value={value}
        onConfirm={(date) => { onChange(date); setShowDatePicker(false); }}
        onCancel={() => setShowDatePicker(false)}
      />
    </View>
  );
};

export default DatePickerField;
