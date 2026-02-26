import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <View style={[s.bubble, isUser ? s.user : s.bot]}>
      <Text style={[s.text, isUser && s.userText]}>{message.content}</Text>
      <Text style={s.time}>{message.timestamp || ''}</Text>
    </View>
  );
};
const s = StyleSheet.create({bubble:{maxWidth:'80%',padding:12,borderRadius:16,marginBottom:8},user:{alignSelf:'flex-end',backgroundColor:'#4A90D9',borderBottomRightRadius:4},bot:{alignSelf:'flex-start',backgroundColor:'#FFF',borderBottomLeftRadius:4,elevation:1},text:{fontSize:15,color:'#333',lineHeight:22},userText:{color:'#FFF'},time:{fontSize:10,color:'#AAA',marginTop:4,alignSelf:'flex-end'}});
export default ChatMessage;
