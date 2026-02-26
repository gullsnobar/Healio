import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
const ProfilePictureUpload = ({ imageUri, onPick }) => (
  <TouchableOpacity style={s.c} onPress={onPick}>
    {imageUri ? <Image source={{uri:imageUri}} style={s.img}/> : <View style={s.placeholder}><Ionicons name="camera-outline" size={32} color="#888" /><Text style={s.t}>Upload Photo</Text></View>}
  </TouchableOpacity>
);
const s = StyleSheet.create({c:{alignItems:'center',marginVertical:16},img:{width:120,height:120,borderRadius:60},placeholder:{width:120,height:120,borderRadius:60,backgroundColor:'#F0F0F0',alignItems:'center',justifyContent:'center'},t:{fontSize:12,color:'#888',marginTop:4}});
export default ProfilePictureUpload;
