import React from 'react';
import { FlatList, Text, StyleSheet } from 'react-native';
import TrustedContactCard from './TrustedContactCard';
import { useAppTheme } from '../../styles/theme';
const TrustedContactList = ({ contacts = [], onItemPress, onDelete, loading }) => {
  const { colors } = useAppTheme();
  return (
  <FlatList data={contacts} keyExtractor={(i) => i._id} renderItem={({ item }) => <TrustedContactCard contact={item} onPress={onItemPress} onDelete={onDelete} />}
    ListEmptyComponent={<Text style={[s.e, { color: colors.textSecondary }]}>No trusted contacts added</Text>} contentContainerStyle={s.c} />
  );
};
const s = StyleSheet.create({c:{padding:16},e:{textAlign:'center',padding:40}});
export default TrustedContactList;
