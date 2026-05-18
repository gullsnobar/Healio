import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';

/**
 * Web-only DatePickerField — renders a native browser <input type="date"> styled
 * to match the app design system. The browser shows its built-in calendar popup.
 */
const DatePickerField = ({ value, onChange, placeholder = 'Select Date', containerStyle }) => {
  const { colors, isDark } = useAppTheme();
  const inputBg = isDark ? '#334155' : '#F1F5F9';
  const borderColor = colors.border;
  const textColor = colors.text;
  const placeholderColor = colors.textTertiary;

  return (
    <View
      style={[{
        marginBottom: 14,
      }, containerStyle]}
    >
      <View
        style={{
          width: '100%',
          height: 52,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 16,
          paddingRight: 16,
          borderWidth: 1.5,
          borderColor,
          borderRadius: 12,
          backgroundColor: inputBg,
          boxSizing: 'border-box',
        }}
      >
        <Ionicons
          name="calendar-outline"
          size={20}
          color={value ? colors.primary : colors.textTertiary}
          style={{ marginRight: 10 }}
        />
        <TextInput
          value={value || ''}
          onChangeText={(t) => onChange(t)}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          style={{ flex: 1, height: '100%', fontSize: 15, color: value ? textColor : placeholderColor }}
          autoCapitalize="none"
          type="date"
        />
        <Ionicons name="chevron-down" size={16} color={colors.textTertiary} />
      </View>
    </View>
  );
};

export default DatePickerField;
