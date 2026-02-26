import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY_COLOR = '#4A90D9';

const AppointmentReminder = ({ appointment, onDismiss }) => {
  const { doctorName, location, date, time, purpose } = appointment || {};

  const openDirections = () => {
    if (!location) return;
    const encoded = encodeURIComponent(location);
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${encoded}`).catch(() => {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encoded}`);
    });
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="notifications" size={24} color="#fff" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.reminderTitle}>Appointment Reminder</Text>
            <Text style={styles.reminderSubtitle}>You have an upcoming appointment</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Ionicons name="person-outline" size={18} color={PRIMARY_COLOR} />
            <Text style={styles.detailText}>{doctorName}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={18} color={PRIMARY_COLOR} />
            <Text style={styles.detailText}>{date}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={18} color={PRIMARY_COLOR} />
            <Text style={styles.detailText}>{time}</Text>
          </View>

          {location ? (
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={18} color={PRIMARY_COLOR} />
              <Text style={styles.detailText}>{location}</Text>
            </View>
          ) : null}

          {purpose ? (
            <View style={styles.detailRow}>
              <Ionicons name="document-text-outline" size={18} color={PRIMARY_COLOR} />
              <Text style={styles.detailText}>{purpose}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={openDirections}
            style={styles.directionsButton}
            buttonColor={PRIMARY_COLOR}
            icon="directions"
            contentStyle={styles.buttonContent}
          >
            Open Directions
          </Button>

          <Button
            mode="outlined"
            onPress={() => onDismiss?.(appointment)}
            style={styles.dismissButton}
            textColor="#888"
            contentStyle={styles.buttonContent}
          >
            Dismiss
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 14,
    elevation: 3,
    backgroundColor: '#fff',
    borderLeftWidth: 4,
    borderLeftColor: PRIMARY_COLOR,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  reminderTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  reminderSubtitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 14,
  },
  details: {
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#444',
    marginLeft: 10,
    flex: 1,
  },
  actions: {
    marginTop: 18,
    gap: 10,
  },
  directionsButton: {
    borderRadius: 8,
  },
  dismissButton: {
    borderRadius: 8,
    borderColor: '#ddd',
  },
  buttonContent: {
    height: 44,
  },
});

export default AppointmentReminder;
