import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { useAppTheme } from '../../styles/ThemeContext';

const Card = ({
  children,
  title,
  elevation = 2,
  onPress,
  style,
  contentStyle,
}) => {
  const { colors } = useAppTheme();
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
      style={[
        styles.card,
        { elevation, shadowOpacity: elevation * 0.06, backgroundColor: colors.card },
        style,
      ]}
    >
      {!!title && (
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        </View>
      )}
      <View style={[styles.content, contentStyle]}>{children}</View>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  header: {
    marginBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
  content: {},
});

export default Card;
