import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';

const ReportsScreen = ({ navigation }) => {
  const { colors } = useAppTheme();
  return (
  <ScrollView style={[s.c, { backgroundColor: colors.background }]}>
    {[['Weekly Report','WeeklyReport','analytics-outline','Your weekly health summary'],['Monthly Report','MonthlyReport','calendar-outline','Monthly health overview']].map(([t,r,i,d])=>(
      <TouchableOpacity key={r} style={[s.card, { backgroundColor: colors.card }]} onPress={() => navigation.navigate(r)}>
        <Ionicons name={i} size={32} color={colors.primary} />
        <View style={s.info}><Text style={[s.t, { color: colors.text }]}>{t}</Text><Text style={[s.d, { color: colors.textSecondary }]}>{d}</Text></View>
        <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
      </TouchableOpacity>
    ))}
  </ScrollView>
  );
};
const s = StyleSheet.create({c:{flex:1,padding:16},card:{flexDirection:'row',alignItems:'center',padding:16,borderRadius:12,marginBottom:12,elevation:2},info:{flex:1,marginLeft:16},t:{fontSize:16,fontWeight:'600'},d:{fontSize:13,marginTop:2}});
export default ReportsScreen;
