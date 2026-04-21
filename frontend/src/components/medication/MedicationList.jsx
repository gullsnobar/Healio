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
import { useAppTheme } from '../../styles/ThemeContext';

const EmptyState = ({ colors }) => (
  <View style={styles.emptyContainer}>
    <View style={[styles.emptyIcon, { backgroundColor: colors.cardAlt }]}>
      <Ionicons name="medkit-outline" size={56} color={colors.textTertiary} />
    </View>
    <Text style={[styles.emptyTitle, { color: colors.text }]}>No Medications</Text>
    <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
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
  markingId,
}) => {
  const { colors } = useAppTheme();

  if (loading && medications.length === 0) {
    return (
      <View style={styles.loaderWrap}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={medications}
      keyExtractor={(item) => item._id?.toString() ?? item.id?.toString() ?? item.name}
      renderItem={({ item }) => (
        <MedicationCard
          medication={item}
          onPress={onItemPress}
          onMarkTaken={onMarkTaken}
          isMarking={markingId === item._id}
        />
      )}
      contentContainerStyle={[
        styles.list,
        medications.length === 0 && styles.emptyList,
      ]}
      ListEmptyComponent={<EmptyState colors={colors} />}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
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
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default MedicationList;
