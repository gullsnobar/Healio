import React, { useState, useMemo, useEffect } from 'react';
import {
  Modal, View, Text, TouchableOpacity, StyleSheet, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CustomDatePicker = ({ visible, value, onConfirm, onCancel }) => {
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value + 'T00:00:00') : new Date());
  const [displayMonth, setDisplayMonth] = useState(selectedDate.getMonth());
  const [displayYear, setDisplayYear] = useState(selectedDate.getFullYear());
  const [yearInput, setYearInput] = useState(displayYear.toString());

  useEffect(() => {
    setYearInput(displayYear.toString());
  }, [displayYear]);

  const handleYearChange = (text) => {
    setYearInput(text);
    const year = parseInt(text);
    if (text.length === 4 && year >= 2000 && year <= 2100) {
      setDisplayYear(year);
    }
  };

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  const firstDayOfMonth = new Date(displayYear, displayMonth, 1).getDay();

  const days = useMemo(() => {
    const arr = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      arr.push(null);
    }
    for (let i = 1; i <= daysInMonth(displayMonth, displayYear); i++) {
      arr.push(i);
    }
    // Always show 6 rows (42 cells total)
    while (arr.length < 42) {
      arr.push(null);
    }
    return arr;
  }, [displayMonth, displayYear]);

  const handleDateSelect = (day) => {
    setSelectedDate(new Date(displayYear, displayMonth, day));
  };

  const handleConfirm = () => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const date = String(selectedDate.getDate()).padStart(2, '0');
    onConfirm(`${year}-${month}-${date}`);
  };

  const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'short' });
  const monthName = selectedDate.toLocaleDateString('en-US', { month: 'long' });
  const dateNum = selectedDate.getDate();
  const yearNum = selectedDate.getFullYear();

  const monthYearDisplay = new Date(displayYear, displayMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={s.overlay}>
        <View style={s.container}>
          {/* Header */}
          <View style={s.header}>
            <Text style={s.dayName}>{dayName.toUpperCase()}</Text>
            <Text style={s.dateDisplay}>{dateNum}</Text>
            <Text style={s.monthYear}>{monthName} {yearNum}</Text>
          </View>

          {/* Month/Year Navigation */}
          <View style={s.monthNavigation}>
            <TouchableOpacity
              onPress={() => {
                if (displayMonth === 0) {
                  setDisplayMonth(11);
                  setDisplayYear(displayYear - 1);
                } else {
                  setDisplayMonth(displayMonth - 1);
                }
              }}
            >
              <Ionicons name="chevron-back" size={24} color="#0F766E" />
            </TouchableOpacity>
            <View style={s.monthYearContainer}>
              <Text style={s.monthYearText}>{monthYearDisplay.split(' ')[0]}</Text>
              <TextInput
                value={yearInput}
                onChangeText={handleYearChange}
                keyboardType="numeric"
                maxLength={4}
                style={s.yearInput}
                placeholder="Year"
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                if (displayMonth === 11) {
                  setDisplayMonth(0);
                  setDisplayYear(displayYear + 1);
                } else {
                  setDisplayMonth(displayMonth + 1);
                }
              }}
            >
              <Ionicons name="chevron-forward" size={24} color="#0F766E" />
            </TouchableOpacity>
          </View>

          {/* Weekday Headers */}
          <View style={s.weekdayRow}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <Text key={day} style={s.weekdayText}>{day}</Text>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={s.calendarGrid}>
            {days.map((day, index) => {
              const isSelected = day === selectedDate.getDate() && displayMonth === selectedDate.getMonth() && displayYear === selectedDate.getFullYear();
              return (
                <View
                  key={index}
                  style={[s.dayCell, isSelected && s.dayCellSelected]}
                >
                  {day ? (
                    <TouchableOpacity
                      onPress={() => handleDateSelect(day)}
                      style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Text style={[s.dayText, isSelected && s.dayTextSelected]}>{day}</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={{ width: '100%', height: '100%' }} />
                  )}
                </View>
              );
            })}
          </View>

          {/* Buttons */}
          <View style={s.buttonRow}>
            <TouchableOpacity style={s.button} onPress={onCancel}>
              <Text style={s.buttonText}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.button} onPress={handleConfirm}>
              <Text style={s.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '85%',
    maxWidth: 320,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#0F766E',
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  dayName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  dateDisplay: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: '700',
    marginTop: 4,
  },
  monthYear: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 4,
  },
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  monthYearText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  monthYearContainer: {
    alignItems: 'center',
  },
  yearInput: {
    color: '#1E293B',
    fontSize: 16,
    fontWeight: '700',
    borderBottomWidth: 1,
    borderBottomColor: '#14B8A6',
    minWidth: 50,
    textAlign: 'center',
    paddingVertical: 2,
  },
  weekdayRow: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    borderRadius: 6,
  },
  dayCellSelected: {
    backgroundColor: '#14B8A6',
  },
  dayText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1F2937',
  },
  dayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  buttonRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  buttonText: {
    color: '#0F766E',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default CustomDatePicker;
