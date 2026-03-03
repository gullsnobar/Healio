import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar, RefreshControl, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { fetchReminders, setSelectedType } from '../../redux/slices/reminderSlice';
import { useAppTheme } from '../../styles/ThemeContext';

const TYPE_TABS = [
  { key: null, label: 'All', icon: 'list-outline' },
  { key: 'medication', label: 'Medication', icon: 'medical-outline' },
  { key: 'appointment', label: 'Appointment', icon: 'calendar-outline' },
  { key: 'lab', label: 'Lab Report', icon: 'flask-outline' },
];

const TYPE_COLORS = {
  medication: '#0F766E',
  appointment: '#6366F1',
  lab: '#F59E0B',
};

const RemindersScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { colors, isDark } = useAppTheme();
  const { reminders, loading, selectedType } = useSelector((s) => s.reminder);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(() => {
    dispatch(fetchReminders(selectedType ? { type: selectedType } : {}));
  }, [dispatch, selectedType]);

  useEffect(() => { load(); }, [load]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(fetchReminders(selectedType ? { type: selectedType } : {})).finally(() => setRefreshing(false));
  }, [dispatch, selectedType]);

  const formatDate = (d) => {
    const date = new Date(d);
    const today = new Date();
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderItem = ({ item }) => {
    const typeColor = TYPE_COLORS[item.reminderType] || colors.primary;
    return (
      <TouchableOpacity
        style={[s.card, { backgroundColor: isDark ? '#1E293B' : '#FFF' }]}
        onPress={() => navigation.navigate('ReminderDetails', { id: item._id })}
        activeOpacity={0.7}
      >
        <View style={[s.typeStrip, { backgroundColor: typeColor }]} />
        <View style={s.cardBody}>
          <View style={s.cardTop}>
            <Text style={[s.cardTitle, { color: isDark ? '#E2E8F0' : '#1F2937' }]} numberOfLines={1}>
              {item.title}
            </Text>
            {item.isCompleted && (
              <Ionicons name="checkmark-circle" size={18} color="#10B981" />
            )}
          </View>
          <View style={s.cardMeta}>
            <Ionicons name="time-outline" size={14} color={colors.primary} />
            <Text style={[s.cardMetaText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              {formatDate(item.date)} · {item.time}
            </Text>
          </View>
          {item.reminderType === 'medication' && item.medicationName && (
            <Text style={[s.subDetail, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              {item.medicationName} {item.dosage ? `– ${item.dosage}${item.dosageUnit || ''}` : ''}
            </Text>
          )}
          {item.reminderType === 'appointment' && item.doctorName && (
            <Text style={[s.subDetail, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              Dr. {item.doctorName}{item.specialty ? ` (${item.specialty})` : ''}
            </Text>
          )}
          {item.reminderType === 'lab' && item.labName && (
            <Text style={[s.subDetail, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              {item.labName}{item.testName ? ` – ${item.testName}` : ''}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[s.container, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0F766E" />

      {/* Type Tabs */}
      <View style={[s.tabBar, { backgroundColor: isDark ? '#1E293B' : '#FFF' }]}>
        {TYPE_TABS.map((tab) => {
          const active = selectedType === tab.key;
          return (
            <TouchableOpacity
              key={tab.label}
              style={[s.tab, active && { backgroundColor: colors.primary + '18' }]}
              onPress={() => dispatch(setSelectedType(tab.key))}
            >
              <Ionicons name={tab.icon} size={18} color={active ? colors.primary : '#94A3B8'} />
              <Text style={[s.tabLabel, { color: active ? colors.primary : '#94A3B8' }]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* List */}
      {loading && !refreshing ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={reminders}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
          ListEmptyComponent={
            <View style={s.empty}>
              <Ionicons name="notifications-off-outline" size={60} color="#CBD5E1" />
              <Text style={[s.emptyText, { color: isDark ? '#94A3B8' : '#64748B' }]}>No reminders yet</Text>
              <Text style={[s.emptyHint, { color: isDark ? '#64748B' : '#94A3B8' }]}>
                Tap + to add your first reminder
              </Text>
            </View>
          }
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={s.fabWrap}
        onPress={() => navigation.navigate('AddReminder')}
        activeOpacity={0.9}
      >
        <LinearGradient colors={['#0F766E', '#0D6560']} style={s.fab}>
          <Ionicons name="add" size={30} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const s = StyleSheet.create({
  container: { flex: 1 },
  tabBar: {
    flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 8,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4,
  },
  tab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 8, borderRadius: 8, marginHorizontal: 2,
  },
  tabLabel: { fontSize: 11, fontWeight: '600', marginLeft: 4 },
  card: {
    flexDirection: 'row', borderRadius: 12, marginBottom: 10, overflow: 'hidden',
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6,
  },
  typeStrip: { width: 5 },
  cardBody: { flex: 1, padding: 14 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '600', flex: 1, marginRight: 8 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  cardMetaText: { fontSize: 12, marginLeft: 4 },
  subDetail: { fontSize: 12, marginTop: 4 },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyText: { fontSize: 17, fontWeight: '600', marginTop: 16 },
  emptyHint: { fontSize: 13, marginTop: 6 },
  fabWrap: {
    position: 'absolute', right: 20, bottom: 24,
    shadowColor: '#0F766E', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 10,
  },
  fab: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
});

export default RemindersScreen;
