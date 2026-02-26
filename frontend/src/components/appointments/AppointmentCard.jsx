import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Badge } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY_COLOR = '#4A90D9';

const STATUS_CONFIG = {
  upcoming: { label: 'Upcoming', color: PRIMARY_COLOR, icon: 'time-outline' },
  completed: { label: 'Completed', color: '#4CAF50', icon: 'checkmark-circle-outline' },
  cancelled: { label: 'Cancelled', color: '#F44336', icon: 'close-circle-outline' },
};

const AppointmentCard = ({ appointment, onPress }) => {
  const {
    doctorName,
    location,
    date,
    time,
    purpose,
    status = 'upcoming',
  } = appointment || {};

  const statusInfo = STATUS_CONFIG[status] || STATUS_CONFIG.upcoming;

  return (
    <TouchableOpacity onPress={() => onPress?.(appointment)} activeOpacity={0.7}>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <View style={styles.header}>
            <View style={styles.doctorInfo}>
              <Ionicons name="person-circle-outline" size={40} color={PRIMARY_COLOR} />
              <View style={styles.doctorText}>
                <Text style={styles.doctorName} numberOfLines={1}>
                  {doctorName}
                </Text>
                {location ? (
                  <View style={styles.locationRow}>
                    <Ionicons name="location-outline" size={14} color="#888" />
                    <Text style={styles.locationText} numberOfLines={1}>
                      {location}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + '1A' }]}>
              <Ionicons name={statusInfo.icon} size={14} color={statusInfo.color} />
              <Text style={[styles.statusText, { color: statusInfo.color }]}>
                {statusInfo.label}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.details}>
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.detailText}>{date}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.detailText}>{time}</Text>
            </View>
          </View>

          {purpose ? (
            <View style={styles.purposeRow}>
              <Ionicons name="document-text-outline" size={16} color="#666" />
              <Text style={styles.purposeText} numberOfLines={2}>
                {purpose}
              </Text>
            </View>
          ) : null}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: '#fff',
  },
  content: {
    paddingVertical: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  doctorText: {
    marginLeft: 10,
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: {
    fontSize: 13,
    color: '#888',
    marginLeft: 3,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  details: {
    flexDirection: 'row',
    gap: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#444',
    marginLeft: 6,
  },
  purposeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  purposeText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
    flex: 1,
  },
});

export default AppointmentCard;
