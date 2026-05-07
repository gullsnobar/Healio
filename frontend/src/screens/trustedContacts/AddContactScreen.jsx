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
        try {
          await dispatch(addContact(data)).unwrap();
          Alert.alert('Success', 'Contact added');
          navigation.goBack();
        } catch (err) {
          const msg = typeof err === 'string'
            ? err
            : err?.message || err?.response?.data?.message || 'Failed to add contact';
          Alert.alert('Add Contact', msg);
        }
      }} />
    </ScrollView>
  );
};
const s = StyleSheet.create({ c: { flex: 1 } });
export default AddContactScreen;
