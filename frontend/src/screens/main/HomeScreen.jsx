import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  RefreshControl,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import DashboardOverview from '../../components/dashboard/DashboardOverview';
import { fetchDashboardData } from '../../redux/slices/userSlice';

const PRIMARY = '#0F766E';
const { width: SCREEN_W } = Dimensions.get('window');

/* ─── date helpers ─── */
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const FULL_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const getDays = () => {
  const today = new Date();
  const days = [];
  for (let i = -3; i <= 3; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      key: d.toISOString(),
      date: d.getDate(),
      day: DAY_NAMES[d.getDay()],
      isToday: i === 0,
      fullDay: FULL_DAYS[d.getDay()],
    });
  }
  return days;
};

/* ─── Circular progress ring ─── */
const ProgressRing = ({ taken, total, size = 160 }) => {
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = total > 0 ? taken / total : 0;
  const strokeDashoffset = circumference * (1 - pct);

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E2E8F0"
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={PRIMARY}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.ringCenter}>
        <Text style={styles.ringNum}>{taken}/{total}</Text>
        <Text style={styles.ringLabel}>Intakes</Text>
      </View>
    </View>
  );
};

/* ─── Main HomeScreen ─── */
const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { dashboardData, loading } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);
  const firstName = user?.name?.split(' ')[0] || 'there';
  const [selectedDay, setSelectedDay] = useState(3); // center = today

  const days = useMemo(() => getDays(), []);
  const today = new Date();

  useEffect(() => { dispatch(fetchDashboardData()); }, []);

  const medsTaken = dashboardData?.medications?.taken || 0;
  const medsTotal = (dashboardData?.medications?.taken || 0) +
                    (dashboardData?.medications?.missed || 0) +
                    (dashboardData?.medications?.pending || 0) || 0;

  const renderDayItem = useCallback(({ item, index }) => {
    const active = index === selectedDay;
    return (
      <TouchableOpacity
        style={[styles.dayItem, active && styles.dayItemActive]}
        onPress={() => setSelectedDay(index)}
        activeOpacity={0.7}
      >
        <Text style={[styles.dayName, active && styles.dayNameActive]}>{item.day}</Text>
        <Text style={[styles.dayDate, active && styles.dayDateActive]}>{item.date}</Text>
      </TouchableOpacity>
    );
  }, [selectedDay]);

  return (
    <ScrollView
      style={styles.c}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={() => dispatch(fetchDashboardData())} tintColor={PRIMARY} />
      }
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* ─── Top Bar ─── */}
      <View style={styles.topBar}>
        <View style={styles.topLeft}>
          <View style={styles.pillIcon}>
            <Ionicons name="medkit" size={18} color={PRIMARY} />
          </View>
          <Text style={styles.brand}>HEALIO</Text>
        </View>
        <View style={styles.topRight}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Notifications')}>
            <Ionicons name="notifications-outline" size={22} color="#475569" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.avatarSmall}>
            <Text style={styles.avatarSmallText}>{firstName.charAt(0).toUpperCase()}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ─── Today heading ─── */}
      <View style={styles.todayRow}>
        <Text style={styles.todayTitle}>Today</Text>
        <Text style={styles.todayDate}>{MONTH_NAMES[today.getMonth()]} {today.getDate()}, {today.getFullYear()}</Text>
      </View>

      {/* ─── Horizontal Date Selector ─── */}
      <FlatList
        data={days}
        renderItem={renderDayItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dayList}
        keyExtractor={(item) => item.key}
      />

      {/* ─── Circular progress ring ─── */}
      <View style={styles.ringSection}>
        <ProgressRing taken={medsTaken} total={medsTotal} />
        <Text style={styles.ringDay}>{days[selectedDay]?.fullDay || 'Today'}</Text>
      </View>

      {/* ─── Quick Medication List ─── */}
      {dashboardData?.reminders?.length > 0 && (
        <View style={styles.medSection}>
          <Text style={styles.medSectionTitle}>Today's Schedule</Text>
          {dashboardData.reminders.slice(0, 5).map((item, i) => (
            <TouchableOpacity key={item._id || i} style={styles.medItem} activeOpacity={0.8}>
              <View style={[styles.medIcon, { backgroundColor: item.type === 'medication' ? '#CCFBF1' : '#E0E7FF' }]}>
                <Ionicons
                  name={item.type === 'medication' ? 'medkit-outline' : 'calendar-outline'}
                  size={20}
                  color={item.type === 'medication' ? PRIMARY : '#6366F1'}
                />
              </View>
              <View style={styles.medInfo}>
                <Text style={styles.medName} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.medDose}>{item.subtitle || item.time || 'Scheduled'}</Text>
              </View>
              <View style={styles.medTimeBadge}>
                <Text style={styles.medTimeText}>{item.time || '--:--'}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* ─── Dashboard overview cards ─── */}
      <DashboardOverview
        healthScore={dashboardData?.healthScore}
        medications={dashboardData?.medications}
        fitness={dashboardData?.fitness}
        reminders={dashboardData?.reminders}
        navigation={navigation}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { paddingBottom: 24 },

  /* Top bar */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  topLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pillIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: { fontSize: 18, fontWeight: '800', color: '#1E293B', letterSpacing: 1 },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  avatarSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSmallText: { color: '#FFF', fontSize: 14, fontWeight: '700' },

  /* Today */
  todayRow: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  todayTitle: { fontSize: 24, fontWeight: '800', color: '#1E293B', letterSpacing: -0.3 },
  todayDate: { fontSize: 13, color: '#94A3B8', marginTop: 2, fontWeight: '500' },

  /* Day selector */
  dayList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  dayItem: {
    width: 52,
    height: 72,
    borderRadius: 16,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dayItemActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  dayName: { fontSize: 11, color: '#94A3B8', fontWeight: '600', marginBottom: 4 },
  dayNameActive: { color: 'rgba(255,255,255,0.8)' },
  dayDate: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  dayDateActive: { color: '#FFF' },

  /* Progress ring */
  ringSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  ringCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringNum: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E293B',
  },
  ringLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 2,
  },
  ringDay: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 8,
  },

  /* Medication list */
  medSection: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  medSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  medItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  medIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  medInfo: { flex: 1 },
  medName: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  medDose: { fontSize: 12, color: '#94A3B8', marginTop: 2, fontWeight: '500' },
  medTimeBadge: {
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  medTimeText: {
    fontSize: 12,
    fontWeight: '700',
    color: PRIMARY,
  },
});

export default HomeScreen;
