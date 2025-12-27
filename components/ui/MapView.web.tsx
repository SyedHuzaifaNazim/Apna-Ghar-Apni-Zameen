import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Linking, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import AppText from '../base/AppText';

interface WebMapProps {
  initialRegion?: {
    latitude: number;
    longitude: number;
  };
  children?: React.ReactNode;
}
export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

// 2. Cover 'PROVIDER_GOOGLE' - Just a constant string
export const PROVIDER_GOOGLE = 'google';
/**
 * Production-optimized MapView for Web.
 * Since react-native-maps doesn't support web internals, 
 * this component provides a performant fallback that integrates with 
 * native browser mapping capabilities.
 */
const MapViewWeb: React.FC<WebMapProps> = ({ initialRegion, children }) => {
  
  const handleOpenExternalMap = () => {
    if (!initialRegion) return;
    
    // Generates a cross-platform universal map link
    const url = `https://www.google.com/maps/search/?api=1&query=${initialRegion.latitude},${initialRegion.longitude}`;
    Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
  };

  return (
    <View style={styles.container}>
      {/* On web, we render a placeholder with a call-to-action.
        This prevents 'react-native-maps' from being imported and 
        breaking the 'npx expo export' process.
      */}
      <View style={[styles.webPlaceholder, styles.placeholder]}>
        <Ionicons name="map-outline" size={48} color={Colors.gray[400]} />
        <AppText style={styles.title} children={undefined}>Interactive Map</AppText>
        <AppText style={styles.subtitle} children={undefined}>
          Interactive web maps require a separate API key configuration.
        </AppText>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleOpenExternalMap}
          activeOpacity={0.7}
        >
          <AppText style={styles.buttonText} children={undefined}>View on Google Maps</AppText>
          <Ionicons name="arrow-forward" size={16} color="white" />
        </TouchableOpacity>
      </View>

      {/* We hide the markers (children) on web to prevent 
        logic errors related to Marker position updates.
      */}
      <View style={styles.hidden}>
        {children}
      </View>
    </View>
  );
};

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
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    color: Colors.text?.primary || '#000',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text?.secondary || '#666',
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
  hidden: {
    display: 'none',
  },
  webPlaceholder: {
    backgroundColor: Colors.background?.secondary || '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border?.light || '#ccc',
  },
  text: {
    color: Colors.text?.secondary || '#666',
    fontWeight: '600',
  }
});

export default MapViewWeb;