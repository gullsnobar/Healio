import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MedicationCard from './MedicationCard';

const PRIMARY = '#4A90D9';

const EmptyState = () => (
  <View style={styles.emptyContainer}>
    <View style={styles.emptyIcon}>
      <Ionicons name="medkit-outline" size={56} color="#ccc" />
    </View>
    <Text style={styles.emptyTitle}>No Medications</Text>
    <Text style={styles.emptySubtitle}>
      You haven't added any medications yet.{'\n'}Tap the + button to get started.
    </Text>
  </View>
);

const MedicationList = ({
  medications = [],
  onItemPress,
  onMarkTaken,
  loading = false,
  onRefresh,
}) => {
  if (loading && medications.length === 0) {
    return (
      <View style={styles.loaderWrap}>
        <ActivityIndicator size="large" color={PRIMARY} />
      </View>
    );
  }

  return (
    <FlatList
      data={medications}
      keyExtractor={(item) => item.id?.toString() ?? item.name}
      renderItem={({ item }) => (
        <MedicationCard
          medication={item}
          onPress={onItemPress}
          onMarkTaken={onMarkTaken}
        />
      )}
      contentContainerStyle={[
        styles.list,
        medications.length === 0 && styles.emptyList,
      ]}
      ListEmptyComponent={<EmptyState />}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            tintColor={PRIMARY}
            colors={[PRIMARY]}
          />
        ) : undefined
      }
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  loaderWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default MedicationList;
