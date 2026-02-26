import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { authAPI } from '../../services/api/authAPI';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) return Alert.alert('Error', 'Please enter your email');
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      Alert.alert('Success', 'OTP sent to your email');
      navigation.navigate('OTP', { email, mode: 'reset' });
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  return (
    <View style={s.c}>
      <Text style={s.t}>Forgot Password</Text>
      <Text style={s.d}>Enter your email to receive a reset code</Text>
      <TextInput style={s.i} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TouchableOpacity style={s.b} onPress={handleSubmit} disabled={loading}>
        <Text style={s.bt}>{loading ? 'Sending...' : 'Send Reset Code'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}><Text style={s.link}>Back to Login</Text></TouchableOpacity>
    </View>
  );
};

const s = StyleSheet.create({c:{flex:1,padding:24,justifyContent:'center',backgroundColor:'#F5F7FA'},t:{fontSize:24,fontWeight:'700',marginBottom:8},d:{fontSize:14,color:'#888',marginBottom:24},i:{borderWidth:1,borderColor:'#DDD',borderRadius:8,padding:14,fontSize:16,backgroundColor:'#FFF',marginBottom:16},b:{backgroundColor:'#4A90D9',padding:14,borderRadius:8,alignItems:'center',marginBottom:16},bt:{color:'#FFF',fontWeight:'600',fontSize:16},link:{color:'#4A90D9',textAlign:'center',fontSize:14}});
export default ForgotPasswordScreen;
