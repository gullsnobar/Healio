import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';

/**
 * Web-only DatePickerField — renders a native browser <input type="date"> styled
 * to match the app design system. The browser shows its built-in calendar popup.
 */
const DatePickerField = ({ value, onChange, placeholder = 'Select Date', containerStyle }) => {
  const { colors, isDark } = useAppTheme();

  return (
    <View
      style={[{
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 14,
        borderWidth: 1.5,
        height: 56,
        backgroundColor: colors.cardAlt,
        borderColor: colors.cardAlt,
      }, containerStyle]}
    >
      <Ionicons name="calendar-outline" size={18} color={colors.textTertiary} style={{ marginRight: 8 }} />
      <input
        type="date"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          color: value ? colors.text : colors.textTertiary,
          fontSize: '15px',
          cursor: 'pointer',
          colorScheme: isDark ? 'dark' : 'light',
          width: '100%',
          fontFamily: 'inherit',
          height: '100%',
        }}
      />
    </View>
  );
};

export default DatePickerField;
