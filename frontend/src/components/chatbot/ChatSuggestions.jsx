import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
const ChatSuggestions = ({ suggestions = [], onSelect }) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.c} contentContainerStyle={s.cc}>
    {suggestions.map((s2, i) => (
      <TouchableOpacity key={i} style={s.chip} onPress={() => onSelect(s2)}>
        <Text style={s.text}>{s2}</Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
);
const s = StyleSheet.create({c:{maxHeight:50,marginBottom:4},cc:{paddingHorizontal:16,gap:8,alignItems:'center'},chip:{backgroundColor:'#E8F0FE',paddingHorizontal:14,paddingVertical:8,borderRadius:20},text:{color:'#4A90D9',fontSize:13,fontWeight:'500'}});
export default ChatSuggestions;
