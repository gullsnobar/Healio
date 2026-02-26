import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
const ChatInput = ({ onSend, loading = false }) => {
  const [text, setText] = useState('');
  const send = () => { if (text.trim()) { onSend(text.trim()); setText(''); } };
  return (
    <View style={s.c}>
      <TextInput style={s.input} placeholder="Ask a health question..." value={text} onChangeText={setText} multiline maxLength={500} />
      <TouchableOpacity style={s.btn} onPress={send} disabled={loading || !text.trim()}>
        {loading ? <ActivityIndicator color="#FFF" size="small" /> : <Ionicons name="send" size={20} color="#FFF" />}
      </TouchableOpacity>
    </View>
  );
};
const s = StyleSheet.create({c:{flexDirection:'row',padding:8,backgroundColor:'#FFF',borderTopWidth:1,borderTopColor:'#EEE',alignItems:'flex-end'},input:{flex:1,backgroundColor:'#F5F7FA',borderRadius:20,paddingHorizontal:16,paddingVertical:10,fontSize:15,maxHeight:100},btn:{backgroundColor:'#4A90D9',width:40,height:40,borderRadius:20,alignItems:'center',justifyContent:'center',marginLeft:8}});
export default ChatInput;
