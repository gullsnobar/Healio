import React from 'react';
import { ScrollView, TouchableOpacity, Text, View, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';
import Tooltip from '../../components/common/Tooltip';

const { width: SCREEN_W } = Dimensions.get('window');
const IS_SMALL = SCREEN_W < 400;

const SettingsScreen = ({ navigation }) => {
  const { colors } = useAppTheme();
  return (
    <ScrollView style={[s.c, { backgroundColor: colors.background }]}>
      {[['alarm-outline','Reminders','Reminders','Manage'],['notifications-outline','Notification Settings','NotificationSettings','Configure'],['color-palette-outline','Appearance','Appearance','Theme'],['lock-closed-outline','Privacy Settings','PrivacySettings','Privacy'],['people-outline','Trusted Contacts','TrustedContacts','Contacts'],['information-circle-outline','About HEALIO','About','About']].map(([icon,label,route,tooltip])=>(
        <Tooltip key={route} text={tooltip}>
          <TouchableOpacity style={[s.item, { backgroundColor: colors.card }]} onPress={() => navigation.navigate(route)}>
            <Ionicons name={icon} size={22} color={colors.primary} />
            <Text style={[s.label, { color: colors.text }]}>{label}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        </Tooltip>
      ))}
    </ScrollView>
  );
};
const s = StyleSheet.create({
  c: { flex: 1, padding: IS_SMALL ? 12 : 16 },
  item: { flexDirection: 'row', alignItems: 'center', padding: IS_SMALL ? 14 : 16, borderRadius: 12, marginBottom: 8, elevation: 1 },
  label: { flex: 1, fontSize: IS_SMALL ? 15 : 16, marginLeft: 12 },
});
export default SettingsScreen;
