import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = '#4A90D9';

const MedicationReminder = ({ reminder, onTake, onSnooze, onDismiss }) => {
  const { medicationName, dosage, timing } = reminder || {};

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <TouchableOpacity style={styles.dismissBtn} onPress={() => onDismiss?.(reminder)}>
          <Ionicons name="close" size={22} color="#888" />
        </TouchableOpacity>

        <View style={styles.iconWrap}>
          <Ionicons name="notifications" size={32} color={PRIMARY} />
        </View>

        <Text style={styles.title}>Medication Reminder</Text>
        <Text style={styles.medName}>{medicationName}</Text>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Ionicons name="flask-outline" size={16} color="#888" />
            <Text style={styles.detailText}>{dosage}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={16} color="#888" />
            <Text style={styles.detailText}>{timing}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.takeBtn}
            onPress={() => onTake?.(reminder)}
            activeOpacity={0.7}
          >
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.takeBtnText}>Take Now</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.snoozeBtn}
            onPress={() => onSnooze?.(reminder)}
            activeOpacity={0.7}
          >
            <Ionicons name="alarm-outline" size={20} color={PRIMARY} />
            <Text style={styles.snoozeBtnText}>Snooze</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    zIndex: 999,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  dismissBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    padding: 4,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EBF2FB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
    marginBottom: 6,
  },
  medName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 16,
  },
  details: {
    gap: 8,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 15,
    color: '#555',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  takeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY,
    borderRadius: 12,
    paddingVertical: 14,
    gap: 6,
  },
  takeBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  snoozeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EBF2FB',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 6,
  },
  snoozeBtnText: {
    color: PRIMARY,
    fontSize: 15,
    fontWeight: '600',
  },
});

export default MedicationReminder;
