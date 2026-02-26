import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Footer = ({ text, style }) => {
  const year = new Date().getFullYear();

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>
        {text || `\u00A9 ${year} Healio. All rights reserved.`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E0E0E0',
  },
  text: {
    fontSize: 13,
    color: '#999',
  },
});

export default Footer;
