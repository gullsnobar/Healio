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
    borderBottomLeftRadius: 4,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
    } : {
      elevation: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
    }),
  }), []);

  return (
    <View style={[s.row, isUser && s.rowUser]}>
      {!isUser && (
        <View style={[s.avatarBot, { backgroundColor: colors.aiBot }]}>
          <Ionicons name="medical" size={18} color={colors.aiBotIcon} />
        </View>
      )}
      <View style={[s.bubble, isUser ? [s.user, { backgroundColor: colors.primary }] : [s.bot, botBubbleStyle, { backgroundColor: colors.card }]]}>
        <Text style={[s.text, { color: colors.text }, isUser && s.userText]}>{message.content || message.text}</Text>
        {formattedTime && (
          <Text style={[s.time, isUser && s.timeUser, !isUser && { color: colors.textTertiary }]}>
            {formattedTime}
          </Text>
        )}
      </View>
      {isUser && (
        <View style={[s.avatarUser, { backgroundColor: colors.primary }]}>
          <Ionicons name="person" size={16} color="#FFF" />
        </View>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 8 },
  rowUser: { justifyContent: 'flex-end' },
  avatarBot: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 8, marginBottom: 2 },
  avatarUser: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginLeft: 8, marginBottom: 2 },
  bubble: { maxWidth: '75%', padding: 12, borderRadius: 16 },
  user: { borderBottomRightRadius: 4 },
  bot: { borderBottomLeftRadius: 4 },
  text: { fontSize: 15, lineHeight: 22 },
  userText: { color: '#FFF' },
  time: { fontSize: 10, marginTop: 4, alignSelf: 'flex-end' },
  timeUser: { color: 'rgba(255,255,255,0.7)' },
});

export default ChatMessage;
