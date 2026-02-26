import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GoogleFitSync = ({ lastSynced, onSync }) => {
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try { await onSync?.(); } finally { setSyncing(false); }
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Ionicons name="logo-google" size={24} color="#4285F4" />
        <View style={styles.info}>
          <Text style={styles.title}>Google Fit</Text>
          <Text style={styles.subtitle}>{lastSynced ? `Last synced: ${lastSynced}` : 'Not synced yet'}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.syncBtn} onPress={handleSync} disabled={syncing}>
        {syncing ? <ActivityIndicator color="#FFF" size="small" /> : <Text style={styles.syncText}>Sync Now</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, elevation: 2, marginVertical: 8 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  info: { marginLeft: 12 },
  title: { fontSize: 16, fontWeight: '600', color: '#333' },
  subtitle: { fontSize: 12, color: '#888', marginTop: 2 },
  syncBtn: { backgroundColor: '#4285F4', padding: 12, borderRadius: 8, alignItems: 'center' },
  syncText: { color: '#FFF', fontWeight: '600' },
});

export default GoogleFitSync;
