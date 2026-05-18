import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { TextInput, Button, ProgressBar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useAppTheme } from '../../styles/ThemeContext';
import Dropdown from '../common/Dropdown';

const REPORT_TYPES = [
  'Blood Test',
  'X-Ray',
  'MRI',
  'CT Scan',
  'Urine Test',
  'Other',
];

const UploadLabReport = ({ onUpload }) => {
  const { colors } = useAppTheme();
  const [title, setTitle] = useState('');
  const [reportType, setReportType] = useState('');
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setSelectedFile(result.assets[0]);
      }
    } catch {
      Alert.alert('Error', 'Failed to pick file. Please try again.');
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const validate = () => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Please enter a report title.');
      return false;
    }
    if (!reportType) {
      Alert.alert('Validation Error', 'Please select a report type.');
      return false;
    }
    if (!selectedFile) {
      Alert.alert('Validation Error', 'Please select a file to upload.');
      return false;
    }
    return true;
  };

  const handleUpload = async () => {
    if (!validate()) return;
    setUploading(true);
    setUploadProgress(0);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 0.9) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 0.1;
      });
    }, 300);

    try {
      const safeDate = date instanceof Date && !Number.isNaN(date.getTime()) ? date : new Date();
      await onUpload?.({
        title: title.trim(),
        type: reportType,
        date: safeDate.toISOString(),
        notes: notes.trim(),
        file: selectedFile,
      });
      setUploadProgress(1);
      clearInterval(progressInterval);

      // Reset form
      setTimeout(() => {
        setTitle('');
        setReportType('');
        setDate(new Date());
        setNotes('');
        setSelectedFile(null);
        setUploadProgress(0);
      }, 500);
    } catch {
      clearInterval(progressInterval);
      Alert.alert('Upload Failed', 'Failed to upload the report. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={styles.form}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Report Information</Text>

        <TextInput
          label="Report Title *"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={[styles.input, { backgroundColor: colors.card }]}
          outlineColor={colors.border}
          activeOutlineColor={colors.primary}
          left={<TextInput.Icon icon="file-document-outline" />}
        />

        <Dropdown
          label="Report Type"
          value={reportType}
          options={REPORT_TYPES}
          placeholder="Select report type"
          onSelect={setReportType}
          required
        />

        <Dropdown
          label="Report Date"
          value={date instanceof Date && !Number.isNaN(date.getTime()) ? date.toISOString().split('T')[0] : ''}
          placeholder="Select date"
          mode="date"
          onChange={(value) => {
            if (typeof value === 'string') {
              setDate(new Date(value + 'T00:00:00'));
              return;
            }
            if (value instanceof Date && !Number.isNaN(value.getTime())) {
              setDate(value);
            }
          }}
          required
        />

        <Text style={[styles.sectionTitle, { marginTop: 20, color: colors.text }]}>File Upload</Text>

        {!selectedFile ? (
          <TouchableOpacity style={[styles.filePickerArea, { borderColor: colors.primary + '40', backgroundColor: colors.primary + '08' }]} onPress={pickFile}>
            <Ionicons name="cloud-upload-outline" size={40} color={colors.primary} />
            <Text style={[styles.filePickerTitle, { color: colors.text }]}>Tap to select a file</Text>
            <Text style={[styles.filePickerHint, { color: colors.textTertiary }]}>PDF or Image files accepted</Text>
          </TouchableOpacity>
        ) : (
          <View style={[styles.selectedFileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons
              name={selectedFile.mimeType?.includes('pdf') ? 'document' : 'image'}
              size={28}
              color={colors.primary}
            />
            <View style={styles.fileInfo}>
              <Text style={[styles.fileName, { color: colors.text }]} numberOfLines={1}>
                {selectedFile.name}
              </Text>
              <Text style={[styles.fileSize, { color: colors.textTertiary }]}>
                {selectedFile.size
                  ? `${(selectedFile.size / 1024).toFixed(1)} KB`
                  : 'Unknown size'}
              </Text>
            </View>
            <TouchableOpacity onPress={removeFile} style={styles.removeFile}>
              <Ionicons name="close-circle" size={22} color={colors.error} />
            </TouchableOpacity>
          </View>
        )}

        <Text style={[styles.sectionTitle, { marginTop: 20, color: colors.text }]}>Additional Notes</Text>

        <TextInput
          label="Notes (optional)"
          value={notes}
          onChangeText={setNotes}
          mode="outlined"
          style={[styles.input, { backgroundColor: colors.card }]}
          outlineColor={colors.border}
          activeOutlineColor={colors.primary}
          multiline
          numberOfLines={3}
          left={<TextInput.Icon icon="note-text-outline" />}
        />

        {uploading && (
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={[styles.progressText, { color: colors.textSecondary }]}>Uploading...</Text>
              <Text style={[styles.progressPercent, { color: colors.primary }]}>
                {Math.round(uploadProgress * 100)}%
              </Text>
            </View>
            <ProgressBar
              progress={uploadProgress}
              color={colors.primary}
              style={styles.progressBar}
            />
          </View>
        )}

        <Button
          mode="contained"
          onPress={handleUpload}
          loading={uploading}
          disabled={uploading}
          style={styles.uploadButton}
          buttonColor={colors.primary}
          icon="upload"
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          {uploading ? 'Uploading...' : 'Upload Report'}
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    marginBottom: 12,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 6,
    padding: 14,
    marginBottom: 12,
  },
  pickerText: {
    flex: 1,
    fontSize: 15,
    marginLeft: 10,
  },
  filePickerArea: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  filePickerTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 10,
  },
  filePickerHint: {
    fontSize: 13,
    marginTop: 4,
  },
  selectedFileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
  },
  fileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
  },
  fileSize: {
    fontSize: 12,
    marginTop: 2,
  },
  removeFile: {
    padding: 4,
  },
  progressContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressText: {
    fontSize: 13,
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  uploadButton: {
    borderRadius: 8,
    marginTop: 20,
  },
  buttonContent: {
    height: 50,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
});

export default UploadLabReport;
