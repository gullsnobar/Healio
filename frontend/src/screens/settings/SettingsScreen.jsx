import React from 'react';
import { ScrollView, TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';

const SettingsScreen = ({ navigation }) => {
  const { colors } = useAppTheme();
  return (
    <ScrollView style={[s.c, { backgroundColor: colors.background }]}>
      {/* Header with back button */}
      <View style={[s.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: colors.text }]}>Settings</Text>
        <View style={s.headerSpacer} />
      </View>
      {[['alarm-outline','Reminders','Reminders'],['notifications-outline','Notification Settings','NotificationSettings'],['color-palette-outline','Appearance','Appearance'],['lock-closed-outline','Privacy Settings','PrivacySettings'],['people-outline','Trusted Contacts','TrustedContacts'],['information-circle-outline','About HEALIO','About']].map(([icon,label,route])=>(
        <TouchableOpacity key={route} style={[s.item, { backgroundColor: colors.card }]} onPress={() => navigation.navigate(route)}>
          <Ionicons name={icon} size={22} color={colors.primary} />
          <Text style={[s.label, { color: colors.text }]}>{label}</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};
const s = StyleSheet.create({c:{flex:1,padding:16},item:{flexDirection:'row',alignItems:'center',padding:16,borderRadius:12,marginBottom:8,elevation:1},label:{flex:1,fontSize:16,marginLeft:12},header:{flexDirection:'row',alignItems:'center',paddingHorizontal:16,paddingVertical:12,borderBottomWidth:1},backBtn:{padding:4},headerTitle:{fontSize:18,fontWeight:'700',flex:1,textAlign:'center'},headerSpacer:{width:32}});
export default SettingsScreen;
