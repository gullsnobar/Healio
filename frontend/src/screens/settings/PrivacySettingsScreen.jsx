import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';
import PrivacySettings from '../../components/profile/PrivacySettings';
import { notificationAPI } from '../../services/api/notificationAPI';
import { locationService } from '../../services/location/locationService';

const PrivacySettingsScreen = () => {
  const { colors } = useAppTheme();
  const [settings, setSettings] = useState({
    shareWithContacts: true,
    dataCollection: true,
    locationTracking: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await notificationAPI.getSettings();
        const data = res.data?.data;
        const priv = data?.privacySettings || {};
        setSettings((prev) => ({
          shareWithContacts: priv.shareWithContacts ?? prev.shareWithContacts,
          dataCollection: priv.dataCollection ?? prev.dataCollection,
          locationTracking: priv.locationTracking ?? prev.locationTracking,
        }));
      } catch {
        // keep defaults
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleUpdate = useCallback(
    async (next) => {
      const prev = settings;
      setSettings(next);
      try {
        if (!prev.locationTracking && next.locationTracking) {
          const granted = await locationService.requestPermission();
          if (!granted) {
            const reverted = { ...next, locationTracking: false };
            setSettings(reverted);
            await notificationAPI.updatePrivacy(reverted);
            Alert.alert('Location Permission', 'Location access is required to enable tracking.');
            return;
          }
        }
        await notificationAPI.updatePrivacy(next);
      } catch {
        setSettings(prev);
        Alert.alert('Error', 'Failed to update privacy settings.');
      }
    },
    [settings],
  );

  return (
    <ScrollView
      style={[s.c, { backgroundColor: colors.background }]}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Info banner */}
      <View style={[s.banner, { backgroundColor: colors.primary + '12', borderColor: colors.primary + '30' }]}>
        <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
        <Text style={[s.bannerText, { color: colors.textSecondary }]}>
          Your privacy is important. These settings control how your data is shared within the app.
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : (
        <PrivacySettings settings={settings} onUpdate={handleUpdate} disabled={loading} />
      )}
    </ScrollView>
  );
};

const s = StyleSheet.create({
  c: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
  },
  bannerText: { flex: 1, fontSize: 13, lineHeight: 19 },
});

export default PrivacySettingsScreen;
