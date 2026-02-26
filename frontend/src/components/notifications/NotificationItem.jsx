import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
const iconMap = { medication: 'medkit', appointment: 'calendar', fitness: 'fitness', system: 'information-circle' };
const NotificationItem = ({ notification, onPress, onDismiss }) => (
  <TouchableOpacity style={[s.c, !notification.read && s.unread]} onPress={() => onPress?.(notification)}>
    <Ionicons name={(iconMap[notification.type] || 'notifications') + '-outline'} size={24} color="#4A90D9" />
    <View style={s.info}><Text style={s.t}>{notification.title}</Text><Text style={s.b}>{notification.body}</Text><Text style={s.time}>{notification.createdAt}</Text></View>
    <TouchableOpacity onPress={() => onDismiss?.(notification._id)}><Ionicons name="close" size={18} color="#888" /></TouchableOpacity>
  </TouchableOpacity>
);
const s = StyleSheet.create({c:{flexDirection:'row',alignItems:'center',padding:14,backgroundColor:'#FFF',borderRadius:8,marginBottom:8,elevation:1},unread:{borderLeftWidth:3,borderLeftColor:'#4A90D9'},info:{flex:1,marginLeft:12},t:{fontSize:15,fontWeight:'600'},b:{fontSize:13,color:'#666',marginTop:2},time:{fontSize:11,color:'#AAA',marginTop:4}});
export default NotificationItem;
