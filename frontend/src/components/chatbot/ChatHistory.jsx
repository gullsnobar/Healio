import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
const ChatHistory = ({ sessions = [], onSelect }) => (
  <FlatList data={sessions} keyExtractor={(i) => i._id} renderItem={({ item }) => (
    <TouchableOpacity style={s.item} onPress={() => onSelect(item)}>
      <Text style={s.title} numberOfLines={1}>{item.title || 'Chat Session'}</Text>
      <Text style={s.date}>{item.date || ''}</Text>
    </TouchableOpacity>
  )} ListEmptyComponent={<Text style={s.empty}>No chat history</Text>} />
);
const s = StyleSheet.create({item:{backgroundColor:'#FFF',padding:16,borderRadius:8,marginBottom:8,elevation:1},title:{fontSize:15,fontWeight:'500'},date:{fontSize:12,color:'#888',marginTop:4},empty:{textAlign:'center',color:'#888',padding:40}});
export default ChatHistory;
