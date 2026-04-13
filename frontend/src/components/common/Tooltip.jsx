import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions, Platform } from 'react-native';

const { width: SCREEN_W } = Dimensions.get('window');

/**
 * Tooltip Component for long-press descriptions
 * Works on web browsers and mobile devices
 */
const Tooltip = ({ children, text, position = 'top' }) => {
  const [visible, setVisible] = useState(false);
  const [position_val, setPosition] = useState({ x: 0, y: 0 });
  const pressTimer = useRef(null);
  const childRef = useRef(null);

  const handlePressIn = (event) => {
    // Get coordinates from the event
    const pageX = event?.nativeEvent?.pageX || event?.clientX || 0;
    const pageY = event?.nativeEvent?.pageY || event?.clientY || 0;
    
    pressTimer.current = setTimeout(() => {
      setPosition({ x: pageX, y: pageY });
      setVisible(true);
      setTimeout(() => setVisible(false), 2000);
    }, 500); // 500ms long press threshold
  };

  const handlePressOut = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  return (
    <>
      <View 
        ref={childRef}
        onLongPress={handlePressIn}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{ position: 'relative' }}
      >
        {children}
      </View>
      {visible && (
        <Modal transparent visible={visible} animationType="fade">
          <TouchableOpacity
            style={s.overlay}
            activeOpacity={1}
            onPress={() => setVisible(false)}
          >
            <View
              style={[
                s.tooltip,
                {
                  left: Math.min(Math.max(position_val.x - 75, 10), SCREEN_W - 160),
                  top: position_val.y - 80,
                },
              ]}
            >
              <Text style={s.tooltipText}>{text}</Text>
              <View style={s.tooltipArrow} />
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </>
  );
};

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: '#1F2937',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    maxWidth: 150,
    elevation: 5,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  tooltipText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  tooltipArrow: {
    position: 'absolute',
    bottom: -4,
    left: '50%',
    marginLeft: -4,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#1F2937',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 4,
  },
});

export default Tooltip;
