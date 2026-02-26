import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import AddMedicationForm from './AddMedicationForm';

const EditMedicationForm = ({ initialData, onSubmit, onDelete }) => {
  const handleDelete = () => {
    Alert.alert(
      'Delete Medication',
      `Are you sure you want to delete "${initialData?.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete?.(initialData),
        },
      ]
    );
  };

  return (
    <View style={styles.wrapper}>
      <AddMedicationForm initialData={initialData} onSubmit={onSubmit} />

      <View style={styles.deleteWrap}>
        <Button
          mode="outlined"
          onPress={handleDelete}
          style={styles.deleteBtn}
          textColor="#e74c3c"
          icon={({ size, color }) => (
            <Ionicons name="trash-outline" size={size} color={color} />
          )}
        >
          Delete Medication
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  deleteWrap: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  deleteBtn: {
    borderRadius: 12,
    borderColor: '#e74c3c',
  },
});

export default EditMedicationForm;
