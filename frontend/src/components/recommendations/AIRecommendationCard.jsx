import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
const iconMap = { medication: 'medkit', fitness: 'fitness', sleep: 'moon', diet: 'nutrition', general: 'bulb' };
const AIRecommendationCard = ({ recommendation }) => (
  <View style={s.c}>
    <View style={s.r}>
      <Ionicons name={(iconMap[recommendation?.category] || 'bulb') + '-outline'} size={24} color="#4A90D9" />
      <Text style={s.cat}>{recommendation?.category || 'General'}</Text>
    </View>
    <Text style={s.t}>{recommendation?.title}</Text>
    <Text style={s.d}>{recommendation?.description}</Text>
  </View>
);
const s = StyleSheet.create({c:{backgroundColor:'#FFF',borderRadius:12,padding:16,marginBottom:12,elevation:2},r:{flexDirection:'row',alignItems:'center',gap:8,marginBottom:8},cat:{fontSize:12,color:'#4A90D9',fontWeight:'600',textTransform:'uppercase'},t:{fontSize:16,fontWeight:'600',marginBottom:4},d:{fontSize:14,color:'#666',lineHeight:20}});
export default AIRecommendationCard;
