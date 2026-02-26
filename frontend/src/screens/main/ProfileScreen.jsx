import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import ProfileView from '../../components/profile/ProfileView';
import AccountSettings from '../../components/profile/AccountSettings';

const ProfileScreen = ({ navigation }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <ScrollView style={s.c}>
      <ProfileView user={user} />
      <AccountSettings
        onChangePassword={() => navigation.navigate('ChangePassword')}
        onDeleteAccount={() => {}}
        onLogout={() => {}}
      />
    </ScrollView>
  );
};

const s = StyleSheet.create({ c: { flex: 1, backgroundColor: '#F5F7FA', padding: 16 } });
export default ProfileScreen;
