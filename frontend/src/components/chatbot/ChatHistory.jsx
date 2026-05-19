import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '../../styles/ThemeContext';
const ChatHistory = ({ sessions = [], onSelect }) => {
  const { colors } = useAppTheme();
  return (
  <FlatList data={sessions} keyExtractor={(i) => i._id} renderItem={({ item }) => (
    <TouchableOpacity style={[s.item, { backgroundColor: colors.card }]} onPress={() => onSelect(item)}>
      <Text style={[s.title, { color: colors.text }]} numberOfLines={1}>{item.title || 'Chat Session'}</Text>
      <Text style={[s.date, { color: colors.textSecondary }]}>{item.date || ''}</Text>
    </TouchableOpacity>
  )} ListEmptyComponent={<Text style={[s.empty, { color: colors.textSecondary }]}>No chat history</Text>} />
  );
};
const s = StyleSheet.create({item:{padding:16,borderRadius:8,marginBottom:8,elevation:1},title:{fontSize:15,fontWeight:'500'},date:{fontSize:12,marginTop:4},empty:{textAlign:'center',padding:40}});
export default ChatHistory;
