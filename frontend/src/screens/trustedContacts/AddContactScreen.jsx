import React from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { useAppTheme } from '../../styles/ThemeContext';
import AddTrustedContactForm from '../../components/trustedContacts/AddTrustedContactForm';
import { addContact } from '../../redux/slices/trustedContactSlice';

const AddContactScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { colors } = useAppTheme();
  return (
    <ScrollView style={[s.c, { backgroundColor: colors.background }]}>
      <AddTrustedContactForm onSubmit={async (data) => {
        const r = await dispatch(addContact(data));
        if (!r.error) { Alert.alert('Success', 'Contact added'); navigation.goBack(); }
      }} />
    </ScrollView>
  );
};
const s = StyleSheet.create({ c: { flex: 1 } });
export default AddContactScreen;
