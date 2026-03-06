import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/theme';
const AccountSettings = ({ onChangePassword, onDeleteAccount, onLogout }) => {
  const { colors } = useAppTheme();
  return (
  <View style={[s.c, { backgroundColor: colors.card }]}>
    {[['key-outline','Change Password',onChangePassword,colors.primary],['log-out-outline','Logout',onLogout,'#FF9800'],['trash-outline','Delete Account',()=>Alert.alert('Delete Account','This action is permanent.',[{text:'Cancel'},{text:'Delete',style:'destructive',onPress:onDeleteAccount}]),colors.error]].map(([icon,label,action,color])=>(
      <TouchableOpacity key={label} style={[s.item, { borderBottomColor: colors.borderLight }]} onPress={action}><Ionicons name={icon} size={22} color={color} /><Text style={[s.t,{color}]}>{label}</Text></TouchableOpacity>
    ))}
  </View>
  );
};
const s = StyleSheet.create({c:{borderRadius:12,padding:8},item:{flexDirection:'row',alignItems:'center',gap:12,padding:14,borderBottomWidth:1},t:{fontSize:16,fontWeight:'500'}});
export default AccountSettings;
