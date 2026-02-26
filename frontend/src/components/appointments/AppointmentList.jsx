import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppointmentCard from './AppointmentCard';

const PRIMARY_COLOR = '#4A90D9';

const EmptyState = () => (
  <View style={styles.emptyContainer}>
    <Ionicons name="calendar-outline" size={64} color="#ccc" />
    <Text style={styles.emptyTitle}>No Appointments</Text>
    <Text style={styles.emptySubtitle}>
      You don't have any appointments scheduled yet.
    </Text>
  </View>
);

const AppointmentList = ({ appointments = [], onItemPress, loading = false, onRefresh }) => {
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  if (loading && appointments.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        <Text style={styles.loadingText}>Loading appointments...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={appointments}
      keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
      renderItem={({ item }) => (
        <AppointmentCard appointment={item} onPress={onItemPress} />
      )}
      ListEmptyComponent={<EmptyState />}
      contentContainerStyle={appointments.length === 0 ? styles.emptyList : styles.list}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[PRIMARY_COLOR]}
            tintColor={PRIMARY_COLOR}
          />
        ) : undefined
      }
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingVertical: 8,
  },
  emptyList: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#888',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});

export default AppointmentList;
