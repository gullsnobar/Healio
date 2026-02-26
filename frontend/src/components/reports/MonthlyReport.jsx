import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
const MonthlyReport = ({ report }) => (
  <ScrollView style={s.c}><Text style={s.t}>Monthly Health Report</Text>
  <Text style={s.d}>{report?.period || 'This Month'}</Text>
  <View style={s.sec}><Text style={s.h}>Medication Adherence</Text><Text style={s.v}>{report?.adherence || 0}%</Text></View>
  <View style={s.sec}><Text style={s.h}>Total Steps</Text><Text style={s.v}>{report?.totalSteps || 0}</Text></View>
  <View style={s.sec}><Text style={s.h}>Avg Sleep</Text><Text style={s.v}>{report?.avgSleep || 0}h</Text></View>
  </ScrollView>
);
const s = StyleSheet.create({c:{flex:1,padding:16},t:{fontSize:22,fontWeight:'700',marginBottom:4},d:{fontSize:14,color:'#888',marginBottom:16},sec:{backgroundColor:'#FFF',borderRadius:12,padding:16,marginBottom:12,elevation:2},h:{fontSize:14,color:'#666'},v:{fontSize:24,fontWeight:'700',color:'#4A90D9',marginTop:4}});
export default MonthlyReport;
