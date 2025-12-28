import { Ionicons } from '@expo/vector-icons';
import React, { forwardRef, useImperativeHandle } from 'react';
import { Linking, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import AppText from '../base/AppText';

// 1. Export types and constants compatible with react-native-maps
export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export const PROVIDER_GOOGLE = 'google';

// 2. Export a dummy Marker component (renders nothing on web)
export const Marker = (props: any) => null;

interface WebMapProps {
  initialRegion?: {
    latitude: number;
    longitude: number;
  };
  children?: React.ReactNode;
  style?: any;
  provider?: any;
  showsUserLocation?: boolean;
  showsMyLocationButton?: boolean;
  onPress?: () => void;
  ref?: any;
}

/**
 * Production-optimized MapView for Web.
 * Uses forwardRef to prevent crashes when parent tries to access map methods.
 */
const MapViewWeb = forwardRef((props: WebMapProps, ref) => {
  
  // 3. Mock the methods that app/map.tsx calls (like fitToCoordinates)
  useImperativeHandle(ref, () => ({
    fitToCoordinates: () => {
      // No-op on web
      console.log('Map fitToCoordinates called on web');
    },
    animateToRegion: () => {
      console.log('Map animateToRegion called on web');
    },
  }));

  const handleOpenExternalMap = () => {
    if (!props.initialRegion) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${props.initialRegion.latitude},${props.initialRegion.longitude}`;
    Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
  };

  return (
    <View style={[styles.container, props.style]}>
      <View style={[styles.webPlaceholder, styles.placeholder]}>
        <Ionicons name="map-outline" size={48} color={Colors.gray[400]} />
        <AppText variant="h3" weight="bold" style={styles.title}>Interactive Map</AppText>
        <AppText variant="body" color="secondary" style={styles.subtitle}>
          Interactive web maps require a separate API key configuration.
        </AppText>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleOpenExternalMap}
          activeOpacity={0.7}
        >
          <AppText style={styles.buttonText}>View on Google Maps</AppText>
          <Ionicons name="arrow-forward" size={16} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background?.secondary || '#F5F5F5',
    borderRadius: 12,
    overflow: 'hidden',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    textAlign: 'center',
  },
  title: {
    marginTop: 16,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary?.[500] || '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  webPlaceholder: {
    backgroundColor: Colors.background?.secondary || '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border?.light || '#ccc',
  },
});

export default MapViewWeb;