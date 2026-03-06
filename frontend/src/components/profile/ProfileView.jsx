import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/theme';
const ProfileView = ({ user }) => {
  const { colors } = useAppTheme();
  return (
  <View style={[s.c, { backgroundColor: colors.card }]}>
    <View style={[s.avatar, { backgroundColor: colors.primary }]}>{user?.profilePicture ? <Image source={{uri:user.profilePicture}} style={s.img}/> : <Ionicons name="person" size={48} color="#FFF" />}</View>
    <Text style={[s.name, { color: colors.text }]}>{user?.fullName || 'User'}</Text>
    <Text style={[s.email, { color: colors.textSecondary }]}>{user?.email || ''}</Text>
    <Text style={[s.phone, { color: colors.textSecondary }]}>{user?.phone || ''}</Text>
  </View>
  );
};
const s = StyleSheet.create({c:{alignItems:'center',padding:24,borderRadius:16,elevation:2},avatar:{width:96,height:96,borderRadius:48,alignItems:'center',justifyContent:'center',marginBottom:12},img:{width:96,height:96,borderRadius:48},name:{fontSize:22,fontWeight:'700'},email:{fontSize:14,marginTop:4},phone:{fontSize:14,marginTop:2}});
export default ProfileView;
