import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import HealthScoreWidget from './HealthScoreWidget';
import MedicationStatusWidget from './MedicationStatusWidget';
import FitnessProgressWidget from './FitnessProgressWidget';
import UpcomingReminders from './UpcomingReminders';

const DashboardOverview = ({ healthScore, medications, fitness, reminders }) => (
  <ScrollView style={styles.container}>
    <HealthScoreWidget score={healthScore} />
    <MedicationStatusWidget data={medications} />
    <FitnessProgressWidget data={fitness} />
    <UpcomingReminders reminders={reminders} />
  </ScrollView>
);

const styles = StyleSheet.create({ container: { flex: 1, padding: 16, backgroundColor: '#F5F7FA' } });
export default DashboardOverview;
