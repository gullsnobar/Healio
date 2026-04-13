import React, { useState, useEffect, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_W } = Dimensions.get('window');
const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;
const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

const CustomTimePicker = ({ visible, value, onConfirm, onCancel }) => {
  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [selectedAmpm, setSelectedAmpm] = useState('AM');

  const hourScrollRef = useRef(null);
  const minuteScrollRef = useRef(null);

  useEffect(() => {
    if (visible && value) {
      const match = value.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (match) {
        let hour = parseInt(match[1]);
        const minute = match[2];
        const ampm = match[3].toUpperCase();
        if (ampm === 'PM' && hour !== 12) hour += 12;
        if (ampm === 'AM' && hour === 12) hour = 0;
        setSelectedHour(hour % 12 || 12);
        setSelectedMinute(minute);
        setSelectedAmpm(ampm);
      }
    }
  }, [visible, value]);

  const handleConfirm = () => {
    let hour = selectedHour;
    if (selectedAmpm === 'PM' && hour !== 12) hour += 12;
    if (selectedAmpm === 'AM' && hour === 12) hour = 0;
    const timeString = `${hour.toString().padStart(2, '0')}:${selectedMinute} ${selectedAmpm}`;
    console.log('time selected:', timeString);
    onConfirm(timeString);
  };

  const scrollToItem = (ref, index, total) => {
    const y = Math.max(0, (index - 2) * ITEM_HEIGHT);
    ref.current?.scrollTo({ y, animated: true });
  };

  const renderColumn = (items, selected, onSelect, ref, onScrollUp, onScrollDown) => (
    <View style={styles.column}>
      <TouchableOpacity onPress={onScrollUp} style={styles.arrow}>
        <Ionicons name="chevron-up" size={20} color="#0F766E" />
      </TouchableOpacity>
      <ScrollView
        ref={ref}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
      >
        {items.map((item, index) => (
          <TouchableOpacity
            key={item}
            onPress={() => onSelect(item)}
            style={styles.item}
          >
            <View style={[styles.itemCircle, selected === item && styles.selectedCircle]}>
              <Text style={[styles.itemText, selected === item && styles.selectedText]}>{item}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity onPress={onScrollDown} style={styles.arrow}>
        <Ionicons name="chevron-down" size={20} color="#0F766E" />
      </TouchableOpacity>
    </View>
  );

  const hourIndex = HOURS.indexOf(selectedHour);
  const minuteIndex = MINUTES.indexOf(selectedMinute);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.timeText}>
              {selectedHour}:{selectedMinute}
            </Text>
            <View style={styles.ampmContainer}>
              <TouchableOpacity
                onPress={() => setSelectedAmpm('AM')}
                style={[styles.ampmButton, selectedAmpm === 'AM' && styles.ampmActive]}
              >
                <Text style={[styles.ampmText, selectedAmpm === 'AM' && styles.ampmActiveText]}>AM</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSelectedAmpm('PM')}
                style={[styles.ampmButton, selectedAmpm === 'PM' && styles.ampmActive]}
              >
                <Text style={[styles.ampmText, selectedAmpm === 'PM' && styles.ampmActiveText]}>PM</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Body */}
          <View style={styles.body}>
            {renderColumn(
              HOURS,
              selectedHour,
              (h) => setSelectedHour(h),
              hourScrollRef,
              () => scrollToItem(hourScrollRef, Math.max(0, hourIndex - 1), HOURS.length),
              () => scrollToItem(hourScrollRef, Math.min(HOURS.length - 1, hourIndex + 1), HOURS.length)
            )}
            {renderColumn(
              MINUTES,
              selectedMinute,
              (m) => setSelectedMinute(m),
              minuteScrollRef,
              () => scrollToItem(minuteScrollRef, Math.max(0, minuteIndex - 1), MINUTES.length),
              () => scrollToItem(minuteScrollRef, Math.min(MINUTES.length - 1, minuteIndex + 1), MINUTES.length)
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={onCancel} style={styles.button}>
              <Text style={styles.buttonText}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleConfirm} style={styles.button}>
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#0F766E',
    height: 80,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '900',
  },
  ampmContainer: {
    flexDirection: 'row',
  },
  ampmButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  ampmActive: {
    backgroundColor: '#FFFFFF',
  },
  ampmText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  ampmActiveText: {
    color: '#0F766E',
  },
  body: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#F8FAFC',
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  arrow: {
    padding: 10,
  },
  scrollView: {
    height: CONTAINER_HEIGHT,
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCircle: {
    backgroundColor: '#0F766E',
  },
  itemText: {
    fontSize: 18,
    color: '#64748B',
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#F8FAFC',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonText: {
    color: '#0F766E',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default CustomTimePicker;