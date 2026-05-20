import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';

const ChatMessage = ({ message }) => {
  const { colors } = useAppTheme();
  const isUser = message.role === 'user';
  const formattedTime = useMemo(() => {
    if (!message.timestamp) return null;
    const date = new Date(message.timestamp);
    if (Number.isNaN(date.getTime())) {
      return typeof message.timestamp === 'string' ? message.timestamp : null;
    }
    const now = new Date();
    const isSameDay =
      date.getFullYear() === now.getFullYear()
      && date.getMonth() === now.getMonth()
      && date.getDate() === now.getDate();
    const timePart = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    if (isSameDay) return timePart;
    const datePart = date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
    return `${datePart} ${timePart}`;
  }, [message.timestamp]);
  
  // Memoize styles to prevent unnecessary re-renders
  const botBubbleStyle = useMemo(() => ({
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 4px 18px rgba(15, 23, 42, 0.06)',
    } : {
      elevation: 2,
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.07,
      shadowRadius: 10,
    }),
  }), [colors.border]);

  const userBubbleStyle = useMemo(() => ({
    ...(Platform.OS === 'web' ? {
      boxShadow: `0 6px 18px ${colors.primary}40`,
    } : {
      elevation: 3,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.28,
      shadowRadius: 10,
    }),
  }), [colors.primary]);

  const avatarBotShadow = useMemo(() => (
    Platform.OS === 'web' ? {
      boxShadow: `0 4px 12px ${colors.primary}33`,
    } : {
      elevation: 2,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
    }
  ), [colors.primary]);

  return (
    <View style={[s.row, isUser && s.rowUser]}>
      {!isUser && (
        <View style={[s.avatarBot, { backgroundColor: colors.aiBot, borderColor: colors.primary + '22' }, avatarBotShadow]}>
          <Ionicons name="sparkles" size={16} color={colors.aiBotIcon} />
        </View>
      )}
      <View style={[s.bubble, isUser ? [s.user, userBubbleStyle, { backgroundColor: colors.primary }] : [s.bot, botBubbleStyle, { backgroundColor: colors.card }]]}>
        <Text style={[s.text, { color: colors.text }, isUser && s.userText]}>{message.content || message.text}</Text>
        {formattedTime && (
          <Text style={[s.time, isUser && s.timeUser, !isUser && { color: colors.textTertiary }]}>
            {formattedTime}
          </Text>
        )}
      </View>
      {isUser && (
        <View style={[s.avatarUser, { backgroundColor: colors.primary, borderColor: colors.primary + '33' }, avatarBotShadow]}>
          <Ionicons name="person" size={15} color="#FFF" />
        </View>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 14 },
  rowUser: { justifyContent: 'flex-end' },
  avatarBot: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', marginRight: 10, marginBottom: 2, borderWidth: 1 },
  avatarUser: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginLeft: 10, marginBottom: 2, borderWidth: 1 },
  bubble: { maxWidth: '78%', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 22 },
  user: { borderBottomRightRadius: 6 },
  bot: { borderBottomLeftRadius: 6 },
  text: { fontSize: 15, lineHeight: 22, fontWeight: '400', letterSpacing: 0.1 },
  userText: { color: '#FFF', fontWeight: '500' },
  time: { fontSize: 10, marginTop: 6, alignSelf: 'flex-end', fontWeight: '500', letterSpacing: 0.3 },
  timeUser: { color: 'rgba(255,255,255,0.75)' },
});

export default ChatMessage;
