import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';

const LabReportReminder = ({ reminder, onDismiss }) => {
  const { colors } = useAppTheme();
  const { title, date, location, notes } = reminder || {};

  return (
    <Card style={[styles.card, { backgroundColor: colors.card, borderLeftColor: colors.warning }]}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="document-text" size={22} color="#fff" />
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.reminderTitle, { color: colors.text }]}>Lab Report Pickup</Text>
            <Text style={[styles.reminderSubtitle, { color: colors.textSecondary }]}>Your report is ready for pickup</Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.details}>
          {title ? (
            <View style={styles.detailRow}>
              <Ionicons name="flask-outline" size={18} color={colors.primary} />
              <Text style={[styles.detailText, { color: colors.text }]}>{title}</Text>
            </View>
          ) : null}

          {date ? (
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={18} color={colors.primary} />
              <Text style={[styles.detailText, { color: colors.text }]}>{date}</Text>
            </View>
          ) : null}

          {location ? (
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={18} color={colors.primary} />
              <Text style={[styles.detailText, { color: colors.text }]}>{location}</Text>
            </View>
          ) : null}

          {notes ? (
            <View style={styles.detailRow}>
              <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
              <Text style={[styles.detailText, { color: colors.text }]}>{notes}</Text>
            </View>
          ) : null}
        </View>

        <Button
          mode="outlined"
          onPress={() => onDismiss?.(reminder)}
          style={[styles.dismissButton, { borderColor: colors.border }]}
          textColor={colors.textSecondary}
          contentStyle={styles.buttonContent}
          icon="close"
        >
          Dismiss
        </Button>
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
    backgroundColor: '#FF9800',
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
  dismissButton: {
    borderRadius: 8,
    marginTop: 18,
  },
  buttonContent: {
    height: 42,
  },
});

export default LabReportReminder;
