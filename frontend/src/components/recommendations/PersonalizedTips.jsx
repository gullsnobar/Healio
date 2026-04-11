import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/theme';
const PersonalizedTips = ({ tips = [] }) => {
  const { colors } = useAppTheme();
  return (
  <View style={[s.c, { backgroundColor: colors.card }]}><Text style={[s.t, { color: colors.text }]}>Personalized Tips</Text>
  <FlatList data={tips} keyExtractor={(item, i) => `tip-${i}-${item?.substring(0, 20) || i}`} renderItem={({ item }) => (
    <View style={s.tip}><Ionicons name="checkmark-circle" size={18} color={colors.success} /><Text style={[s.text, { color: colors.textSecondary }]}>{item}</Text></View>
  )} /></View>
  );
};
const s = StyleSheet.create({c:{borderRadius:12,padding:16,elevation:2},t:{fontSize:16,fontWeight:'600',marginBottom:12},tip:{flexDirection:'row',alignItems:'flex-start',gap:8,marginBottom:8},text:{flex:1,fontSize:14,lineHeight:20}});
export default PersonalizedTips;
