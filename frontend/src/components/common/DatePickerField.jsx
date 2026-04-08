import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Modal, Platform, StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';

const pad = (n) => String(n).padStart(2, '0');
const toYMD = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const DatePickerField = ({ value, onChange, placeholder = 'Select Date', containerStyle }) => {
  const { colors, isDark } = useAppTheme();
  const [show, setShow] = useState(false);
  const [webInputValue, setWebInputValue] = useState(value || '');
  const parsedDate = value ? new Date(value + 'T00:00:00') : new Date();

  const handleChange = (event, selectedDate) => {
    if (Platform.OS === 'android') setShow(false);
    if (event.type === 'dismissed') { setShow(false); return; }
    if (selectedDate) onChange(toYMD(selectedDate));
  };

  // Web platform: return HTML date input
  if (Platform.OS === 'web') {
    return (
      <input
        type="date"
        value={webInputValue}
        onChange={(e) => {
          setWebInputValue(e.target.value);
          if (e.target.value && /^\d{4}-\d{2}-\d{2}$/.test(e.target.value)) {
            onChange(e.target.value);
          }
        }}
        style={{
          width: '100%',
          height: 56,
          fontSize: 15,
          paddingLeft: 16,
          paddingRight: 16,
          borderWidth: 1.5,
          border: `1.5px solid ${colors.cardAlt}`,
          borderRadius: '12px',
          outline: 'none',
          fontFamily: 'inherit',
          cursor: 'pointer',
          backgroundColor: colors.cardAlt,
          color: colors.text,
          marginBottom: 14,
          boxSizing: 'border-box',
          ...containerStyle,
        }}
      />
    );
  }

  // Native platforms
  return (
    <View>
      <TouchableOpacity
        style={[styles.wrap, { backgroundColor: colors.cardAlt, borderColor: colors.cardAlt }, containerStyle]}
        onPress={() => setShow(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="calendar-outline" size={18} color={colors.textTertiary} style={styles.icon} />
        <Text style={{ color: value ? colors.text : colors.textTertiary, fontSize: 15, flex: 1 }}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={16} color={colors.textTertiary} />
      </TouchableOpacity>

      {/* iOS: slide-up modal with spinner + Done button */}
      {Platform.OS === 'ios' && (
        <Modal visible={show} transparent animationType="slide">
          <View style={styles.iosOverlay}>
            <View style={[styles.iosModal, { backgroundColor: colors.card }]}>
              <View style={[styles.iosHeader, { borderBottomColor: colors.border }]}>
                <Text style={[styles.iosTitle, { color: colors.text }]}>Select Date</Text>
                <TouchableOpacity onPress={() => setShow(false)}>
                  <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '700' }}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={parsedDate}
                mode="date"
                display="spinner"
                onChange={handleChange}
                themeVariant={isDark ? 'dark' : 'light'}
                style={{ width: '100%' }}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Android: system date dialog */}
      {Platform.OS === 'android' && show && (
        <DateTimePicker
          value={parsedDate}
          mode="date"
          display="default"
          onChange={handleChange}
          themeVariant={isDark ? 'dark' : 'light'}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    height: 56,
  },
  icon: { marginRight: 8 },
  iosOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  iosModal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
  },
  iosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  iosTitle: { fontSize: 16, fontWeight: '600' },
});

export default DatePickerField;
