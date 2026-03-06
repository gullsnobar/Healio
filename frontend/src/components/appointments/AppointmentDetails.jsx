import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { Card, Button, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';

const DetailRow = ({ icon, label, value, onPress, linkColor, colors }) => (
  <TouchableOpacity
    style={styles.detailRow}
    onPress={onPress}
    disabled={!onPress}
    activeOpacity={onPress ? 0.6 : 1}
  >
    <Ionicons name={icon} size={20} color={colors.primary} style={styles.detailIcon} />
    <View style={styles.detailContent}>
      <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: colors.text }, linkColor && { color: linkColor, textDecorationLine: 'underline' }]}>
        {value}
      </Text>
    </View>
    {onPress && <Ionicons name="open-outline" size={16} color={colors.textTertiary} />}
  </TouchableOpacity>
);

const AppointmentDetails = ({ appointment, onEdit, onDelete, onCancel }) => {
  const { colors } = useAppTheme();

  const STATUS_CONFIG = {
    upcoming: { label: 'Upcoming', color: colors.primary, icon: 'time-outline' },
    completed: { label: 'Completed', color: colors.success, icon: 'checkmark-circle-outline' },
    cancelled: { label: 'Cancelled', color: colors.error, icon: 'close-circle-outline' },
  };

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
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      {/* Status Banner */}
      <View style={[styles.statusBanner, { backgroundColor: statusInfo.color + '15' }]}>
        <Ionicons name={statusInfo.icon} size={20} color={statusInfo.color} />
        <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
      </View>

      {/* Doctor Card */}
      <Card style={[styles.card, { backgroundColor: colors.card }]}>
        <Card.Content>
          <View style={styles.doctorHeader}>
            <View style={[styles.avatarCircle, { backgroundColor: colors.primary }]}>
              <Ionicons name="person" size={32} color="#fff" />
            </View>
            <View style={styles.doctorInfo}>
              <Text style={[styles.doctorName, { color: colors.text }]}>{doctorName}</Text>
              {specialty ? <Text style={[styles.specialty, { color: colors.textSecondary }]}>{specialty}</Text> : null}
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Details Card */}
      <Card style={[styles.card, { backgroundColor: colors.card }]}>
        <Card.Content>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Appointment Details</Text>

          <DetailRow icon="calendar-outline" label="Date" value={date} colors={colors} />
          <Divider style={styles.divider} />
          <DetailRow icon="time-outline" label="Time" value={time} colors={colors} />
          <Divider style={styles.divider} />
          <DetailRow
            icon="location-outline"
            label="Location"
            value={location}
            onPress={openMaps}
            linkColor={colors.primary}
            colors={colors}
          />
          <Divider style={styles.divider} />
          <DetailRow icon="document-text-outline" label="Purpose" value={purpose} colors={colors} />

          {notes ? (
            <>
              <Divider style={styles.divider} />
              <DetailRow icon="create-outline" label="Notes" value={notes} colors={colors} />
            </>
          ) : null}
        </Card.Content>
      </Card>

      {/* Reminder Status */}
      <Card style={[styles.card, { backgroundColor: colors.card }]}>
        <Card.Content>
          <View style={styles.reminderRow}>
            <Ionicons
              name={enableReminder ? 'notifications' : 'notifications-off-outline'}
              size={22}
              color={enableReminder ? colors.primary : colors.textTertiary}
            />
            <View style={styles.reminderInfo}>
              <Text style={[styles.reminderLabel, { color: colors.text }]}>Reminder</Text>
              <Text style={[styles.reminderStatus, { color: colors.textSecondary }]}>
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
            buttonColor={colors.primary}
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
  },
  doctorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
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
  },
  specialty: {
    fontSize: 14,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
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
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
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
  },
  reminderStatus: {
    fontSize: 13,
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
