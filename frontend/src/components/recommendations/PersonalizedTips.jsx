import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
const PersonalizedTips = ({ tips = [] }) => (
  <View style={s.c}><Text style={s.t}>Personalized Tips</Text>
  <FlatList data={tips} keyExtractor={(_, i) => String(i)} renderItem={({ item }) => (
    <View style={s.tip}><Ionicons name="checkmark-circle" size={18} color="#4CAF50" /><Text style={s.text}>{item}</Text></View>
  )} /></View>
);
const s = StyleSheet.create({c:{backgroundColor:'#FFF',borderRadius:12,padding:16,elevation:2},t:{fontSize:16,fontWeight:'600',marginBottom:12},tip:{flexDirection:'row',alignItems:'flex-start',gap:8,marginBottom:8},text:{flex:1,fontSize:14,color:'#555',lineHeight:20}});
export default PersonalizedTips;
