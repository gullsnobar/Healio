import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LabReportCard from './LabReportCard';
import { useAppTheme } from '../../styles/ThemeContext';

const FILTER_TABS = [
  { key: 'all', label: 'All' },
  { key: 'blood', label: 'Blood' },
  { key: 'xray', label: 'X-Ray' },
  { key: 'mri', label: 'MRI' },
  { key: 'other', label: 'Other' },
];

const EmptyState = ({ colors }) => (
  <View style={styles.emptyContainer}>
    <Ionicons name="document-text-outline" size={64} color={colors.textTertiary} />
    <Text style={[styles.emptyTitle, { color: colors.text }]}>No Lab Reports</Text>
    <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
      No reports match the selected filter.
    </Text>
  </View>
);

const LabReportList = ({ reports = [], onItemPress, loading = false }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const { colors } = useAppTheme();

  const filteredReports = useMemo(() => {
    if (activeFilter === 'all') return reports;
    return reports.filter((r) => r.type === activeFilter);
  }, [reports, activeFilter]);

  if (loading && reports.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading reports...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filter Tabs */}
      <View style={[styles.filterContainer, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <FlatList
          data={FILTER_TABS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => {
            const isActive = item.key === activeFilter;
            return (
              <TouchableOpacity
                style={[styles.filterTab, { backgroundColor: colors.cardAlt }, isActive && { backgroundColor: colors.primary }]}
                onPress={() => setActiveFilter(item.key)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterText, { color: colors.textSecondary }, isActive && styles.filterTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* List */}
      <FlatList
        data={filteredReports}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <LabReportCard report={item} onPress={onItemPress} />
        )}
        ListEmptyComponent={<EmptyState colors={colors} />}
        contentContainerStyle={filteredReports.length === 0 ? styles.emptyList : styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    borderBottomWidth: 1,
  },
  filterList: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
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

export default LabReportList;
