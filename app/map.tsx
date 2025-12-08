import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';

import { Property } from '@/api/apiMock';
import AppButton from '@/components/base/AppButton';
import AppText from '@/components/base/AppText';
import { Colors } from '@/constants/Colors';
import { useFetchProperties } from '@/hooks/useFetchProperties';

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
    const defaultKarachi = {
      latitude: 24.8607,
      longitude: 67.0011,
      latitudeDelta: 0.2,
      longitudeDelta: 0.2,
    };

    if (properties.length === 0) {
      return defaultKarachi;
    }

    const latitudes = properties.map(p => p.address.latitude);
    const longitudes = properties.map(p => p.address.longitude);
    
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    const latDelta = Math.max((maxLat - minLat) * 1.5, 0.05);
    const lngDelta = Math.max((maxLng - minLng) * 1.5, 0.05);
    
    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: latDelta,
      longitudeDelta: lngDelta,
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

  const formatPrice = (price: number): string => {
    if (price >= 10000000) {
      return `Rs ${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `Rs ${(price / 100000).toFixed(1)} Lac`;
    }
    return `Rs ${price.toLocaleString()}`;
  };

  const getMarkerColor = (property: Property) => {
    if (property.listingType === 'For Sale') return Colors.status.forSale;
    if (property.listingType === 'For Rent') return Colors.status.forRent;
    return Colors.primary[500];
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
              placeholder="Search city, area, or property name..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.input}
              placeholderTextColor={Colors.gray[500]}
            />
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => { router.push('/modal'); }} // Use modal for filter
            activeOpacity={0.8}
          >
            <Ionicons name="options-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Map */}
      <View style={styles.flex1}>
        <MapView
          style={styles.flex1}
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
              pinColor={getMarkerColor(property) as string | undefined}
              onPress={() => handleMarkerPress(property)}
            />
          ))}
        </MapView>
      </View>

      {/* Property Info Card (Modern Floating Card) */}
      {selectedProperty && (
        <View 
          style={styles.propertyCard} 
        >
          <View style={styles.propertyCardVStack}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleVStack}>
                <AppText style={styles.cardTitle} numberOfLines={2}>
                  {selectedProperty.title}
                </AppText>
                <AppText style={styles.cardSubtitle} numberOfLines={1}>
                  {selectedProperty.address.area}, {selectedProperty.address.city}
                </AppText>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedProperty(null)}
                style={{ padding: 4 }}
              >
                <Ionicons name="close" size={24} color={Colors.gray[500]} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.cardPriceRow}>
              <AppText style={styles.cardPrice}>
                {formatPrice(selectedProperty.price)}
              </AppText>
              <AppText style={styles.cardArea}>
                {selectedProperty.areaSize.toLocaleString()} {selectedProperty.areaUnit}
              </AppText>
            </View>
            
            <View style={styles.cardDetailsRow}>
              <View style={styles.cardDetailItem}>
                <Ionicons name="bed-outline" size={16} color={Colors.primary[500]} />
                <AppText style={styles.cardDetailText}>
                  {selectedProperty.bedrooms} Beds
                </AppText>
              </View>
              <View style={styles.cardDetailItem}>
                <Ionicons name="water-outline" size={16} color={Colors.primary[500]} />
                <AppText style={styles.cardDetailText}>
                  {selectedProperty.bathrooms} Baths
                </AppText>
              </View>
              <View style={styles.cardDetailItem}>
                <Ionicons name="business-outline" size={16} color={Colors.primary[500]} />
                <AppText style={styles.cardDetailText} numberOfLines={1}>
                  {selectedProperty.propertyCategory}
                </AppText>
              </View>
            </View>
            
            <AppButton 
              onPress={handleViewDetails}
              style={styles.cardButton}
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
  flex1: {
    flex: 1,
  },
  searchBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    shadowColor: Colors.shadow.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
    backgroundColor: Colors.background.secondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border.light,
    height: 48,
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
    borderRadius: 8,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Property Card
  propertyCard: {
    position: 'absolute', 
    bottom: 16, 
    left: 16, 
    right: 16, 
    backgroundColor: 'white', 
    borderRadius: 16, 
    shadowColor: Colors.shadow.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    padding: 16,
  },
  propertyCardVStack: {
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitleVStack: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  cardSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  cardPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primary[600],
  },
  cardArea: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  cardDetailsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  cardDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardDetailText: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  cardButton: {
    marginTop: 8,
    backgroundColor: Colors.primary[500],
    borderRadius: 8,
    paddingVertical: 12,
  },
});

export default MapScreen;