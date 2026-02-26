import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
const ReportViewer = ({ report }) => (
  <ScrollView style={s.c}><Text style={s.t}>{report?.title || 'Report'}</Text>
  <Text style={s.d}>{report?.generatedAt || ''}</Text>
  {report?.sections?.map((sec, i) => (<View key={i} style={s.sec}><Text style={s.h}>{sec.title}</Text><Text style={s.v}>{sec.content}</Text></View>))}
  </ScrollView>
);
const s = StyleSheet.create({c:{flex:1,padding:16},t:{fontSize:20,fontWeight:'700'},d:{color:'#888',marginBottom:16},sec:{backgroundColor:'#FFF',borderRadius:12,padding:16,marginBottom:12,elevation:2},h:{fontSize:16,fontWeight:'600',marginBottom:8},v:{fontSize:14,color:'#555',lineHeight:22}});
export default ReportViewer;
