import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = '#4A90D9';

const STATUS_CONFIG = {
  taken: { label: 'Taken', bg: '#e8f5e9', color: '#27ae60', icon: 'checkmark-circle' },
  missed: { label: 'Missed', bg: '#fdecea', color: '#e74c3c', icon: 'close-circle' },
  pending: { label: 'Pending', bg: '#fff8e1', color: '#f39c12', icon: 'time' },
};

const MedicationCard = ({ medication, onPress, onMarkTaken }) => {
  const {
    name,
    dosage,
    frequency,
    timing,
    doctorName,
    status = 'pending',
  } = medication || {};

  const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(medication)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="medkit" size={22} color={PRIMARY} />
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: statusCfg.bg }]}>
          <Ionicons name={statusCfg.icon} size={14} color={statusCfg.color} />
          <Text style={[styles.badgeText, { color: statusCfg.color }]}>{statusCfg.label}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.infoRow}>
          <Ionicons name="flask-outline" size={16} color="#888" />
          <Text style={styles.infoText}>{dosage}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="repeat-outline" size={16} color="#888" />
          <Text style={styles.infoText}>{frequency}</Text>
        </View>
        {timing && (
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={16} color="#888" />
            <Text style={styles.infoText}>{timing}</Text>
          </View>
        )}
        {doctorName && (
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={16} color="#888" />
            <Text style={styles.infoText}>Dr. {doctorName}</Text>
          </View>
        )}
      </View>

      {status === 'pending' && onMarkTaken && (
        <TouchableOpacity
          style={styles.takeBtn}
          onPress={() => onMarkTaken?.(medication)}
          activeOpacity={0.7}
        >
          <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
          <Text style={styles.takeBtnText}>Mark as Taken</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  body: {
    gap: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
  },
  takeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY,
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 14,
    gap: 6,
  },
  takeBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default MedicationCard;
