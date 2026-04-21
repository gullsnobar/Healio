import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../styles/ThemeContext';

const HealthScoreWidget = ({ score = 0 }) => {
  const { colors, isDark } = useAppTheme();
  const isGood = score >= 80;
  const isFair = score >= 50;
  const grade = isGood ? { label: 'Excellent', color: '#10B981', icon: 'heart-circle' }
    : isFair ? { label: 'Good', color: '#F59E0B', icon: 'heart-half' }
    : { label: 'Needs Attention', color: '#EF4444', icon: 'heart-dislike' };
  const pct = Math.max(0, Math.min(score, 100));
  const grad = isDark ? ['#1E293B', '#334155'] : [colors.primaryDeep, colors.primaryDark];

  return (
    <LinearGradient colors={grad} style={styles.container} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <View style={styles.iconRow}>
        <Ionicons name={grade.icon} size={32} color="rgba(255,255,255,0.9)" />
        <View style={[styles.gradePill, { borderColor: grade.color }]}>
          <Text style={styles.gradeText}>{grade.label}</Text>
        </View>
      </View>
      <Text style={styles.score}>
        {pct}
        <Text style={styles.scoreMax}>/100</Text>
      </Text>
      <Text style={styles.label}>Health Score</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { borderRadius: 20, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 6 },
  iconRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  gradePill: { backgroundColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  gradeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  score: { fontSize: 48, fontWeight: '900', color: '#fff', letterSpacing: -1 },
  scoreMax: { fontSize: 22, fontWeight: '600', color: 'rgba(255,255,255,0.85)' },
  label: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 14, fontWeight: '500' },
  track: { height: 6, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 3, overflow: 'hidden' },
  fill: { height: 6, backgroundColor: '#fff', borderRadius: 3 },
});
export default HealthScoreWidget;
