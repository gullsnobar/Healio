import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';
const ProfilePictureUpload = ({ imageUri, onPick }) => {
  const { colors } = useAppTheme();
  return (
  <TouchableOpacity style={s.c} onPress={onPick}>
    {imageUri ? <Image source={{uri:imageUri}} style={s.img}/> : <View style={[s.placeholder, { backgroundColor: colors.borderLight }]}><Ionicons name="camera-outline" size={32} color={colors.textSecondary} /><Text style={[s.t, { color: colors.textSecondary }]}>Upload Photo</Text></View>}
  </TouchableOpacity>
  );
};
const s = StyleSheet.create({c:{alignItems:'center',marginVertical:16},img:{width:120,height:120,borderRadius:60},placeholder:{width:120,height:120,borderRadius:60,alignItems:'center',justifyContent:'center'},t:{fontSize:12,marginTop:4}});
export default ProfilePictureUpload;
