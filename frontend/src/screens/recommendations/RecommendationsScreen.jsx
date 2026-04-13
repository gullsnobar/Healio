import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useAppTheme } from '../../styles/ThemeContext';
import RecommendationList from '../../components/recommendations/RecommendationList';
import WeeklyInsights from '../../components/recommendations/WeeklyInsights';
import PersonalizedTips from '../../components/recommendations/PersonalizedTips';
import { fetchRecommendations } from '../../redux/slices/recommendationSlice';

const RecommendationsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { colors } = useAppTheme();
  const { recommendations, insights, tips, loading } = useSelector((state) => state.recommendation);
  useEffect(() => { dispatch(fetchRecommendations()); }, []);

  return (
    <ScrollView style={[s.c, { backgroundColor: colors.background }]}>
      {/* Header with back button */}
      <View style={[s.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: colors.text }]}>AI Insights</Text>
        <View style={s.headerSpacer} />
      </View>
      <WeeklyInsights insights={insights} />
      <PersonalizedTips tips={tips} />
      <RecommendationList recommendations={recommendations} loading={loading} />
    </ScrollView>
  );
};
const s = StyleSheet.create({ c: { flex: 1, padding: 16 }, header:{flexDirection:'row',alignItems:'center',paddingHorizontal:16,paddingVertical:12,borderBottomWidth:1},backBtn:{padding:4},headerTitle:{fontSize:18,fontWeight:'700',flex:1,textAlign:'center'},headerSpacer:{width:32} });
export default RecommendationsScreen;
