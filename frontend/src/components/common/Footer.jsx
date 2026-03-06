import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../styles/ThemeContext';

const Footer = ({ text, style }) => {
  const { colors } = useAppTheme();
  const year = new Date().getFullYear();

  return (
    <View style={[styles.container, { borderTopColor: colors.border }, style]}>
      <Text style={[styles.text, { color: colors.textTertiary }]}>
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
  },
  text: {
    fontSize: 13,
  },
});

export default Footer;
