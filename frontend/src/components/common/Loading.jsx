import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const PRIMARY = '#4A90D9';

const Loading = ({ message, color = PRIMARY, size = 'large', style }) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
      {!!message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  message: {
    marginTop: 16,
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
  },
});

export default Loading;
