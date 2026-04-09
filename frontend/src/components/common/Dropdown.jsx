import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Modal, StyleSheet, Dimensions, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';
import DateInput from './DateInput';
import TimeInput from './TimeInput';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const IS_SMALL = SCREEN_W <= 480;
const IS_TABLET = SCREEN_W >= 768;

/**
 * Reusable Dropdown Component
 * Supports single/multiple selection, custom options, and date/time pickers
 */
const Dropdown = ({
  label,
  value,
  options = [],
  placeholder = 'Select...',
  onChange,
  onSelect,
  multiple = false,
  disabled = false,
  style,
  required = false,
  mode = 'text', // 'text', 'date', 'time'
  minDate,
  maxDate,
}) => {
  const { colors, isDark } = useAppTheme();
  const [visible, setVisible] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const callback = onChange || onSelect;

  // Handle date/time modes with dedicated components
  if (mode === 'date') {
    return (
      <DateInput
        label={label}
        value={value}
        onChange={callback}
        placeholder={placeholder}
        required={required}
        minimumDate={minDate}
        maximumDate={maxDate}
        style={style}
      />
    );
  }

  if (mode === 'time') {
    return (
      <TimeInput
        label={label}
        value={value}
        onChange={callback}
        placeholder={placeholder}
        required={required}
        style={style}
      />
    );
  }

  const bg = isDark ? '#334155' : '#F1F5F9';
  const textColor = isDark ? '#E2E8F0' : '#1F2937';
  const placeholderColor = isDark ? '#64748B' : '#94A3B8';

  const handleSelect = (option) => {
    if (!callback) return;

    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const isSelected = currentValues.includes(option);
      const newValues = isSelected
        ? currentValues.filter(v => v !== option)
        : [...currentValues, option];
      callback(newValues);
    } else {
      callback(option);
      setVisible(false);
    }
  };

  const renderValue = () => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return <Text style={[s.placeholder, { color: placeholderColor }]}>{placeholder}</Text>;
    }

    if (Array.isArray(value)) {
      return <Text style={[s.value, { color: textColor }]}>{value.join(', ')}</Text>;
    }

    return <Text style={[s.value, { color: textColor }]}>{value}</Text>;
  };

  const renderOptions = () => {
    // Regular text options
    return options.map((option) => {
      const isSelected = multiple
        ? (Array.isArray(value) && value.includes(option))
        : value === option;

      return (
        <TouchableOpacity
          key={option}
          style={[s.option, isSelected && { backgroundColor: colors.primary + '20' }]}
          onPress={() => handleSelect(option)}
        >
          <Text style={[s.optionText, { color: textColor }, isSelected && { color: colors.primary, fontWeight: '600' }]}>
            {option}
          </Text>
          {isSelected && <Ionicons name="checkmark" size={18} color={colors.primary} />}
        </TouchableOpacity>
      );
    });
  };

  return (
    <>
      <View style={[s.container, style]}>
        {label && (
          <Text style={[s.label, { color: isDark ? '#94A3B8' : '#475569' }]}>
            {label}{required && <Text style={{ color: colors.error }}> *</Text>}
          </Text>
        )}
        <TouchableOpacity
          style={[s.selector, { backgroundColor: bg, borderColor: colors.border }]}
          onPress={() => !disabled && setVisible(true)}
          disabled={disabled}
          activeOpacity={0.7}
        >
          {renderValue()}
          <Ionicons
            name={visible ? "chevron-up" : "chevron-down"}
            size={18}
            color={colors.textTertiary}
          />
        </TouchableOpacity>
      </View>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <TouchableOpacity
          style={s.overlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={[s.modal, { backgroundColor: colors.card, maxHeight: SCREEN_H * 0.6 }]}>
            <View style={[s.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[s.modalTitle, { color: colors.text }]}>{label || 'Select Option'}</Text>
              <TouchableOpacity onPress={() => setVisible(false)} style={s.closeBtn}>
                <Ionicons name="close" size={24} color={colors.textTertiary} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {renderOptions()}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const s = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: IS_SMALL ? 12 : 14, fontWeight: '600', marginBottom: 6 },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: IS_SMALL ? 16 : 18,
    paddingVertical: IS_SMALL ? 14 : 16,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 48,
    width: '100%',
  },
  placeholder: { fontSize: IS_SMALL ? 15 : 16, flex: 1 },
  value: { fontSize: IS_SMALL ? 15 : 16, flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: IS_SMALL ? 'flex-end' : 'center',
    alignItems: 'center',
    padding: IS_SMALL ? 12 : 20,
  },
  modal: {
    width: IS_SMALL ? SCREEN_W - 24 : Math.min(SCREEN_W - 80, 420),
    borderRadius: 14,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    marginHorizontal: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  closeBtn: { padding: 4 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: IS_SMALL ? 14 : 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  optionText: { fontSize: IS_SMALL ? 16 : 17 },
});

export default Dropdown;