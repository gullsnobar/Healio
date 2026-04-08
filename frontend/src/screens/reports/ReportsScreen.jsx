import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';
import Tooltip from '../../components/common/Tooltip';

const { width: SCREEN_W } = Dimensions.get('window');
const IS_SMALL = SCREEN_W < 400;

const ReportsScreen = ({ navigation }) => {
  const { colors } = useAppTheme();
  return (
  <ScrollView style={[s.c, { backgroundColor: colors.background }]}>
    {/* Header with back button */}
    <View style={[s.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>
      <Text style={[s.headerTitle, { color: colors.text }]}>Health Reports</Text>
      <View style={s.headerSpacer} />
    </View>
    {[['Weekly Report','WeeklyReport','analytics-outline','Your weekly health summary'],['Monthly Report','MonthlyReport','calendar-outline','Monthly health overview']].map(([t,r,i,d])=>(
      <Tooltip key={r} text={t}>
        <TouchableOpacity style={[s.card, { backgroundColor: colors.card }]} onPress={() => navigation.navigate(r)}>
          <Ionicons name={i} size={32} color={colors.primary} />
          <View style={s.info}><Text style={[s.t, { color: colors.text }]}>{t}</Text><Text style={[s.d, { color: colors.textSecondary }]}>{d}</Text></View>
          <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
        </TouchableOpacity>
      </Tooltip>
    ))}
  </ScrollView>
  );
};
const s = StyleSheet.create({
  c: { flex: 1, padding: IS_SMALL ? 12 : 16 },
  card: { flexDirection: 'row', alignItems: 'center', padding: IS_SMALL ? 14 : 16, borderRadius: 12, marginBottom: 12, elevation: 2 },
  info: { flex: 1, marginLeft: 16 },
  t: { fontSize: IS_SMALL ? 15 : 16, fontWeight: '600' },
  d: { fontSize: IS_SMALL ? 12 : 13, marginTop: 2 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: IS_SMALL ? 12 : 16, paddingVertical: IS_SMALL ? 10 : 12, borderBottomWidth: 1 },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: IS_SMALL ? 16 : 18, fontWeight: '700', flex: 1, textAlign: 'center' },
  headerSpacer: { width: 32 }
});
export default ReportsScreen;
