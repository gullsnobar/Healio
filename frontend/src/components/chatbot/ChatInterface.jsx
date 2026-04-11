import React, { useState, useRef } from 'react';
import { View, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useAppTheme } from '../../styles/ThemeContext';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ChatSuggestions from './ChatSuggestions';

const ChatInterface = ({ messages = [], onSend, suggestions = [], loading = false }) => {
  const { colors } = useAppTheme();
  const listRef = useRef(null);
  
  // Generate stable key for messages
  const getMessageKey = (item, index) => {
    if (item._id) return item._id;
    // Fallback: use combination of role, timestamp, and index for stable key
    const timestamp = item.timestamp || '';
    return `${item.role}-${timestamp}-${index}`;
  };
  
  return (
    <KeyboardAvoidingView style={[s.c, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <FlatList ref={listRef} data={messages} keyExtractor={getMessageKey}
        renderItem={({ item }) => <ChatMessage message={item} />}
        onContentSizeChange={() => listRef.current?.scrollToEnd()} contentContainerStyle={s.list} />
      {suggestions.length > 0 && <ChatSuggestions suggestions={suggestions} onSelect={onSend} />}
      <ChatInput onSend={onSend} loading={loading} />
    </KeyboardAvoidingView>
  );
};
const s = StyleSheet.create({c:{flex:1},list:{padding:16,paddingBottom:8}});
export default ChatInterface;
