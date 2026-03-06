import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';

const MedicationDetails = ({ medication, logs = [], onEdit, onDelete }) => {
  const { colors } = useAppTheme();

  const STATUS_COLORS = {
    taken: colors.success,
    missed: colors.error,
    pending: colors.warning,
  };
  const {
    name,
    dosage,
    dosageUnit,
    frequency,
    times,
    startDate,
    endDate,
    doctorName,
    notes,
    status,
  } = medication || {};

  const takenCount = logs.filter((l) => l.status === 'taken').length;
  const totalCount = logs.length || 1;
  const adherence = Math.round((takenCount / totalCount) * 100);

  const InfoRow = ({ icon, label, value }) => (
    <View style={[styles.infoRow, { borderBottomColor: colors.borderLight }]}>
      <Ionicons name={icon} size={18} color={colors.textTertiary} />
      <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: colors.text }]}>{value || '—'}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: colors.primaryLight }]}>
          <Ionicons name="medkit" size={32} color={colors.primary} />
        </View>
        <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
        <Text style={[styles.dosageText, { color: colors.textSecondary }]}>
          {dosage} {dosageUnit}
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Medication Info</Text>
        <InfoRow icon="repeat-outline" label="Frequency" value={frequency} />
        <InfoRow
          icon="time-outline"
          label="Times"
          value={Array.isArray(times) ? times.join(', ') : times}
        />
        <InfoRow icon="calendar-outline" label="Start Date" value={startDate} />
        <InfoRow icon="calendar-outline" label="End Date" value={endDate || 'Ongoing'} />
        <InfoRow icon="person-outline" label="Doctor" value={doctorName ? `Dr. ${doctorName}` : null} />
        {notes ? (
          <View style={styles.notesWrap}>
            <Text style={[styles.notesLabel, { color: colors.textTertiary }]}>Notes</Text>
            <Text style={[styles.notesText, { color: colors.textSecondary }]}>{notes}</Text>
          </View>
        ) : null}
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Adherence</Text>
        <View style={styles.adherenceRow}>
          <Text style={[styles.adherencePercent, { color: colors.text }]}>{adherence}%</Text>
          <Text style={[styles.adherenceSub, { color: colors.textSecondary }]}>
            {takenCount} of {totalCount} doses taken
          </Text>
        </View>
        <View style={[styles.progressTrack, { backgroundColor: colors.borderLight }]}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${adherence}%`,
                backgroundColor:
                  adherence >= 80 ? '#27ae60' : adherence >= 50 ? '#f39c12' : '#e74c3c',
              },
            ]}
          />
        </View>
      </View>

      {logs.length > 0 && (
        <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Recent Log</Text>
          {logs.slice(0, 10).map((log, i) => (
            <View key={log.id ?? i} style={[styles.logRow, { borderBottomColor: colors.borderLight }]}>
              <Ionicons
                name={
                  log.status === 'taken'
                    ? 'checkmark-circle'
                    : log.status === 'missed'
                    ? 'close-circle'
                    : 'time'
                }
                size={18}
                color={STATUS_COLORS[log.status] || '#888'}
              />
              <View style={styles.logInfo}>
                <Text style={[styles.logDate, { color: colors.text }]}>{log.date || log.timestamp}</Text>
                <Text style={[styles.logTime, { color: colors.textTertiary }]}>{log.time || ''}</Text>
              </View>
              <Text
                style={[styles.logStatus, { color: STATUS_COLORS[log.status] || '#888' }]}
              >
                {log.status}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={() => onEdit?.(medication)}
          style={styles.editBtn}
          buttonColor={colors.primary}
          textColor="#fff"
          icon={({ size, color }) => <Ionicons name="create-outline" size={size} color={color} />}
        >
          Edit
        </Button>
        <Button
          mode="outlined"
          onPress={() => onDelete?.(medication)}
          style={styles.deleteBtn}
          textColor={colors.error}
          icon={({ size, color }) => <Ionicons name="trash-outline" size={size} color={color} />}
        >
          Delete
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
  },
  dosageText: {
    fontSize: 16,
    marginTop: 4,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    gap: 10,
  },
  infoLabel: {
    fontSize: 14,
    width: 90,
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  notesWrap: {
    marginTop: 12,
  },
  notesLabel: {
    fontSize: 13,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    lineHeight: 20,
  },
  adherenceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    marginBottom: 10,
  },
  adherencePercent: {
    fontSize: 32,
    fontWeight: '700',
  },
  adherenceSub: {
    fontSize: 13,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    gap: 10,
  },
  logInfo: {
    flex: 1,
  },
  logDate: {
    fontSize: 13,
    fontWeight: '500',
  },
  logTime: {
    fontSize: 12,
  },
  logStatus: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  editBtn: {
    flex: 1,
    borderRadius: 12,
  },
  deleteBtn: {
    flex: 1,
    borderRadius: 12,
    borderColor: '#EF4444',
  },
});

export default MedicationDetails;
