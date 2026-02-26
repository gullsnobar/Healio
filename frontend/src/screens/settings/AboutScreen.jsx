import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const AboutScreen = () => (
  <View style={s.c}>
    <Text style={s.name}>HEALIO</Text>
    <Text style={s.ver}>Version 1.0.0</Text>
    <Text style={s.desc}>All-in-One Health Management App</Text>
    <Text style={s.org}>Department of Information Sciences{'\n'}University of Education, Lahore</Text>
    <Text style={s.copy}> 2026 HEALIO. All rights reserved.</Text>
  </View>
);
const s = StyleSheet.create({c:{flex:1,justifyContent:'center',alignItems:'center',padding:24,backgroundColor:'#F5F7FA'},name:{fontSize:32,fontWeight:'800',color:'#4A90D9'},ver:{fontSize:14,color:'#888',marginTop:4},desc:{fontSize:16,color:'#555',marginTop:16},org:{fontSize:14,color:'#888',marginTop:24,textAlign:'center',lineHeight:22},copy:{fontSize:12,color:'#AAA',marginTop:32}});
export default AboutScreen;
