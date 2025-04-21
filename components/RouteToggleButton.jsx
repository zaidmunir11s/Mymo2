import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { DynamicSize } from '@/constants/helpers';
import { Colors } from '@/constants/Colors';
import StyledText from '@/components/StyledText';

/**
 * Button component to toggle route path visibility
 * 
 * @param {Object} props Component props
 * @param {boolean} props.visible Whether the route path is visible
 * @param {Function} props.onToggle Function to toggle visibility
 * @param {Object} props.style Additional styles
 */
const RouteToggleButton = ({ visible, onToggle, style }) => {
  return (
    <TouchableOpacity 
      style={[styles.button, style]} 
      onPress={onToggle}
      activeOpacity={0.8}
    >
      <View style={styles.buttonContent}>
        <Image 
          source={require('@/assets/icons/route.svg')} 
          style={styles.icon}
          tintColor={visible ? Colors.white : Colors.tint}
        />
        <StyledText 
          type="small" 
          color={visible ? Colors.white : Colors.tint}
          weight={500}
        >
          {visible ? 'Hide Route' : 'Show Route'}
        </StyledText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: DynamicSize(160),
    right: DynamicSize(20),
    backgroundColor: Colors.white,
    borderRadius: DynamicSize(20),
    padding: DynamicSize(8),
    paddingHorizontal: DynamicSize(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.tint,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DynamicSize(4),
  },
  icon: {
    width: DynamicSize(16),
    height: DynamicSize(16),
  }
});

export default RouteToggleButton;