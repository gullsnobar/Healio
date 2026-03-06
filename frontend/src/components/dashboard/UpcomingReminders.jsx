import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';

const UpcomingReminders = ({ reminders = [] }) => {
  const { colors } = useAppTheme();

  const TYPE_CONFIG = {
    medication: { icon: 'medkit',       color: colors.primary, bg: colors.primaryLight },
    appointment: { icon: 'calendar',    color: '#6366F1', bg: '#E0E7FF' },
    fitness:     { icon: 'fitness',     color: colors.success, bg: '#D1FAE5' },
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
    <View style={styles.headerRow}>
      <View style={styles.iconBadge}>
        <Ionicons name='notifications' size={18} color='#F59E0B' />
      </View>
      <Text style={[styles.title, { color: colors.text }]}>Upcoming Reminders</Text>
    </View>
    {reminders.length === 0 ? (
      <View style={styles.emptyWrap}>
        <Ionicons name='checkmark-circle-outline' size={40} color={colors.textTertiary} />
        <Text style={[styles.empty, { color: colors.textTertiary }]}>All clear — no upcoming reminders</Text>
      </View>
    ) : (
      reminders.slice(0, 5).map((item, i) => {
        const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.appointment;
        return (
          <View key={item._id || i} style={[styles.item, { borderBottomColor: colors.borderLight }]}>
            <View style={[styles.itemIcon, { backgroundColor: cfg.bg }]}>
              <Ionicons name={cfg.icon + '-outline'} size={18} color={cfg.color} />
            </View>
            <View style={styles.info}>
              <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
              <Text style={[styles.itemTime, { color: colors.textTertiary }]}>{item.time}</Text>
            </View>
            <View style={[styles.dot, { backgroundColor: cfg.color }]} />
          </View>
        );
      })
    )}
  </View>
  );
};
const styles = StyleSheet.create({
  container: { borderRadius: 20, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 4 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  iconBadge: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#FEF3C7', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  title: { fontSize: 15, fontWeight: '700' },
  emptyWrap: { alignItems: 'center', paddingVertical: 24, gap: 8 },
  empty: { fontSize: 13, textAlign: 'center' },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1 },
  itemIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  info: { flex: 1 },
  itemTitle: { fontSize: 14, fontWeight: '600' },
  itemTime: { fontSize: 12, marginTop: 2 },
  dot: { width: 8, height: 8, borderRadius: 4, marginLeft: 8 },
});
export default UpcomingReminders;
