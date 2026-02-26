import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
const WeeklyInsights = ({ insights = {} }) => (
  <View style={s.c}><Text style={s.t}>This Week's Insights</Text>
  <Text style={s.i}>{insights.summary || 'No insights available yet. Keep using HEALIO to get personalized insights!'}</Text>
  {insights.highlights?.map((h, i) => <Text key={i} style={s.h}> {h}</Text>)}
  </View>
);
const s = StyleSheet.create({c:{backgroundColor:'#FFF',borderRadius:12,padding:16,elevation:2,marginBottom:12},t:{fontSize:16,fontWeight:'600',marginBottom:8},i:{fontSize:14,color:'#666',lineHeight:20,marginBottom:8},h:{fontSize:14,color:'#4A90D9',marginBottom:4,lineHeight:20}});
export default WeeklyInsights;
