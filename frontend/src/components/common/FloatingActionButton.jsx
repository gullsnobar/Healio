import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../styles/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FAB = ({
  onPress,
  icon = 'add',
  label = 'Add',
  colors: customColors,
  gradient = true,
  size = 'medium',
  position = 'bottom-right',
  offsetX = 20,
  offsetY = 80, // Default offset accounting for tab bar
}) => {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const screenWidth = Dimensions.get('window').width;
  const isMobile = screenWidth < 768;

  const sizeConfig = {
    small: { width: 48, height: 48, iconSize: 20 },
    medium: { width: 60, height: 60, iconSize: 24 },
    large: { width: 70, height: 70, iconSize: 28 },
  };

  const config = sizeConfig[size] || sizeConfig.medium;
  
  // Calculate safe positioning based on device orientation and safe area
  const positionStyle = {
    position: 'absolute',
    ...(position.includes('right') && { right: offsetX }),
    ...(position.includes('left') && { left: offsetX }),
    ...(position.includes('bottom') && { bottom: offsetY + insets.bottom }),
    ...(position.includes('top') && { top: offsetY + insets.top }),
    zIndex: 999,
  };

  const fabColor = customColors || colors.primary;
  const fabBg = colors.primaryLight || '#E0F2FE';

  return (
    <View
      style={[
        styles.container,
        positionStyle,
        {
          width: config.width,
          height: config.height,
          borderRadius: config.width / 2,
        },
      ]}
      pointerEvents="box-none"
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.75}
        style={[
          styles.fab,
          {
            width: config.width,
            height: config.height,
            borderRadius: config.width / 2,
            overflow: 'hidden',
          },
        ]}
      >
        {gradient ? (
          <LinearGradient
            colors={[fabColor, colors.primaryDark || fabColor]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.fabGradient,
              {
                width: config.width,
                height: config.height,
              },
            ]}
          >
            <Ionicons
              name={icon}
              size={config.iconSize}
              color="#fff"
            />
          </LinearGradient>
        ) : (
          <View
            style={[
              styles.fabSolid,
              {
                width: config.width,
                height: config.height,
                backgroundColor: fabColor,
              },
            ]}
          >
            <Ionicons
              name={icon}
              size={config.iconSize}
              color="#fff"
            />
          </View>
        )}

        {/* Shadow for iOS */}
        {Platform.OS === 'ios' && (
          <View
            style={[
              StyleSheet.absoluteFill,
              styles.shadow,
            ]}
            pointerEvents="none"
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fab: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabGradient: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabSolid: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    borderRadius: '50%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

export default FAB;
