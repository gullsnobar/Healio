import React, { memo, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';

const ChatMessage = memo(({ message }) => {
  const { colors } = useAppTheme();
  const isUser = message.role === 'user';

  // Memoize styles based on message role
  const containerStyle = useMemo(() => [
    s.row,
    isUser && s.rowUser
  ], [isUser]);

  const avatarStyle = useMemo(() => [
    isUser ? s.avatarUser : s.avatarBot,
    { backgroundColor: isUser ? colors.primary : colors.aiBot }
  ], [isUser, colors.primary, colors.aiBot]);

  const bubbleStyle = useMemo(() => [
    s.bubble,
    isUser ? [s.user, { backgroundColor: colors.primary }] : [s.bot, { backgroundColor: colors.card }]
  ], [isUser, colors.primary, colors.card]);

  const textStyle = useMemo(() => [
    s.text,
    { color: colors.text },
    isUser && s.userText
  ], [isUser, colors.text]);

  const timeStyle = useMemo(() => [
    s.time,
    isUser && s.timeUser,
    !isUser && { color: colors.textTertiary }
  ], [isUser, colors.textTertiary]);

  return (
    <View style={containerStyle}>
      {!isUser && (
        <View style={avatarStyle}>
          <Ionicons name="medical" size={18} color={colors.aiBotIcon} />
        </View>
      )}
      <View style={bubbleStyle}>
        <Text style={textStyle}>{message.content}</Text>
        {message.timestamp && (
          <Text style={timeStyle}>{message.timestamp}</Text>
        )}
      </View>
      {isUser && (
        <View style={avatarStyle}>
          <Ionicons name="person" size={16} color="#FFF" />
        </View>
      )}
    </View>
  );
}, (prevProps, nextProps) => {
  // Only re-render if message content changed
  return (
    prevProps.message._id === nextProps.message._id &&
    prevProps.message.content === nextProps.message.content &&
    prevProps.message.timestamp === nextProps.message.timestamp
  );
});

ChatMessage.displayName = 'ChatMessage';

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 8 },
  rowUser: { justifyContent: 'flex-end' },
  avatarBot: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 8, marginBottom: 2 },
  avatarUser: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginLeft: 8, marginBottom: 2 },
  bubble: { maxWidth: '75%', padding: 12, borderRadius: 16 },
  user: { borderBottomRightRadius: 4 },
  bot: { borderBottomLeftRadius: 4, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
  text: { fontSize: 15, lineHeight: 22 },
  userText: { color: '#FFF' },
  time: { fontSize: 10, marginTop: 4, alignSelf: 'flex-end' },
  timeUser: { color: 'rgba(255,255,255,0.7)' },
});

export default ChatMessage;
