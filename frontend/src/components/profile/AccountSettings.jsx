import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
const AccountSettings = ({ onChangePassword, onDeleteAccount, onLogout }) => (
  <View style={s.c}>
    {[['key-outline','Change Password',onChangePassword,'#4A90D9'],['log-out-outline','Logout',onLogout,'#FF9800'],['trash-outline','Delete Account',()=>Alert.alert('Delete Account','This action is permanent.',[{text:'Cancel'},{text:'Delete',style:'destructive',onPress:onDeleteAccount}]),'#F44336']].map(([icon,label,action,color])=>(
      <TouchableOpacity key={label} style={s.item} onPress={action}><Ionicons name={icon} size={22} color={color} /><Text style={[s.t,{color}]}>{label}</Text></TouchableOpacity>
    ))}
  </View>
);
const s = StyleSheet.create({c:{backgroundColor:'#FFF',borderRadius:12,padding:8},item:{flexDirection:'row',alignItems:'center',gap:12,padding:14,borderBottomWidth:1,borderBottomColor:'#F0F0F0'},t:{fontSize:16,fontWeight:'500'}});
export default AccountSettings;
