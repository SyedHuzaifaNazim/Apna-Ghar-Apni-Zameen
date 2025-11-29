import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Box, Button, HStack, IconButton, Input, Text, VStack } from 'native-base';
import React, { useMemo, useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';

import { Property } from '@/api/apiMock';
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
    if (property.listingType === 'For Sale') return Colors.status.forSale;
    if (property.listingType === 'For Rent') return Colors.status.forRent;
    return Colors.primary;
  };

  return (
    <Box flex={1} bg="white" safeArea>
      {/* Search Bar */}
      <Box px={4} py={3} bg="white" shadow={1}>
        <HStack space={3} alignItems="center">
          <Input
            placeholder="Search on map..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            flex={1}
            backgroundColor="gray.50"
            borderRadius="lg"
            fontSize="md"
            InputLeftElement={
              <Ionicons 
                name="search" 
                size={20} 
                color={Colors.text.secondary} 
                style={{ marginLeft: 12 }}
              />
            }
            variant="unstyled"
          />
          <IconButton
            backgroundColor="primary.500"
            borderRadius="lg"
            icon={
              <Ionicons name="options-outline" size={20} color="white" />
            }
            onPress={() => {/* Implement map filters */}}
            _pressed={{ backgroundColor: "primary.600" }}
          />
        </HStack>
      </Box>

      {/* Map */}
      <Box flex={1}>
        <MapView
          style={{ flex: 1 }}
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
      </Box>

      {/* Property Info Card */}
      {selectedProperty && (
        <Box 
          position="absolute" 
          bottom={4} 
          left={4} 
          right={4} 
          bg="white" 
          borderRadius="lg" 
          shadow={4}
          p={4}
        >
          <VStack space={2}>
            <HStack justifyContent="space-between" alignItems="flex-start">
              <VStack flex={1} space={1}>
                <Text fontSize="lg" fontWeight="bold" numberOfLines={2}>
                  {selectedProperty.title}
                </Text>
                <Text fontSize="sm" color="text.secondary" numberOfLines={1}>
                  {selectedProperty.address.line1}
                </Text>
              </VStack>
              <IconButton
                icon={<Ionicons name="close" size={20} />}
                onPress={() => setSelectedProperty(null)}
                size="sm"
              />
            </HStack>
            
            <HStack justifyContent="space-between" alignItems="center">
              <Text fontSize="xl" fontWeight="bold" color="primary.500">
                {selectedProperty.price.toLocaleString()} {selectedProperty.currency}
              </Text>
              <Text fontSize="sm" color="text.secondary">
                {selectedProperty.areaSize} sq ft
              </Text>
            </HStack>
            
            <HStack space={4}>
              <HStack alignItems="center" space={1}>
                <Ionicons name="bed-outline" size={16} color={Colors.text.secondary} />
                <Text fontSize="sm" color="text.secondary">
                  {selectedProperty.bedrooms} Beds
                </Text>
              </HStack>
              <HStack alignItems="center" space={1}>
                <Ionicons name="business-outline" size={16} color={Colors.text.secondary} />
                <Text fontSize="sm" color="text.secondary">
                  {selectedProperty.propertyCategory}
                </Text>
              </HStack>
            </HStack>
            
            <Button 
              onPress={handleViewDetails}
              backgroundColor="primary.500"
              mt={2}
            >
              View Details
            </Button>
          </VStack>
        </Box>
      )}
    </Box>
  );
};

export default MapScreen;