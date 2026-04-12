import React, { useState, useMemo } from 'react';
import {
  Modal, View, Text, TouchableOpacity, TextInput,
} from 'react-native';

const CustomDatePicker = ({ visible, value, onConfirm, onCancel }) => {
  // Initialize state from value prop
  const initialDate = value ? new Date(value + 'T00:00:00') : new Date();
  const [selectedDay, setSelectedDay] = useState(initialDate.getDate());
  const [selectedMonth, setSelectedMonth] = useState(initialDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(initialDate.getFullYear());

  // Calculate calendar data
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();

  const calendarRows = useMemo(() => {
    const rows = [];
    let dayCounter = 1;

    for (let week = 0; week < 6; week++) {
      const row = [];
      for (let day = 0; day < 7; day++) {
        if (week === 0 && day < firstDayOfMonth) {
          row.push(null); // Empty cell before first day
        } else if (dayCounter <= daysInMonth) {
          row.push(dayCounter);
          dayCounter++;
        } else {
          row.push(null); // Empty cell after last day
        }
      }
      rows.push(row);
    }
    return rows;
  }, [selectedMonth, selectedYear, daysInMonth, firstDayOfMonth]);

  const prevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  // Display variables
  const dayName = new Date(selectedYear, selectedMonth, selectedDay).toLocaleDateString('en-US', { weekday: 'long' });
  const monthShort = new Date(selectedYear, selectedMonth).toLocaleDateString('en-US', { month: 'short' });
  const monthFull = new Date(selectedYear, selectedMonth).toLocaleDateString('en-US', { month: 'long' });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={{
        flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center', alignItems: 'center',
      }}>
        <View style={{
          width: 340, backgroundColor: '#FFFFFF',
          borderRadius: 16, overflow: 'hidden',
        }}>
          {/* TEAL HEADER */}
          <View style={{ backgroundColor: '#0F766E', padding: 20, alignItems: 'center' }}>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{dayName}</Text>
            <Text style={{ color: '#FFFFFF', fontSize: 42, fontWeight: '900' }}>{monthShort} {selectedDay}</Text>
            <TextInput
              value={String(selectedYear)}
              onChangeText={(v) => v.length === 4 && setSelectedYear(Number(v))}
              keyboardType="numeric"
              style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.5)', textAlign: 'center', minWidth: 60 }}
            />
          </View>

          {/* MONTH NAVIGATION */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 }}>
            <TouchableOpacity onPress={prevMonth}><Text style={{ fontSize: 22, color: '#0F766E' }}>‹</Text></TouchableOpacity>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E293B' }}>{monthFull} {selectedYear}</Text>
            <TouchableOpacity onPress={nextMonth}><Text style={{ fontSize: 22, color: '#0F766E' }}>›</Text></TouchableOpacity>
          </View>

          {/* DAY NAMES ROW */}
          <View style={{ flexDirection: 'row', paddingHorizontal: 8 }}>
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
              <Text key={d} style={{ flex: 1, textAlign: 'center', fontSize: 12, color: '#64748B', fontWeight: '600', paddingBottom: 8 }}>{d}</Text>
            ))}
          </View>

          {/* CALENDAR GRID — always 6 rows */}
          <View style={{ paddingHorizontal: 8, minHeight: 240 }}>
            {calendarRows.map((row, ri) => (
              <View key={ri} style={{ flexDirection: 'row' }}>
                {row.map((day, di) => (
                  <TouchableOpacity key={di} onPress={() => day && setSelectedDay(day)}
                    style={{ flex: 1, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                    {day ? (
                      <View style={{
                        width: 34, height: 34, borderRadius: 17,
                        backgroundColor: day === selectedDay ? '#14B8A6' : 'transparent',
                        alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Text style={{ color: day === selectedDay ? '#FFFFFF' : '#1E293B', fontSize: 14 }}>{day}</Text>
                      </View>
                    ) : <View style={{ width: 34, height: 34 }} />}
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>

          {/* CANCEL / OK BUTTONS */}
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 24, paddingHorizontal: 24, paddingVertical: 16, borderTopWidth: 1, borderTopColor: '#E2E8F0' }}>
            <TouchableOpacity onPress={onCancel}>
              <Text style={{ color: '#0F766E', fontWeight: '700', fontSize: 15 }}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              const month = String(selectedMonth + 1).padStart(2, '0');
              const day = String(selectedDay).padStart(2, '0');
              const dateStr = `${selectedYear}-${month}-${day}`;
              onConfirm(dateStr);
            }}>
              <Text style={{ color: '#0F766E', fontWeight: '700', fontSize: 15 }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
    const date = String(selectedDate.getDate()).padStart(2, '0');
    onConfirm(`${year}-${month}-${date}`);
  };

export default CustomDatePicker;
