import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useAppTheme } from '../../styles/ThemeContext';
import ChatInterface from '../../components/chatbot/ChatInterface';
import { sendMessage, fetchSuggestions, clearError } from '../../redux/slices/chatbotSlice';

const ChatbotScreen = () => {
  const { colors } = useAppTheme();
  const dispatch = useDispatch();
  const { messages, suggestions, loading, sessionId, error } = useSelector((state) => state.chatbot);
  
  // Fetch suggestions on mount
  useEffect(() => { 
    dispatch(fetchSuggestions()); 
  }, [dispatch]);

  // Auto-clear error after 4 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  // Memoized send handler to prevent recreation on every render
  const handleSendMessage = useCallback((text) => {
    dispatch(sendMessage({ message: text, sessionId, context: 'general' }));
  }, [dispatch, sessionId]);

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <ChatInterface 
        messages={messages} 
        suggestions={suggestions} 
        loading={loading}
        error={error}
        onSend={handleSendMessage} 
      />
    </View>
  );
};

const s = StyleSheet.create({ 
  container: { flex: 1 } 
});

export default ChatbotScreen;
