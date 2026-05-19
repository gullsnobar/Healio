import React from 'react';
import { FlatList, Text, StyleSheet } from 'react-native';
import AIRecommendationCard from './AIRecommendationCard';
import { useAppTheme } from '../../styles/ThemeContext';
const RecommendationList = ({ recommendations = [], loading }) => {
  const { colors } = useAppTheme();
  return (
  <FlatList data={recommendations} keyExtractor={(i) => i._id} renderItem={({ item }) => <AIRecommendationCard recommendation={item} />}
    ListEmptyComponent={<Text style={[s.e, { color: colors.textSecondary }]}>{loading ? 'Loading...' : 'No recommendations yet'}</Text>} contentContainerStyle={s.c} />
  );
};
const s = StyleSheet.create({c:{padding:16},e:{textAlign:'center',padding:40}});
export default RecommendationList;
