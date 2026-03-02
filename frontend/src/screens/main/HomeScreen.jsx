import React, { useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  RefreshControl,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DashboardOverview from '../../components/dashboard/DashboardOverview';
import { fetchDashboardData } from '../../redux/slices/userSlice';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good Morning', icon: 'sunny-outline' };
  if (h < 17) return { text: 'Good Afternoon', icon: 'partly-sunny-outline' };
  return { text: 'Good Evening', icon: 'moon-outline' };
};

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { dashboardData, loading } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);
  const greeting = getGreeting();
  const firstName = user?.name?.split(' ')[0] || 'there';

  useEffect(() => { dispatch(fetchDashboardData()); }, []);

  return (
    <ScrollView
      style={s.c}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={() => dispatch(fetchDashboardData())} tintColor="#3B82F6" />}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1D4ED8" />

      {/* Header Banner */}
      <LinearGradient colors={['#1D4ED8', '#3B82F6']} style={s.hero}>
        <View style={s.heroContent}>
          <View>
            <View style={s.greetRow}>
              <Ionicons name={greeting.icon} size={18} color="rgba(255,255,255,0.85)" />
              <Text style={s.greetText}>{greeting.text}</Text>
            </View>
            <Text style={s.userName}>{firstName} 👋</Text>
            <Text style={s.heroSub}>Here's your health overview</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={s.avatarBtn}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>{firstName.charAt(0).toUpperCase()}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick health score bubble in header */}
        <View style={s.heroScore}>
          <View style={s.heroScoreInner}>
            <Text style={s.heroScoreNum}>{dashboardData?.healthScore || 0}</Text>
            <Text style={s.heroScoreLabel}>Health Score</Text>
          </View>
          <View style={s.heroScoreDivider} />
          <View style={s.heroScoreInner}>
            <Text style={s.heroScoreNum}>{dashboardData?.medications?.pending || 0}</Text>
            <Text style={s.heroScoreLabel}>Meds Due</Text>
          </View>
          <View style={s.heroScoreDivider} />
          <View style={s.heroScoreInner}>
            <Text style={s.heroScoreNum}>{dashboardData?.fitness?.steps || 0}</Text>
            <Text style={s.heroScoreLabel}>Steps</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Dashboard overview cards */}
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

const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { paddingBottom: 24 },
  hero: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 0,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greetRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 6 },
  greetText: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '500' },
  userName: { color: '#fff', fontSize: 24, fontWeight: '800', letterSpacing: -0.3 },
  heroSub: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 2 },
  avatarBtn: { marginTop: 4 },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  heroScore: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 20,
    justifyContent: 'space-around',
  },
  heroScoreInner: { flex: 1, alignItems: 'center' },
  heroScoreNum: { color: '#fff', fontSize: 22, fontWeight: '800' },
  heroScoreLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 11, marginTop: 2, fontWeight: '500' },
  heroScoreDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.3)', marginHorizontal: 4 },
});
export default HomeScreen;
