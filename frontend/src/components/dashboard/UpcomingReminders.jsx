import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const UpcomingReminders = ({ reminders = [] }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Upcoming Reminders</Text>
    {reminders.length === 0 ? (
      <Text style={styles.empty}>No upcoming reminders</Text>
    ) : (
      <FlatList data={reminders} keyExtractor={(item) => item._id} renderItem={({ item }) => (
        <View style={styles.item}>
          <Ionicons name={item.type === 'medication' ? 'medkit-outline' : 'calendar-outline'} size={20} color='#4A90D9' />
          <View style={styles.info}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemTime}>{item.time}</Text>
          </View>
        </View>
      )} />
    )}
  </View>
);

const styles = StyleSheet.create({
  container: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, elevation: 2, marginBottom: 12 },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  empty: { color: '#888', textAlign: 'center', padding: 20 },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  info: { marginLeft: 12 },
  itemTitle: { fontSize: 14, fontWeight: '500' },
  itemTime: { fontSize: 12, color: '#888' },
});
export default UpcomingReminders;
