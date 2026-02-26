import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = '#4A90D9';

const Header = ({
  title,
  onBackPress,
  rightIcon,
  onRightPress,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.left}>
        {onBackPress ? (
          <TouchableOpacity onPress={onBackPress} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={24} color={PRIMARY} />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconPlaceholder} />
        )}
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <View style={styles.right}>
        {rightIcon && onRightPress ? (
          <TouchableOpacity onPress={onRightPress} style={styles.iconBtn}>
            <Ionicons name={rightIcon} size={24} color={PRIMARY} />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconPlaceholder} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  left: {
    width: 40,
    alignItems: 'flex-start',
  },
  right: {
    width: 40,
    alignItems: 'flex-end',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  iconBtn: {
    padding: 4,
  },
  iconPlaceholder: {
    width: 32,
  },
});

export default Header;
