import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';

const AboutScreen = ({ navigation }) => {
  const { colors } = useAppTheme();
  return (
  <View style={[s.c, { backgroundColor: colors.background }]}>
    {/* Header with back button */}
    <View style={[s.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>
      <Text style={[s.headerTitle, { color: colors.text }]}>About HEALIO</Text>
      <View style={s.headerSpacer} />
    </View>
    <View style={s.content}>
      <Text style={[s.name, { color: colors.primary }]}>HEALIO</Text>
      <Text style={[s.ver, { color: colors.textTertiary }]}>Version 1.0.0</Text>
      <Text style={[s.desc, { color: colors.textSecondary }]}>All-in-One Health Management App</Text>
      <Text style={[s.org, { color: colors.textTertiary }]}>Department of Information Sciences{`\n`}University of Education, Lahore</Text>
      <Text style={[s.copy, { color: colors.textTertiary }]}> 2026 HEALIO. All rights reserved.</Text>
    </View>
  </View>
  );
};
const s = StyleSheet.create({c:{flex:1},header:{flexDirection:'row',alignItems:'center',paddingHorizontal:16,paddingVertical:12,borderBottomWidth:1},backBtn:{padding:4},headerTitle:{fontSize:18,fontWeight:'700',flex:1,textAlign:'center'},headerSpacer:{width:32},content:{flex:1,justifyContent:'center',alignItems:'center',padding:24},name:{fontSize:32,fontWeight:'800'},ver:{fontSize:14,marginTop:4},desc:{fontSize:16,marginTop:16},org:{fontSize:14,marginTop:24,textAlign:'center',lineHeight:22},copy:{fontSize:12,marginTop:32}});
export default AboutScreen;
