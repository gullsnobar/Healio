import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/theme';

const AppointmentReminder = ({ appointment, onDismiss }) => {
  const { colors } = useAppTheme();
  const { doctorName, location, date, time, purpose } = appointment || {};

  const openDirections = () => {
    if (!location) return;
    const encoded = encodeURIComponent(location);
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${encoded}`).catch(() => {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encoded}`);
    });
  };

  return (
    <Card style={[styles.card, { backgroundColor: colors.card, borderLeftColor: colors.primary }]}>
      <Card.Content>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
            <Ionicons name="notifications" size={24} color="#fff" />
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.reminderTitle, { color: colors.text }]}>Appointment Reminder</Text>
            <Text style={[styles.reminderSubtitle, { color: colors.textSecondary }]}>You have an upcoming appointment</Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Ionicons name="person-outline" size={18} color={colors.primary} />
            <Text style={[styles.detailText, { color: colors.text }]}>{doctorName}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={18} color={colors.primary} />
            <Text style={[styles.detailText, { color: colors.text }]}>{date}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={18} color={colors.primary} />
            <Text style={[styles.detailText, { color: colors.text }]}>{time}</Text>
          </View>

          {location ? (
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={18} color={colors.primary} />
              <Text style={[styles.detailText, { color: colors.text }]}>{location}</Text>
            </View>
          ) : null}

          {purpose ? (
            <View style={styles.detailRow}>
              <Ionicons name="document-text-outline" size={18} color={colors.primary} />
              <Text style={[styles.detailText, { color: colors.text }]}>{purpose}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={openDirections}
            style={styles.directionsButton}
            buttonColor={colors.primary}
            icon="directions"
            contentStyle={styles.buttonContent}
          >
            Open Directions
          </Button>

          <Button
            mode="outlined"
            onPress={() => onDismiss?.(appointment)}
            style={[styles.dismissButton, { borderColor: colors.border }]}
            textColor={colors.textSecondary}
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
    borderLeftWidth: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
  },
  reminderSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  divider: {
    height: 1,
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
  },
  buttonContent: {
    height: 44,
  },
});

export default AppointmentReminder;
