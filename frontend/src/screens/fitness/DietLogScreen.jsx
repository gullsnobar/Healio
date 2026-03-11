import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { useAppTheme } from '../../styles/ThemeContext';
import DietLogger from '../../components/fitness/DietLogger';
import { logDiet } from '../../redux/slices/fitnessSlice';

const DietLogScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { colors } = useAppTheme();
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (data) => {
    try {
      await dispatch(logDiet(data)).unwrap();
      setSuccess(true);
      setTimeout(() => navigation.goBack(), 1200);
    } catch {
      Alert.alert('Error', 'Failed to save diet log. Please try again.');
    }
  };

  if (success) {
    return (
      <View style={[s.successWrap, { backgroundColor: colors.background }]}>
        <View style={[s.successCard, { backgroundColor: colors.card }]}>
          <Text style={{ fontSize: 40, marginBottom: 12 }}>✅</Text>
          <Text style={[s.successTitle, { color: colors.text }]}>Diet log added successfully!</Text>
          <Text style={[s.successSub, { color: colors.textSecondary }]}>Returning to dashboard...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[s.c, { backgroundColor: colors.background }]}>
      <DietLogger onSubmit={handleSubmit} />
    </View>
  );
};

const s = StyleSheet.create({
  c: { flex: 1 },
  successWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  successCard: { padding: 32, borderRadius: 16, alignItems: 'center', width: '100%', maxWidth: 340 },
  successTitle: { fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 6 },
  successSub: { fontSize: 14, textAlign: 'center' },
});
export default DietLogScreen;
