import React from 'react';
import { FlatList, Text, StyleSheet } from 'react-native';
import AIRecommendationCard from './AIRecommendationCard';
const RecommendationList = ({ recommendations = [], loading }) => (
  <FlatList data={recommendations} keyExtractor={(i) => i._id} renderItem={({ item }) => <AIRecommendationCard recommendation={item} />}
    ListEmptyComponent={<Text style={s.e}>{loading ? 'Loading...' : 'No recommendations yet'}</Text>} contentContainerStyle={s.c} />
);
const s = StyleSheet.create({c:{padding:16},e:{textAlign:'center',color:'#888',padding:40}});
export default RecommendationList;
