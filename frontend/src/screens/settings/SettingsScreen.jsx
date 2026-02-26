import React from 'react';
import { ScrollView, TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen = ({ navigation }) => (
  <ScrollView style={s.c}>
    {[['notifications-outline','Notification Settings','NotificationSettings'],['lock-closed-outline','Privacy Settings','PrivacySettings'],['people-outline','Trusted Contacts','TrustedContacts'],['information-circle-outline','About HEALIO','About']].map(([icon,label,route])=>(
      <TouchableOpacity key={route} style={s.item} onPress={() => navigation.navigate(route)}>
        <Ionicons name={icon} size={22} color="#4A90D9" />
        <Text style={s.label}>{label}</Text>
        <Ionicons name="chevron-forward" size={18} color="#CCC" />
      </TouchableOpacity>
    ))}
  </ScrollView>
);
const s = StyleSheet.create({c:{flex:1,backgroundColor:'#F5F7FA',padding:16},item:{flexDirection:'row',alignItems:'center',backgroundColor:'#FFF',padding:16,borderRadius:8,marginBottom:8,elevation:1},label:{flex:1,fontSize:16,marginLeft:12,color:'#333'}});
export default SettingsScreen;
