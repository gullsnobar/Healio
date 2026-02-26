import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { TextInput, Menu, Button, ProgressBar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';

const PRIMARY_COLOR = '#4A90D9';

const REPORT_TYPES = [
  { key: 'blood', label: 'Blood Test' },
  { key: 'xray', label: 'X-Ray' },
  { key: 'mri', label: 'MRI' },
  { key: 'ct', label: 'CT Scan' },
  { key: 'urine', label: 'Urine Test' },
  { key: 'other', label: 'Other' },
];

const UploadLabReport = ({ onUpload }) => {
  const [title, setTitle] = useState('');
  const [reportType, setReportType] = useState('');
  const [reportTypeLabel, setReportTypeLabel] = useState('');
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const formatDate = (d) =>
    d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setDate(selectedDate);
  };

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
      await onUpload?.({
        title: title.trim(),
        type: reportType,
        date: date.toISOString(),
        notes: notes.trim(),
        file: selectedFile,
      });
      setUploadProgress(1);
      clearInterval(progressInterval);

      // Reset form
      setTimeout(() => {
        setTitle('');
        setReportType('');
        setReportTypeLabel('');
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Report Information</Text>

        <TextInput
          label="Report Title *"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={styles.input}
          outlineColor="#ddd"
          activeOutlineColor={PRIMARY_COLOR}
          left={<TextInput.Icon icon="file-document-outline" />}
        />

        <Menu
          visible={showTypeMenu}
          onDismiss={() => setShowTypeMenu(false)}
          anchor={
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowTypeMenu(true)}
            >
              <Ionicons name="flask-outline" size={20} color={PRIMARY_COLOR} />
              <Text style={[styles.pickerText, !reportType && { color: '#999' }]}>
                {reportTypeLabel || 'Select Report Type *'}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#888" />
            </TouchableOpacity>
          }
        >
          {REPORT_TYPES.map((rt) => (
            <Menu.Item
              key={rt.key}
              title={rt.label}
              onPress={() => {
                setReportType(rt.key);
                setReportTypeLabel(rt.label);
                setShowTypeMenu(false);
              }}
            />
          ))}
        </Menu>

        <TouchableOpacity style={styles.pickerButton} onPress={() => setShowDatePicker(true)}>
          <Ionicons name="calendar-outline" size={20} color={PRIMARY_COLOR} />
          <Text style={styles.pickerText}>{formatDate(date)}</Text>
          <Ionicons name="chevron-down" size={18} color="#888" />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
          />
        )}

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>File Upload</Text>

        {!selectedFile ? (
          <TouchableOpacity style={styles.filePickerArea} onPress={pickFile}>
            <Ionicons name="cloud-upload-outline" size={40} color={PRIMARY_COLOR} />
            <Text style={styles.filePickerTitle}>Tap to select a file</Text>
            <Text style={styles.filePickerHint}>PDF or Image files accepted</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.selectedFileCard}>
            <Ionicons
              name={selectedFile.mimeType?.includes('pdf') ? 'document' : 'image'}
              size={28}
              color={PRIMARY_COLOR}
            />
            <View style={styles.fileInfo}>
              <Text style={styles.fileName} numberOfLines={1}>
                {selectedFile.name}
              </Text>
              <Text style={styles.fileSize}>
                {selectedFile.size
                  ? `${(selectedFile.size / 1024).toFixed(1)} KB`
                  : 'Unknown size'}
              </Text>
            </View>
            <TouchableOpacity onPress={removeFile} style={styles.removeFile}>
              <Ionicons name="close-circle" size={22} color="#F44336" />
            </TouchableOpacity>
          </View>
        )}

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Additional Notes</Text>

        <TextInput
          label="Notes (optional)"
          value={notes}
          onChangeText={setNotes}
          mode="outlined"
          style={styles.input}
          outlineColor="#ddd"
          activeOutlineColor={PRIMARY_COLOR}
          multiline
          numberOfLines={3}
          left={<TextInput.Icon icon="note-text-outline" />}
        />

        {uploading && (
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressText}>Uploading...</Text>
              <Text style={styles.progressPercent}>
                {Math.round(uploadProgress * 100)}%
              </Text>
            </View>
            <ProgressBar
              progress={uploadProgress}
              color={PRIMARY_COLOR}
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
          buttonColor={PRIMARY_COLOR}
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
    backgroundColor: '#f8f9fa',
  },
  form: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 14,
    marginBottom: 12,
  },
  pickerText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    marginLeft: 10,
  },
  filePickerArea: {
    borderWidth: 2,
    borderColor: PRIMARY_COLOR + '40',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    backgroundColor: PRIMARY_COLOR + '08',
  },
  filePickerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
  },
  filePickerHint: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
  selectedFileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
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
    color: '#333',
  },
  fileSize: {
    fontSize: 12,
    color: '#999',
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
    color: '#666',
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: '600',
    color: PRIMARY_COLOR,
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
