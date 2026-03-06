import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppointmentCard from './AppointmentCard';
import { useAppTheme } from '../../styles/ThemeContext';

const EmptyState = ({ colors }) => (
  <View style={styles.emptyContainer}>
    <Ionicons name="calendar-outline" size={64} color={colors.textTertiary} />
    <Text style={[styles.emptyTitle, { color: colors.text }]}>No Appointments</Text>
    <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
      You don't have any appointments scheduled yet.
    </Text>
  </View>
);

const AppointmentList = ({ appointments = [], onItemPress, loading = false, onRefresh }) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const { colors } = useAppTheme();

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
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading appointments...</Text>
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
      ListEmptyComponent={<EmptyState colors={colors} />}
      contentContainerStyle={appointments.length === 0 ? styles.emptyList : styles.list}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
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
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});

export default AppointmentList;
