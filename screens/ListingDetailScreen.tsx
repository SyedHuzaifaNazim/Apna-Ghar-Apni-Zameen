import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  Badge,
  Box,
  Button,
  Divider,
  HStack,
  IconButton,
  Image,
  ScrollView,
  Text,
  VStack
} from 'native-base';
import React, { useMemo } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

// Hooks and Context
import { MOCK_PROPERTIES } from '../api/apiMock';
import { Colors } from '../constants/Colors';
import { useFavorites } from '../context/FavoritesContext';

const ListingDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { propertyId } = route.params as { propertyId: number };
  const { isFavorite, toggleFavorite } = useFavorites();

  const property = useMemo(() => {
    return MOCK_PROPERTIES.find(p => p.id === propertyId);
  }, [propertyId]);

  if (!property) {
    return (
      <Box flex={1} bg="white" safeArea justifyContent="center" alignItems="center">
        <Ionicons name="warning-outline" size={64} color={Colors.error[500]} />
        <Text fontSize="lg" fontWeight="semibold" mt={4}>
          Property not found
        </Text>
        <Button onPress={() => navigation.goBack()} mt={4} backgroundColor="primary.500">
          Go Back
        </Button>
      </Box>
    );
  }

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `${(price / 1000000).toFixed(1)} Million`;
    } else if (price >= 100000) {
      return `${(price / 100000).toFixed(1)} Lakh`;
    }
    return price.toLocaleString();
  };

  return (
    <Box flex={1} bg="white" safeArea>
      {/* Header */}
      <Box position="relative">
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
          {property.images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              alt={`Property image ${index + 1}`}
              width={400}
              height={300}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
        
        {/* Back Button */}
        <IconButton
          position="absolute"
          top={4}
          left={4}
          backgroundColor="white"
          borderRadius="full"
          icon={<Ionicons name="arrow-back" size={20} />}
          onPress={() => navigation.goBack()}
        />
        
        {/* Favorite Button */}
        <IconButton
          position="absolute"
          top={4}
          right={4}
          backgroundColor="white"
          borderRadius="full"
          icon={
            <Ionicons 
              name={isFavorite(property.id) ? "heart" : "heart-outline"} 
              size={20} 
              color={isFavorite(property.id) ? Colors.status.featured : Colors.text.primary} 
            />
          }
          onPress={() => toggleFavorite(property.id)}
        />
        
        {/* Badges */}
        <HStack position="absolute" bottom={4} left={4} space={2}>
          <Badge colorScheme={property.listingType === 'For Sale' ? 'success' : 'warning'} variant="solid">
            {property.listingType}
          </Badge>
          {property.isFeatured && (
            <Badge colorScheme="secondary" variant="solid">
              Featured
            </Badge>
          )}
        </HStack>
      </Box>

      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack space={4} p={4}>
          {/* Title and Price */}
          <VStack space={2}>
            <Text fontSize="2xl" fontWeight="bold" color="text.primary">
              {property.title}
            </Text>
            <Text fontSize="3xl" fontWeight="bold" color="primary.500">
              {formatPrice(property.price)} {property.currency}
            </Text>
          </VStack>

          {/* Key Details */}
          <HStack justifyContent="space-around" bg="gray.50" p={3} borderRadius="lg">
            <VStack alignItems="center" space={1}>
              <Ionicons name="bed-outline" size={24} color={Colors.primary[500]} />
              <Text fontSize="sm" color="text.secondary">Bedrooms</Text>
              <Text fontSize="lg" fontWeight="bold">{property.bedrooms}</Text>
            </VStack>
            <VStack alignItems="center" space={1}>
              <Ionicons name="resize-outline" size={24} color={Colors.primary[500]} />
              <Text fontSize="sm" color="text.secondary">Area</Text>
              <Text fontSize="lg" fontWeight="bold">{property.areaSize} sq ft</Text>
            </VStack>
            <VStack alignItems="center" space={1}>
              <Ionicons name="business-outline" size={24} color={Colors.primary[500]} />
              <Text fontSize="sm" color="text.secondary">Type</Text>
              <Text fontSize="lg" fontWeight="bold">{property.propertyCategory}</Text>
            </VStack>
          </HStack>

          <Divider />

          {/* Description */}
          <VStack space={2}>
            <Text fontSize="lg" fontWeight="semibold">Description</Text>
            <Text fontSize="md" color="text.secondary" lineHeight={24}>
              {property.description}
            </Text>
          </VStack>

          <Divider />

          {/* Address */}
          <VStack space={2}>
            <Text fontSize="lg" fontWeight="semibold">Address</Text>
            <HStack alignItems="flex-start" space={2}>
              <Ionicons name="location-outline" size={20} color={Colors.text.secondary} />
              <VStack flex={1}>
                <Text fontSize="md" color="text.primary">{property.address.line1}</Text>
                <Text fontSize="md" color="text.secondary">{property.address.city}</Text>
              </VStack>
            </HStack>
          </VStack>

          <Divider />

          {/* Map */}
          <VStack space={2}>
            <Text fontSize="lg" fontWeight="semibold">Location</Text>
            <Box height={200} borderRadius="lg" overflow="hidden">
              <MapView
                style={{ flex: 1 }}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                  latitude: property.address.latitude,
                  longitude: property.address.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
              >
                <Marker
                  coordinate={{
                    latitude: property.address.latitude,
                    longitude: property.address.longitude,
                  }}
                  title={property.title}
                />
              </MapView>
            </Box>
          </VStack>

          <Divider />

          {/* Contact Actions */}
          <VStack space={3} pb={8}>
            <Text fontSize="lg" fontWeight="semibold" textAlign="center">
              Interested in this property?
            </Text>
            <HStack space={3}>
              <Button 
                flex={1} 
                variant="outline" 
                leftIcon={<Ionicons name="call-outline" size={20} />}
                borderColor="primary.500"
              >
                Call Agent
              </Button>
              <Button 
                flex={1} 
                variant="outline"
                leftIcon={<Ionicons name="chatbubble-outline" size={20} />}
                borderColor="primary.500"
              >
                Message
              </Button>
            </HStack>
            <Button 
              backgroundColor="primary.500"
              leftIcon={<Ionicons name="calendar-outline" size={20} color="white" />}
            >
              Schedule Viewing
            </Button>
          </VStack>
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default ListingDetailScreen;