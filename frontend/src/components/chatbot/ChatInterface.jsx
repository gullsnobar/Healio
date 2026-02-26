import React, { useState, useRef } from 'react';
import { View, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ChatSuggestions from './ChatSuggestions';

const ChatInterface = ({ messages = [], onSend, suggestions = [], loading = false }) => {
  const listRef = useRef(null);
  return (
    <KeyboardAvoidingView style={s.c} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <FlatList ref={listRef} data={messages} keyExtractor={(item) => item._id || String(Math.random())}
        renderItem={({ item }) => <ChatMessage message={item} />}
        onContentSizeChange={() => listRef.current?.scrollToEnd()} contentContainerStyle={s.list} />
      {suggestions.length > 0 && <ChatSuggestions suggestions={suggestions} onSelect={onSend} />}
      <ChatInput onSend={onSend} loading={loading} />
    </KeyboardAvoidingView>
  );
};
const s = StyleSheet.create({c:{flex:1,backgroundColor:'#F5F7FA'},list:{padding:16,paddingBottom:8}});
export default ChatInterface;
