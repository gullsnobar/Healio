import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../styles/ThemeContext';

const MarkAsTakenButton = ({ medicationId, onMarkTaken, isTaken = false }) => {
  const { colors } = useAppTheme();
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
      style={[styles.button, { backgroundColor: colors.primary }, taken && styles.buttonTaken]}
      onPress={handlePress}
      activeOpacity={taken ? 1 : 0.7}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={taken ? colors.success : '#fff'} />
      ) : (
        <>
          <Ionicons
            name={taken ? 'checkmark-circle' : 'checkmark-circle-outline'}
            size={20}
            color={taken ? colors.success : '#fff'}
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
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 6,
    minHeight: 42,
  },
  buttonTaken: {
    backgroundColor: '#D1FAE5',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  textTaken: {
    color: '#10B981',
  },
});

export default MarkAsTakenButton;
