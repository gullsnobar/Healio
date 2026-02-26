import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = '#4A90D9';

const MarkAsTakenButton = ({ medicationId, onMarkTaken, isTaken = false }) => {
  const [loading, setLoading] = useState(false);
  const [taken, setTaken] = useState(isTaken);

  const handlePress = () => {
    if (taken) return;

    Alert.alert(
      'Confirm',
      'Mark this medication as taken?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Taken',
          onPress: async () => {
            setLoading(true);
            try {
              await onMarkTaken?.(medicationId);
              setTaken(true);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={[styles.button, taken && styles.buttonTaken]}
      onPress={handlePress}
      activeOpacity={taken ? 1 : 0.7}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={taken ? '#27ae60' : '#fff'} />
      ) : (
        <>
          <Ionicons
            name={taken ? 'checkmark-circle' : 'checkmark-circle-outline'}
            size={20}
            color={taken ? '#27ae60' : '#fff'}
          />
          <Text style={[styles.text, taken && styles.textTaken]}>
            {taken ? 'Taken' : 'Mark as Taken'}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 6,
    minHeight: 42,
  },
  buttonTaken: {
    backgroundColor: '#e8f5e9',
    borderWidth: 1,
    borderColor: '#27ae60',
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  textTaken: {
    color: '#27ae60',
  },
});

export default MarkAsTakenButton;
