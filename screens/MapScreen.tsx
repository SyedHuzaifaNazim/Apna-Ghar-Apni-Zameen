import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  Platform,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';

import { Property } from '@/api/apiMock';
import AppButton from '@/components/base/AppButton';
import AppText from '@/components/base/AppText';
import { Colors } from '@/constants/Colors';
import { useFetchProperties } from '@/hooks/useFetchProperties';

const { width } = Dimensions.get('window');

const MapScreen = () => {
  const { properties } = useFetchProperties();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Filter properties based on search
  const filteredProperties = useMemo(() => {
    if (!searchQuery) return properties;
    
    const query = searchQuery.toLowerCase();
    return properties.filter(property => 
      property.title.toLowerCase().includes(query) ||
      property.address.city.toLowerCase().includes(query) ||
      property.address.line1.toLowerCase().includes(query)
    );
  }, [properties, searchQuery]);

  // Calculate initial region based on properties
  const initialRegion: Region = useMemo(() => {
    if (properties.length === 0) {
      return {
        latitude: 24.8607,
        longitude: 67.0011,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };
    }

    const latitudes = properties.map(p => p.address.latitude);
    const longitudes = properties.map(p => p.address.longitude);
    
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);
    
    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: (maxLat - minLat) * 1.1,
      longitudeDelta: (maxLng - minLng) * 1.1,
    };
  }, [properties]);

  const handleMarkerPress = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleViewDetails = () => {
    if (selectedProperty) {
      router.push(`/listing/${selectedProperty.id}`);
      setSelectedProperty(null);
    }
  };

  const getMarkerColor = (property: Property) => {
    // Fallback to primary/secondary if specific status colors aren't available
    if (property.listingType === 'For Sale') return Colors.success?.[500] || 'green';
    if (property.listingType === 'For Rent') return Colors.warning?.[500] || 'orange';
    return Colors.primary[500];
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <View style={styles.inputWrapper}>
            <Ionicons 
              name="search" 
              size={20} 
              color={Colors.text.secondary} 
              style={styles.searchIcon}
            />
            <TextInput
              placeholder="Search on map..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.input}
              placeholderTextColor={Colors.text.disabled}
            />
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => {/* Implement map filters */}}
            activeOpacity={0.8}
          >
            <Ionicons name="options-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {filteredProperties.map(property => (
            <Marker
              key={property.id}
              coordinate={{
                latitude: property.address.latitude,
                longitude: property.address.longitude,
              }}
              pinColor={getMarkerColor(property)}
              onPress={() => handleMarkerPress(property)}
            />
          ))}
        </MapView>
      </View>

      {/* Property Info Card */}
      {selectedProperty && (
        <View style={styles.cardContainer}>
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                <AppText variant="h3" weight="bold" numberOfLines={2}>
                  {selectedProperty.title}
                </AppText>
                <AppText variant="small" color="secondary" numberOfLines={1}>
                  {selectedProperty.address.line1}
                </AppText>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedProperty(null)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={20} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.priceRow}>
              <AppText variant="h2" weight="bold" color="primary" style={{ color: Colors.primary[500] }}>
                {selectedProperty.price.toLocaleString()} {selectedProperty.currency}
              </AppText>
              <AppText variant="body" color="secondary">
                {selectedProperty.areaSize} sq ft
              </AppText>
            </View>
            
            <View style={styles.featuresRow}>
              <View style={styles.featureItem}>
                <Ionicons name="bed-outline" size={16} color={Colors.text.secondary} />
                <AppText variant="small" color="secondary">
                  {selectedProperty.bedrooms} Beds
                </AppText>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="business-outline" size={16} color={Colors.text.secondary} />
                <AppText variant="small" color="secondary">
                  {selectedProperty.propertyCategory}
                </AppText>
              </View>
            </View>
            
            <AppButton 
              onPress={handleViewDetails}
              style={styles.viewDetailsButton}
            >
              View Details
            </AppButton>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        zIndex: 1,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[50],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    height: 44,
  },
  searchIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 8,
    fontSize: 16,
    color: Colors.text.primary,
  },
  filterButton: {
    width: 44,
    height: 44,
    backgroundColor: Colors.primary[500],
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  cardContainer: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  closeButton: {
    padding: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  featuresRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewDetailsButton: {
    width: '100%',
  },
});

export default MapScreen;