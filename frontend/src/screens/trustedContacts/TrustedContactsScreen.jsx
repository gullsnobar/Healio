import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';
import TrustedContactList from '../../components/trustedContacts/TrustedContactList';
import { fetchContacts, deleteContact } from '../../redux/slices/trustedContactSlice';
import Tooltip from '../../components/common/Tooltip';

const TrustedContactsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { contacts, loading } = useSelector((state) => state.trustedContact);
  const { colors } = useAppTheme();
  useEffect(() => { dispatch(fetchContacts()); }, []);
  return (
    <View style={[s.c, { backgroundColor: colors.background }]}>
      {/* Header with back button */}
      <View style={[s.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: colors.text }]}>Trusted Contacts</Text>
        <View style={s.headerSpacer} />
      </View>
      <TrustedContactList contacts={contacts} loading={loading}
        onItemPress={(c) => {}} onDelete={(c) => dispatch(deleteContact(c._id))} />
      <Tooltip text="Add contact">
        <TouchableOpacity style={[s.fab, { backgroundColor: colors.primary }]} onPress={() => navigation.navigate('AddContact')}>
          <Ionicons name="person-add" size={24} color="#FFF" />
        </TouchableOpacity>
      </Tooltip>
    </View>
  );
};
const s = StyleSheet.create({c:{flex:1},fab:{position:'absolute',right:20,bottom:20,width:56,height:56,borderRadius:28,alignItems:'center',justifyContent:'center',elevation:4},header:{flexDirection:'row',alignItems:'center',paddingHorizontal:16,paddingVertical:12,borderBottomWidth:1},backBtn:{padding:4},headerTitle:{fontSize:18,fontWeight:'700',flex:1,textAlign:'center'},headerSpacer:{width:32}});
export default TrustedContactsScreen;
