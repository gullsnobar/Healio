import React from 'react';
import { ScrollView, StyleSheet, View, Text, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import ProfileView from '../../components/profile/ProfileView';
import AccountSettings from '../../components/profile/AccountSettings';

const INITIALS = (user) => {
  if (!user) return 'U';
  const n = user.firstName || user.name || 'U';
  return n.charAt(0).toUpperCase();
};

const ProfileScreen = ({ navigation }) => {
  const { user } = useSelector((state) => state.auth);
  const name = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (user?.name || 'User');
  const email = user?.email || '';

  return (
    <ScrollView style={ps.c} contentContainerStyle={ps.content} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#1D4ED8" />
      <LinearGradient colors={['#1D4ED8', '#7C3AED']} style={ps.gradHdr}>
        <View style={ps.avatarCircle}>
          <Text style={ps.avatarText}>{INITIALS(user)}</Text>
        </View>
        <Text style={ps.name}>{name}</Text>
        <Text style={ps.email}>{email}</Text>
      </LinearGradient>

      <View style={ps.body}>
        <ProfileView user={user} />
        <AccountSettings
          onChangePassword={() => navigation.navigate('ChangePassword')}
          onDeleteAccount={() => {}}
          onLogout={() => {}}
        />
      </View>
    </ScrollView>
  );
};

const ps = StyleSheet.create({
  c: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { paddingBottom: 32 },
  gradHdr: {
    paddingTop: 20, paddingBottom: 36, alignItems: 'center',
    borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
  },
  avatarCircle: {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)',
    marginBottom: 14,
  },
  avatarText: { fontSize: 36, fontWeight: '800', color: '#fff' },
  name: { fontSize: 20, fontWeight: '800', color: '#fff', letterSpacing: -0.3 },
  email: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  body: { paddingHorizontal: 16, paddingTop: 20 },
});
export default ProfileScreen;
