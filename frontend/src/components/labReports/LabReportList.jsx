import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LabReportCard from './LabReportCard';

const PRIMARY_COLOR = '#4A90D9';

const FILTER_TABS = [
  { key: 'all', label: 'All' },
  { key: 'blood', label: 'Blood' },
  { key: 'xray', label: 'X-Ray' },
  { key: 'mri', label: 'MRI' },
  { key: 'other', label: 'Other' },
];

const EmptyState = () => (
  <View style={styles.emptyContainer}>
    <Ionicons name="document-text-outline" size={64} color="#ccc" />
    <Text style={styles.emptyTitle}>No Lab Reports</Text>
    <Text style={styles.emptySubtitle}>
      No reports match the selected filter.
    </Text>
  </View>
);

const LabReportList = ({ reports = [], onItemPress, loading = false }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredReports = useMemo(() => {
    if (activeFilter === 'all') return reports;
    return reports.filter((r) => r.type === activeFilter);
  }, [reports, activeFilter]);

  if (loading && reports.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        <Text style={styles.loadingText}>Loading reports...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
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
                style={[styles.filterTab, isActive && styles.filterTabActive]}
                onPress={() => setActiveFilter(item.key)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
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
        ListEmptyComponent={<EmptyState />}
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
    backgroundColor: '#f0f0f0',
  },
  filterTabActive: {
    backgroundColor: PRIMARY_COLOR,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
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

export default LabReportList;
