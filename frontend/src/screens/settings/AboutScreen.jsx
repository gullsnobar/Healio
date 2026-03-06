import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useAppTheme } from '../../styles/ThemeContext';

const AboutScreen = () => {
  const { colors } = useAppTheme();
  return (
  <View style={[s.c, { backgroundColor: colors.background }]}>
    <Text style={[s.name, { color: colors.primary }]}>HEALIO</Text>
    <Text style={[s.ver, { color: colors.textTertiary }]}>Version 1.0.0</Text>
    <Text style={[s.desc, { color: colors.textSecondary }]}>All-in-One Health Management App</Text>
    <Text style={[s.org, { color: colors.textTertiary }]}>Department of Information Sciences{`\n`}University of Education, Lahore</Text>
    <Text style={[s.copy, { color: colors.textTertiary }]}> 2026 HEALIO. All rights reserved.</Text>
  </View>
  );
};
const s = StyleSheet.create({c:{flex:1,justifyContent:'center',alignItems:'center',padding:24},name:{fontSize:32,fontWeight:'800'},ver:{fontSize:14,marginTop:4},desc:{fontSize:16,marginTop:16},org:{fontSize:14,marginTop:24,textAlign:'center',lineHeight:22},copy:{fontSize:12,marginTop:32}});
export default AboutScreen;
