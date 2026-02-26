import React from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import AddTrustedContactForm from '../../components/trustedContacts/AddTrustedContactForm';
import { addContact } from '../../redux/slices/trustedContactSlice';

const AddContactScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  return (
    <ScrollView style={s.c}>
      <AddTrustedContactForm onSubmit={async (data) => {
        const r = await dispatch(addContact(data));
        if (!r.error) { Alert.alert('Success', 'Contact added'); navigation.goBack(); }
      }} />
    </ScrollView>
  );
};
const s = StyleSheet.create({ c: { flex: 1, backgroundColor: '#F5F7FA' } });
export default AddContactScreen;
