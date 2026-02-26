import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
const NotificationBadge = ({ count = 0 }) => count > 0 ? (
  <View style={s.badge}><Text style={s.text}>{count > 99 ? '99+' : count}</Text></View>
) : null;
const s = StyleSheet.create({badge:{backgroundColor:'#F44336',borderRadius:10,minWidth:20,height:20,alignItems:'center',justifyContent:'center',paddingHorizontal:4},text:{color:'#FFF',fontSize:11,fontWeight:'700'}});
export default NotificationBadge;
