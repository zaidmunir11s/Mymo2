import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { DynamicSize } from '@/constants/helpers';
import { Colors } from '@/constants/Colors';
import { Image } from 'expo-image';
import StyledText from '@/components/StyledText';
import Slider from '@react-native-community/slider';

/**
 * Component to provide route playback controls
 * 
 * @param {Object} props Component props
 * @param {Array} props.routeCoordinates Array of route coordinates
 * @param {Function} props.onPositionChange Callback when position changes
 * @param {Function} props.onClose Function to close the playback controls
 */
const RoutePlayback = ({ routeCoordinates, onPositionChange, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const playbackRef = useRef(null);

  // Handle playback
  useEffect(() => {
    if (playing && routeCoordinates.length > 0) {
      playbackRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          if (nextIndex >= routeCoordinates.length) {
            setPlaying(false);
            return prevIndex;
          }
          
          if (onPositionChange) {
            onPositionChange(routeCoordinates[nextIndex]);
          }
          
          return nextIndex;
        });
      }, 1000); // Update every second
    } else {
      clearInterval(playbackRef.current);
    }

    return () => clearInterval(playbackRef.current);
  }, [playing, routeCoordinates, onPositionChange]);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleSliderChange = (value) => {
    const index = Math.floor(value);
    setCurrentIndex(index);
    
    if (onPositionChange) {
      onPositionChange(routeCoordinates[index]);
    }
  };

  if (!routeCoordinates || routeCoordinates.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <StyledText type="body" color={Colors.white} weight={500}>
          Route Playback
        </StyledText>
        <TouchableOpacity onPress={onClose}>
          <Image
            source={require('@/assets/icons/close.svg')}
            style={{ width: DynamicSize(20), height: DynamicSize(20) }}
            tintColor={Colors.white}
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={routeCoordinates.length - 1}
            value={currentIndex}
            onValueChange={handleSliderChange}
            step={1}
            minimumTrackTintColor={Colors.tint}
            maximumTrackTintColor={Colors.grey_30}
            thumbTintColor={Colors.tint}
          />
          <View style={styles.timeContainer}>
            <StyledText type="small" color={Colors.grey_70}>
              {`${currentIndex + 1}/${routeCoordinates.length}`}
            </StyledText>
          </View>
        </View>
        
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => {
              if (currentIndex > 0) {
                const newIndex = currentIndex - 1;
                setCurrentIndex(newIndex);
                if (onPositionChange) {
                  onPositionChange(routeCoordinates[newIndex]);
                }
              }
            }}
            disabled={currentIndex === 0}
          >
            <Image
              source={require('@/assets/icons/rewind.svg')}
              style={styles.controlIcon}
              tintColor={currentIndex === 0 ? Colors.grey_50 : Colors.tint}
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.controlButton, styles.playButton]}
            onPress={handlePlayPause}
          >
            <Image
              source={playing ? require('@/assets/icons/pause.svg') : require('@/assets/icons/play.svg')}
              style={styles.playIcon}
              tintColor={Colors.white}
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => {
              if (currentIndex < routeCoordinates.length - 1) {
                const newIndex = currentIndex + 1;
                setCurrentIndex(newIndex);
                if (onPositionChange) {
                  onPositionChange(routeCoordinates[newIndex]);
                }
              }
            }}
            disabled={currentIndex === routeCoordinates.length - 1}
          >
            <Image
              source={require('@/assets/icons/forward.svg')}
              style={styles.controlIcon}
              tintColor={currentIndex === routeCoordinates.length - 1 ? Colors.grey_50 : Colors.tint}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: DynamicSize(100),
    left: DynamicSize(20),
    right: DynamicSize(20),
    backgroundColor: Colors.white,
    borderRadius: DynamicSize(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: DynamicSize(16),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DynamicSize(16),
    paddingBottom: DynamicSize(8),
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey_10,
  },
  content: {
    gap: DynamicSize(16),
  },
  sliderContainer: {
    width: '100%',
  },
  slider: {
    width: '100%',
    height: DynamicSize(40),
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: DynamicSize(24),
  },
  controlButton: {
    padding: DynamicSize(8),
  },
  playButton: {
    backgroundColor: Colors.tint,
    borderRadius: DynamicSize(30),
    width: DynamicSize(60),
    height: DynamicSize(60),
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlIcon: {
    width: DynamicSize(24),
    height: DynamicSize(24),
  },
  playIcon: {
    width: DynamicSize(24),
    height: DynamicSize(24),
  },
});

export default RoutePlayback;