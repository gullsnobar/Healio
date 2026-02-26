import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY_COLOR = '#4A90D9';

const TYPE_CONFIG = {
  blood: { label: 'Blood Test', icon: 'water', color: '#E53935' },
  xray: { label: 'X-Ray', icon: 'scan', color: '#8E24AA' },
  mri: { label: 'MRI', icon: 'body', color: '#3949AB' },
  ct: { label: 'CT Scan', icon: 'radio-button-on', color: '#00897B' },
  urine: { label: 'Urine Test', icon: 'flask', color: '#F9A825' },
  other: { label: 'Other', icon: 'document-text', color: '#757575' },
};

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: '#FF9800' },
  ready: { label: 'Ready', color: '#4CAF50' },
  reviewed: { label: 'Reviewed', color: PRIMARY_COLOR },
};

const LabReportCard = ({ report, onPress }) => {
  const { title, type = 'other', date, status = 'pending' } = report || {};

  const typeInfo = TYPE_CONFIG[type] || TYPE_CONFIG.other;
  const statusInfo = STATUS_CONFIG[status] || STATUS_CONFIG.pending;

  return (
    <TouchableOpacity onPress={() => onPress?.(report)} activeOpacity={0.7}>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <View style={[styles.typeIcon, { backgroundColor: typeInfo.color + '1A' }]}>
            <Ionicons name={typeInfo.icon} size={24} color={typeInfo.color} />
          </View>

          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.type}>{typeInfo.label}</Text>
            <View style={styles.dateRow}>
              <Ionicons name="calendar-outline" size={13} color="#999" />
              <Text style={styles.date}>{date}</Text>
            </View>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + '1A' }]}>
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.label}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 5,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: '#fff',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  type: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default LabReportCard;
