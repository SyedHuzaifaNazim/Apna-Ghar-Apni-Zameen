import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

// --- THE FIX IS HERE ---
// OLD (Deleted): import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
// NEW (Added):
import MapView, { Marker, PROVIDER_GOOGLE, Region } from '@/components/ui/MapView';
// -----------------------

import MapMarker from '@/components/ui/MapMarker';
import PropertyCard from '@/components/ui/PropertyCard';
import { Colors } from '@/constants/Colors';
import { useFetchProperties } from '@/hooks/useFetchProperties';
import { Property } from '@/types/property'; // Updated to use your new Types file

const MapScreen = () => {
  const { properties } = useFetchProperties();
  const router = useRouter();
  const mapRef = useRef<any>(null); // Use 'any' to handle the Web wrapper ref difference
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Filter properties based on search
  const filteredProperties = useMemo(() => {
    if (!searchQuery) return properties;
    
    const query = searchQuery.toLowerCase();
    return properties.filter(property => 
      property.title.toLowerCase().includes(query) ||
      property.address.city.toLowerCase().includes(query) ||
      property.address.line1.toLowerCase().includes(query) ||
      property.address.area.toLowerCase().includes(query)
    );
  }, [properties, searchQuery]);

  // Calculate initial region (Default View)
  const initialRegion: Region = useMemo(() => {
    const defaultKarachi = {
      latitude: 24.8607,
      longitude: 67.0011,
      latitudeDelta: 0.2,
      longitudeDelta: 0.2,
    };

    if (properties.length === 0) return defaultKarachi;

    const latitudes = properties.map(p => p.address.latitude);
    const longitudes = properties.map(p => p.address.longitude);
    
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max((maxLat - minLat) * 1.5, 0.05),
      longitudeDelta: Math.max((maxLng - minLng) * 1.5, 0.05),
    };
  }, [properties]);

  // EFFECT: Auto-zoom to search results
  useEffect(() => {
    if (filteredProperties.length > 0 && mapRef.current && mapRef.current.fitToCoordinates) {
      const coordinates = filteredProperties.map(p => ({
        latitude: p.address.latitude,
        longitude: p.address.longitude,
      }));

      // Animate map to fit all filtered markers
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 100, right: 50, bottom: 200, left: 50 },
        animated: true,
      });
    }
  }, [filteredProperties]);

  const handleMarkerPress = (property: Property) => {
    setSelectedProperty(property);
  };

  return (
    <SafeAreaView style={[styles.flex1, { backgroundColor: 'white' }]}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <View style={styles.searchBarHStack}>
          <View style={styles.inputContainer}>
            <Ionicons 
              name="search" 
              size={20} 
              color={Colors.gray[500]} 
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Search city, area, or property..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.input}
              placeholderTextColor={Colors.gray[500]}
            />
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => { router.push('/modal'); }}
            activeOpacity={0.8}
          >
            <Ionicons name="options-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Map */}
      <View style={styles.flex1}>
        <MapView
          ref={mapRef}
          style={styles.flex1}
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
          onPress={() => setSelectedProperty(null)} // Click map to close card
        >
          {filteredProperties.map(property => (
            <Marker
              key={property.id}
              coordinate={{
                latitude: property.address.latitude,
                longitude: property.address.longitude,
              }}
              onPress={(e: any) => {
                e.stopPropagation(); // Stop map click event
                handleMarkerPress(property);
              }}
            >
              <MapMarker 
                property={property} 
                isSelected={selectedProperty?.id === property.id}
              />
            </Marker>
          ))}
        </MapView>
      </View>

      {/* Property Info Modal */}
      {selectedProperty && (
        <View style={styles.cardContainer}>
          <View style={styles.closeButtonContainer}>
            <TouchableOpacity
              onPress={() => setSelectedProperty(null)}
              style={styles.closeButton}
              activeOpacity={0.9}
            >
              <Ionicons name="close" size={20} color={Colors.gray[600]} />
            </TouchableOpacity>
          </View>
          
          <PropertyCard 
            property={selectedProperty} 
            variant="default"
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  searchBar: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 10,
    zIndex: 10,
  },
  searchBarHStack: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  inputIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    paddingHorizontal: 8,
    color: Colors.text.primary,
  },
  filterButton: {
    backgroundColor: Colors.primary[500],
    borderRadius: 12,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  // Popup Container
  cardContainer: {
    position: 'absolute', 
    bottom: 30, 
    left: 0, 
    right: 0, 
    zIndex: 100,
  },
  closeButtonContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: -15, // Overlap effect
    zIndex: 101,
  },
  closeButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  }
});

export default MapScreen;