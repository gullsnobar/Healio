import React, { useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import RecommendationList from '../../components/recommendations/RecommendationList';
import WeeklyInsights from '../../components/recommendations/WeeklyInsights';
import PersonalizedTips from '../../components/recommendations/PersonalizedTips';
import { fetchRecommendations } from '../../redux/slices/recommendationSlice';

const RecommendationsScreen = () => {
  const dispatch = useDispatch();
  const { recommendations, insights, tips, loading } = useSelector((state) => state.recommendation);
  useEffect(() => { dispatch(fetchRecommendations()); }, []);

  return (
    <ScrollView style={s.c}>
      <WeeklyInsights insights={insights} />
      <PersonalizedTips tips={tips} />
      <RecommendationList recommendations={recommendations} loading={loading} />
    </ScrollView>
  );
};
const s = StyleSheet.create({ c: { flex: 1, backgroundColor: '#F5F7FA', padding: 16 } });
export default RecommendationsScreen;
