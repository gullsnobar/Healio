import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { Card, Button, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY_COLOR = '#4A90D9';

const STATUS_CONFIG = {
  upcoming: { label: 'Upcoming', color: PRIMARY_COLOR, icon: 'time-outline' },
  completed: { label: 'Completed', color: '#4CAF50', icon: 'checkmark-circle-outline' },
  cancelled: { label: 'Cancelled', color: '#F44336', icon: 'close-circle-outline' },
};

const DetailRow = ({ icon, label, value, onPress, linkColor }) => (
  <TouchableOpacity
    style={styles.detailRow}
    onPress={onPress}
    disabled={!onPress}
    activeOpacity={onPress ? 0.6 : 1}
  >
    <Ionicons name={icon} size={20} color={PRIMARY_COLOR} style={styles.detailIcon} />
    <View style={styles.detailContent}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, linkColor && { color: linkColor, textDecorationLine: 'underline' }]}>
        {value}
      </Text>
    </View>
    {onPress && <Ionicons name="open-outline" size={16} color="#aaa" />}
  </TouchableOpacity>
);

const AppointmentDetails = ({ appointment, onEdit, onDelete, onCancel }) => {
  const {
    doctorName,
    specialty,
    location,
    date,
    time,
    purpose,
    notes,
    status = 'upcoming',
    enableReminder,
  } = appointment || {};

  const statusInfo = STATUS_CONFIG[status] || STATUS_CONFIG.upcoming;

  const openMaps = () => {
    if (!location) return;
    const encoded = encodeURIComponent(location);
    const url = Platform?.OS === 'ios'
      ? `maps:0,0?q=${encoded}`
      : `geo:0,0?q=${encoded}`;
    Linking.openURL(url).catch(() => {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encoded}`);
    });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Appointment',
      'Are you sure you want to delete this appointment?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes, Delete', style: 'destructive', onPress: () => onDelete?.(appointment) },
      ]
    );
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes, Cancel', style: 'destructive', onPress: () => onCancel?.(appointment) },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Status Banner */}
      <View style={[styles.statusBanner, { backgroundColor: statusInfo.color + '15' }]}>
        <Ionicons name={statusInfo.icon} size={20} color={statusInfo.color} />
        <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
      </View>

      {/* Doctor Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.doctorHeader}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={32} color="#fff" />
            </View>
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>{doctorName}</Text>
              {specialty ? <Text style={styles.specialty}>{specialty}</Text> : null}
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Details Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Appointment Details</Text>

          <DetailRow icon="calendar-outline" label="Date" value={date} />
          <Divider style={styles.divider} />
          <DetailRow icon="time-outline" label="Time" value={time} />
          <Divider style={styles.divider} />
          <DetailRow
            icon="location-outline"
            label="Location"
            value={location}
            onPress={openMaps}
            linkColor={PRIMARY_COLOR}
          />
          <Divider style={styles.divider} />
          <DetailRow icon="document-text-outline" label="Purpose" value={purpose} />

          {notes ? (
            <>
              <Divider style={styles.divider} />
              <DetailRow icon="create-outline" label="Notes" value={notes} />
            </>
          ) : null}
        </Card.Content>
      </Card>

      {/* Reminder Status */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.reminderRow}>
            <Ionicons
              name={enableReminder ? 'notifications' : 'notifications-off-outline'}
              size={22}
              color={enableReminder ? PRIMARY_COLOR : '#aaa'}
            />
            <View style={styles.reminderInfo}>
              <Text style={styles.reminderLabel}>Reminder</Text>
              <Text style={styles.reminderStatus}>
                {enableReminder ? 'Enabled - You will be notified' : 'Disabled'}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Actions */}
      {status === 'upcoming' && (
        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={() => onEdit?.(appointment)}
            style={styles.editButton}
            buttonColor={PRIMARY_COLOR}
            icon="pencil"
            contentStyle={styles.buttonContent}
          >
            Edit Appointment
          </Button>

          <View style={styles.actionRow}>
            <Button
              mode="outlined"
              onPress={handleCancel}
              style={[styles.secondaryButton, { borderColor: '#FF9800' }]}
              textColor="#FF9800"
              icon="close-circle-outline"
              contentStyle={styles.buttonContent}
            >
              Cancel
            </Button>
            <Button
              mode="outlined"
              onPress={handleDelete}
              style={[styles.secondaryButton, { borderColor: '#F44336' }]}
              textColor="#F44336"
              icon="delete-outline"
              contentStyle={styles.buttonContent}
            >
              Delete
            </Button>
          </View>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    elevation: 1,
    backgroundColor: '#fff',
  },
  doctorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doctorInfo: {
    marginLeft: 14,
    flex: 1,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  specialty: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailIcon: {
    width: 28,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  divider: {
    marginVertical: 4,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderInfo: {
    marginLeft: 12,
  },
  reminderLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  reminderStatus: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  actions: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  editButton: {
    borderRadius: 8,
  },
  buttonContent: {
    height: 46,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 8,
  },
});

export default AppointmentDetails;
