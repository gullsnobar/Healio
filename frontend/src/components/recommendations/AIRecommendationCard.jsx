import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';
const iconMap = { medication: 'medkit', fitness: 'fitness', sleep: 'moon', diet: 'nutrition', general: 'bulb' };
const AIRecommendationCard = ({ recommendation }) => {
  const { colors } = useAppTheme();
  return (
  <View style={[s.c, { backgroundColor: colors.card }]}>
    <View style={s.r}>
      <Ionicons name={(iconMap[recommendation?.category] || 'bulb') + '-outline'} size={24} color={colors.primary} />
      <Text style={[s.cat, { color: colors.primary }]}>{recommendation?.category || 'General'}</Text>
    </View>
    <Text style={[s.t, { color: colors.text }]}>{recommendation?.title}</Text>
    <Text style={[s.d, { color: colors.textSecondary }]}>{recommendation?.description}</Text>
  </View>
  );
};
const s = StyleSheet.create({c:{borderRadius:12,padding:16,marginBottom:12,elevation:2},r:{flexDirection:'row',alignItems:'center',gap:8,marginBottom:8},cat:{fontSize:12,fontWeight:'600',textTransform:'uppercase'},t:{fontSize:16,fontWeight:'600',marginBottom:4},d:{fontSize:14,lineHeight:20}});
export default AIRecommendationCard;
