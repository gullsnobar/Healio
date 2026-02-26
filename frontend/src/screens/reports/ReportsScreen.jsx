import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ReportsScreen = ({ navigation }) => (
  <ScrollView style={s.c}>
    {[['Weekly Report','WeeklyReport','analytics-outline','Your weekly health summary'],['Monthly Report','MonthlyReport','calendar-outline','Monthly health overview']].map(([t,r,i,d])=>(
      <TouchableOpacity key={r} style={s.card} onPress={() => navigation.navigate(r)}>
        <Ionicons name={i} size={32} color="#4A90D9" />
        <View style={s.info}><Text style={s.t}>{t}</Text><Text style={s.d}>{d}</Text></View>
        <Ionicons name="chevron-forward" size={20} color="#CCC" />
      </TouchableOpacity>
    ))}
  </ScrollView>
);
const s = StyleSheet.create({c:{flex:1,backgroundColor:'#F5F7FA',padding:16},card:{flexDirection:'row',alignItems:'center',backgroundColor:'#FFF',padding:16,borderRadius:12,marginBottom:12,elevation:2},info:{flex:1,marginLeft:16},t:{fontSize:16,fontWeight:'600'},d:{fontSize:13,color:'#888',marginTop:2}});
export default ReportsScreen;
