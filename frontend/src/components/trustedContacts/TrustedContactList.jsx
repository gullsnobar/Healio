import React from 'react';
import { FlatList, Text, StyleSheet, View } from 'react-native';
import TrustedContactCard from './TrustedContactCard';
import { useAppTheme } from '../../styles/ThemeContext';

const TrustedContactList = ({
  contacts = [],
  onItemPress,
  onDelete,
  loading,
}) => {
  const { colors } = useAppTheme();

  const renderItem = ({ item }) => (
    <TrustedContactCard
      contact={item}
      onPress={onItemPress}
      onDelete={onDelete}
    />
  );

  const keyExtractor = (item, index) =>
    item?._id ? item._id.toString() : index.toString();

  return (
    <FlatList
      data={contacts}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      extraData={contacts}
      contentContainerStyle={s.container}
      ListEmptyComponent={
        !loading && (
          <Text style={[s.emptyText, { color: colors?.textSecondary || '#888' }]}>
            No trusted contacts added
          </Text>
        )
      }
    />
  );
};

const s = StyleSheet.create({
  container: {
    padding: 16,
  },
  emptyText: {
    textAlign: 'center',
    padding: 40,
  },
});

export default TrustedContactList;