import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
const TrustedContactCard = ({ contact, onPress, onDelete }) => (
  <TouchableOpacity style={s.c} onPress={() => onPress?.(contact)}>
    <View style={s.avatar}><Ionicons name="person" size={24} color="#FFF" /></View>
    <View style={s.info}><Text style={s.name}>{contact?.name}</Text><Text style={s.rel}>{contact?.relationship}</Text><Text style={s.phone}>{contact?.phone}</Text></View>
    <TouchableOpacity onPress={() => onDelete?.(contact)}><Ionicons name="trash-outline" size={20} color="#F44336" /></TouchableOpacity>
  </TouchableOpacity>
);
const s = StyleSheet.create({c:{flexDirection:'row',alignItems:'center',backgroundColor:'#FFF',padding:16,borderRadius:12,marginBottom:8,elevation:2},avatar:{width:48,height:48,borderRadius:24,backgroundColor:'#4A90D9',alignItems:'center',justifyContent:'center'},info:{flex:1,marginLeft:12},name:{fontSize:16,fontWeight:'600'},rel:{fontSize:13,color:'#888',marginTop:2},phone:{fontSize:13,color:'#4A90D9',marginTop:2}});
export default TrustedContactCard;
