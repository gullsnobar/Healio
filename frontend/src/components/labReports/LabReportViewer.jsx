import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Linking,
  ScrollView,
  Image,
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { useAppTheme } from '../../styles/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const LabReportViewer = ({ report }) => {
  const { colors, isDark } = useAppTheme();
  const { title, fileUrl, fileType, date } = report || {};
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const scrollViewRef = useRef(null);

  const isPdf = fileType === 'pdf' || fileUrl?.toLowerCase().endsWith('.pdf');

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setScale(1);
  };

  const handleDownload = () => {
    if (!fileUrl) {
      Alert.alert('Error', 'No file URL available for download.');
      return;
    }
    Linking.openURL(fileUrl).catch(() => {
      Alert.alert('Error', 'Could not open the download link.');
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#1a1a1a' }]}>
      {/* Header Bar */}
      <View style={[styles.header, { backgroundColor: isDark ? '#1E293B' : '#222' }]}>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title || 'Lab Report'}
          </Text>
          {date ? <Text style={styles.headerDate}>{date}</Text> : null}
        </View>
        <TouchableOpacity style={[styles.downloadButton, { backgroundColor: colors.primary }]} onPress={handleDownload}>
          <Ionicons name="download-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Viewer */}
      <View style={styles.viewerContainer}>
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading report...</Text>
          </View>
        )}

        {isPdf ? (
          <WebView
            source={{ uri: fileUrl }}
            style={styles.webview}
            onLoadEnd={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              Alert.alert('Error', 'Failed to load the PDF.');
            }}
            scalesPageToFit
            startInLoadingState
          />
        ) : (
          <ScrollView
            ref={scrollViewRef}
            style={styles.imageScrollView}
            contentContainerStyle={styles.imageContainer}
            maximumZoomScale={3}
            minimumZoomScale={0.5}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            bouncesZoom
          >
            <Image
              source={{ uri: fileUrl }}
              style={[
                styles.image,
                {
                  width: SCREEN_WIDTH * scale,
                  height: SCREEN_HEIGHT * 0.7 * scale,
                },
              ]}
              resizeMode="contain"
              onLoadEnd={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                Alert.alert('Error', 'Failed to load the image.');
              }}
            />
          </ScrollView>
        )}
      </View>

      {/* Zoom Controls (for images) */}
      {!isPdf && (
        <View style={[styles.zoomControls, { backgroundColor: isDark ? '#1E293B' : '#222' }]}>
          <TouchableOpacity style={[styles.zoomButton, { backgroundColor: colors.cardAlt }]} onPress={handleZoomOut}>
            <Ionicons name="remove" size={22} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.zoomButton, { backgroundColor: colors.cardAlt }]} onPress={handleResetZoom}>
            <Text style={[styles.zoomText, { color: colors.text }]}>{Math.round(scale * 100)}%</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.zoomButton, { backgroundColor: colors.cardAlt }]} onPress={handleZoomIn}>
            <Ionicons name="add" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 48,
  },
  headerInfo: {
    flex: 1,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  headerDate: {
    fontSize: 13,
    color: '#aaa',
    marginTop: 2,
  },
  downloadButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewerContainer: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    color: '#aaa',
    marginTop: 10,
    fontSize: 14,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  imageScrollView: {
    flex: 1,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: SCREEN_HEIGHT * 0.7,
  },
  image: {
    backgroundColor: 'transparent',
  },
  zoomControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingBottom: 30,
    gap: 16,
  },
  zoomButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomText: {
    fontSize: 13,
    fontWeight: '700',
  },
});

export default LabReportViewer;
