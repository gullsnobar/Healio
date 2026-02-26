import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
const ProfileView = ({ user }) => (
  <View style={s.c}>
    <View style={s.avatar}>{user?.profilePicture ? <Image source={{uri:user.profilePicture}} style={s.img}/> : <Ionicons name="person" size={48} color="#FFF" />}</View>
    <Text style={s.name}>{user?.fullName || 'User'}</Text>
    <Text style={s.email}>{user?.email || ''}</Text>
    <Text style={s.phone}>{user?.phone || ''}</Text>
  </View>
);
const s = StyleSheet.create({c:{alignItems:'center',padding:24,backgroundColor:'#FFF',borderRadius:16,elevation:2},avatar:{width:96,height:96,borderRadius:48,backgroundColor:'#4A90D9',alignItems:'center',justifyContent:'center',marginBottom:12},img:{width:96,height:96,borderRadius:48},name:{fontSize:22,fontWeight:'700'},email:{fontSize:14,color:'#888',marginTop:4},phone:{fontSize:14,color:'#888',marginTop:2}});
export default ProfileView;
