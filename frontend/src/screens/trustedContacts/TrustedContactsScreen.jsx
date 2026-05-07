import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAppTheme } from '../../styles/ThemeContext';
import TrustedContactList from '../../components/trustedContacts/TrustedContactList';
import { fetchContacts, deleteContact } from '../../redux/slices/trustedContactSlice';
import Tooltip from '../../components/common/Tooltip';

const TrustedContactsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { contacts, loading } = useSelector((state) => state.trustedContact);
  const { colors } = useAppTheme();
  useEffect(() => { dispatch(fetchContacts()); }, [dispatch]);
  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchContacts());
    }, [dispatch]),
  );
  return (
    <View style={[s.c, { backgroundColor: colors.background }]}>
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
const s = StyleSheet.create({c:{flex:1},fab:{position:'absolute',right:20,bottom:20,width:56,height:56,borderRadius:28,alignItems:'center',justifyContent:'center',elevation:4}});
export default TrustedContactsScreen;
