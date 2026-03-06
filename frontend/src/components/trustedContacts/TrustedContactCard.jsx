import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/theme';
const TrustedContactCard = ({ contact, onPress, onDelete }) => {
  const { colors } = useAppTheme();
  return (
  <TouchableOpacity style={[s.c, { backgroundColor: colors.card }]} onPress={() => onPress?.(contact)}>
    <View style={[s.avatar, { backgroundColor: colors.primary }]}><Ionicons name="person" size={24} color="#FFF" /></View>
    <View style={s.info}><Text style={[s.name, { color: colors.text }]}>{contact?.name}</Text><Text style={[s.rel, { color: colors.textTertiary }]}>{contact?.relationship}</Text><Text style={[s.phone, { color: colors.primary }]}>{contact?.phone}</Text></View>
    <TouchableOpacity onPress={() => onDelete?.(contact)}><Ionicons name="trash-outline" size={20} color={colors.error} /></TouchableOpacity>
  </TouchableOpacity>
  );
};
const s = StyleSheet.create({c:{flexDirection:'row',alignItems:'center',padding:16,borderRadius:12,marginBottom:8,elevation:2},avatar:{width:48,height:48,borderRadius:24,alignItems:'center',justifyContent:'center'},info:{flex:1,marginLeft:12},name:{fontSize:16,fontWeight:'600'},rel:{fontSize:13,marginTop:2},phone:{fontSize:13,marginTop:2}});
export default TrustedContactCard;
