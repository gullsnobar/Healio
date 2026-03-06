import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAppTheme } from '../../styles/theme';
const ReportViewer = ({ report }) => {
  const { colors } = useAppTheme();
  return (
  <ScrollView style={s.c}><Text style={[s.t, { color: colors.text }]}>{report?.title || 'Report'}</Text>
  <Text style={[s.d, { color: colors.textSecondary }]}>{report?.generatedAt || ''}</Text>
  {report?.sections?.map((sec, i) => (<View key={i} style={[s.sec, { backgroundColor: colors.card }]}><Text style={[s.h, { color: colors.text }]}>{sec.title}</Text><Text style={[s.v, { color: colors.textSecondary }]}>{sec.content}</Text></View>))}
  </ScrollView>
  );
};
const s = StyleSheet.create({c:{flex:1,padding:16},t:{fontSize:20,fontWeight:'700'},d:{marginBottom:16},sec:{borderRadius:12,padding:16,marginBottom:12,elevation:2},h:{fontSize:16,fontWeight:'600',marginBottom:8},v:{fontSize:14,lineHeight:22}});
export default ReportViewer;
