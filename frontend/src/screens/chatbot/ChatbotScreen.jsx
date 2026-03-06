import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useAppTheme } from '../../styles/ThemeContext';
import ChatInterface from '../../components/chatbot/ChatInterface';
import { sendMessage, fetchSuggestions } from '../../redux/slices/chatbotSlice';

const ChatbotScreen = () => {
  const { colors } = useAppTheme();
  const dispatch = useDispatch();
  const { messages, suggestions, loading } = useSelector((state) => state.chatbot);
  useEffect(() => { dispatch(fetchSuggestions()); }, []);

  return (
    <View style={[s.c, { backgroundColor: colors.background }]}>
      <ChatInterface messages={messages} suggestions={suggestions} loading={loading}
        onSend={(text) => dispatch(sendMessage(text))} />
    </View>
  );
};
const s = StyleSheet.create({ c: { flex: 1 } });
export default ChatbotScreen;
