import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useAppTheme } from '../../styles/ThemeContext';
import ChatInterface from '../../components/chatbot/ChatInterface';
import { sendMessage, fetchSuggestions, loadChatHistory } from '../../redux/slices/chatbotSlice';

const ChatbotScreen = () => {
  const { colors } = useAppTheme();
  const dispatch = useDispatch();
  const { messages, suggestions, loading, sessionId } = useSelector((state) => state.chatbot);
  
  useEffect(() => { 
    dispatch(loadChatHistory());
    dispatch(fetchSuggestions()); 
  }, [dispatch]);

  const handleSendMessage = (text) => {
    dispatch(sendMessage({ message: text, sessionId, context: 'general' }));
  };

  return (
    <View style={[s.c, { backgroundColor: colors.background }]}>
      <ChatInterface messages={messages} suggestions={suggestions} loading={loading}
        onSend={handleSendMessage} />
    </View>
  );
};

const s = StyleSheet.create({ c: { flex: 1 } });
export default ChatbotScreen;
