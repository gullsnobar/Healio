import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAppTheme } from '../../styles/theme';
const MonthlyReport = ({ report }) => {
  const { colors } = useAppTheme();
  return (
  <ScrollView style={s.c}><Text style={[s.t, { color: colors.text }]}>Monthly Health Report</Text>
  <Text style={[s.d, { color: colors.textTertiary }]}>{report?.period || 'This Month'}</Text>
  <View style={[s.sec, { backgroundColor: colors.card }]}><Text style={[s.h, { color: colors.textSecondary }]}>Medication Adherence</Text><Text style={[s.v, { color: colors.primary }]}>{report?.adherence || 0}%</Text></View>
  <View style={[s.sec, { backgroundColor: colors.card }]}><Text style={[s.h, { color: colors.textSecondary }]}>Total Steps</Text><Text style={[s.v, { color: colors.primary }]}>{report?.totalSteps || 0}</Text></View>
  <View style={[s.sec, { backgroundColor: colors.card }]}><Text style={[s.h, { color: colors.textSecondary }]}>Avg Sleep</Text><Text style={[s.v, { color: colors.primary }]}>{report?.avgSleep || 0}h</Text></View>
  </ScrollView>
  );
};
const s = StyleSheet.create({c:{flex:1,padding:16},t:{fontSize:22,fontWeight:'700',marginBottom:4},d:{fontSize:14,marginBottom:16},sec:{borderRadius:12,padding:16,marginBottom:12,elevation:2},h:{fontSize:14},v:{fontSize:24,fontWeight:'700',marginTop:4}});
export default MonthlyReport;
