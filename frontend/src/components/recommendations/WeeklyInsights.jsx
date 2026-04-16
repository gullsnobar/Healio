import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../styles/theme';
const WeeklyInsights = ({ insights }) => {
  const { colors } = useAppTheme();
  const safeInsights = insights || {};
  return (
  <View style={[s.c, { backgroundColor: colors.card }]}><Text style={[s.t, { color: colors.text }]}>This Week's Insights</Text>
  <Text style={[s.i, { color: colors.textSecondary }]}>{safeInsights.summary || 'No insights available yet. Keep using HEALIO to get personalized insights!'}</Text>
  {safeInsights.highlights?.map((h, i) => <Text key={i} style={[s.h, { color: colors.primary }]}> {h}</Text>)}
  </View>
  );
};
const s = StyleSheet.create({c:{borderRadius:12,padding:16,elevation:2,marginBottom:12},t:{fontSize:16,fontWeight:'600',marginBottom:8},i:{fontSize:14,lineHeight:20,marginBottom:8},h:{fontSize:14,marginBottom:4,lineHeight:20}});
export default WeeklyInsights;
