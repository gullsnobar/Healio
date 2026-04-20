import React from 'react';
import { View, StyleSheet } from 'react-native';
import MedicationStatusWidget from './MedicationStatusWidget';
import FitnessProgressWidget from './FitnessProgressWidget';
import UpcomingReminders from './UpcomingReminders';

const DashboardOverview = ({ medications, fitness, reminders, navigation }) => (
  <View style={styles.container}>
    <MedicationStatusWidget data={medications} onPress={() => navigation?.navigate('MedicationList')} />
    <FitnessProgressWidget data={fitness} onPress={() => navigation?.navigate('Fitness')} />
    <UpcomingReminders reminders={reminders} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
});
export default DashboardOverview;
