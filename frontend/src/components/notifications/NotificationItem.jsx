import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/theme';
const iconMap = { medication: 'medkit', appointment: 'calendar', fitness: 'fitness', system: 'information-circle' };
const NotificationItem = ({ notification, onPress, onDismiss }) => {
  const { colors } = useAppTheme();
  return (
  <TouchableOpacity style={[s.c, { backgroundColor: colors.card }, !notification.read && { borderLeftWidth: 3, borderLeftColor: colors.primary }]} onPress={() => onPress?.(notification)}>
    <Ionicons name={(iconMap[notification.type] || 'notifications') + '-outline'} size={24} color={colors.primary} />
    <View style={s.info}><Text style={[s.t, { color: colors.text }]}>{notification.title}</Text><Text style={[s.b, { color: colors.textSecondary }]}>{notification.body}</Text><Text style={[s.time, { color: colors.textTertiary }]}>{notification.createdAt}</Text></View>
    <TouchableOpacity onPress={() => onDismiss?.(notification._id)}><Ionicons name="close" size={18} color={colors.textSecondary} /></TouchableOpacity>
  </TouchableOpacity>
  );
};
const s = StyleSheet.create({c:{flexDirection:'row',alignItems:'center',padding:14,borderRadius:8,marginBottom:8,elevation:1},info:{flex:1,marginLeft:12},t:{fontSize:15,fontWeight:'600'},b:{fontSize:13,marginTop:2},time:{fontSize:11,marginTop:4}});
export default NotificationItem;
