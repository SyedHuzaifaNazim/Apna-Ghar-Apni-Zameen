import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Badge, Box, HStack, IconButton, Image, Pressable, Text, VStack } from 'native-base';
import React from 'react';
import { Property } from '../../api/apiMock';
import { Colors } from '../../constants/Colors';
import { useFavorites } from '../../context/FavoritesContext';

interface PropertyCardProps {
  property: Property;
  onPress?: (property: Property) => void;
  variant?: 'default' | 'featured';
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onPress, variant = 'default' }) => {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();

  const handlePress = () => {
    if (onPress) {
      onPress(property);
      return;
    }

    router.push({
      pathname: '/listing/[id]',
      params: { id: property.id.toString() },
    });
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 100000) {
      return `${(price / 100000).toFixed(1)}L`;
    }
    return price.toLocaleString();
  };

  return (
    <Pressable onPress={handlePress}>
      {({ isPressed }) => (
        <Box 
          bg="white" 
          borderRadius="lg" 
          shadow={2} 
          mb={4}
          overflow="hidden"
          opacity={isPressed ? 0.9 : 1}
          style={{ transform: [{ scale: isPressed ? 0.98 : 1 }] }}
        >
          <Box position="relative">
            <Image
              source={{ uri: property.images[0] }}
              alt={property.title}
              height={200}
              resizeMode="cover"
            />
            <Box position="absolute" top={2} left={2}>
              <Badge 
                colorScheme={property.listingType === 'For Sale' ? 'success' : 'warning'}
                borderRadius="md"
                variant="solid"
              >
                {property.listingType}
              </Badge>
            </Box>
            {property.isFeatured && (
              <Box position="absolute" top={2} right={2}>
                <Badge colorScheme="secondary" borderRadius="md" variant="solid">
                  Featured
                </Badge>
              </Box>
            )}
            {!onPress && (
              <IconButton
                position="absolute"
                bottom={2}
                right={2}
                backgroundColor="white"
                borderRadius="full"
                size="sm"
                icon={
                  <Ionicons 
                    name={isFavorite(property.id) ? "heart" : "heart-outline"} 
                    size={20} 
                    color={isFavorite(property.id) ? Colors.status.featured : Colors.text.primary} 
                  />
                }
                onPress={() => toggleFavorite(property.id)}
                _pressed={{ backgroundColor: "gray.100" }}
              />
            )}
          </Box>
          
          <VStack p={4} space={2}>
            <Text fontSize="lg" fontWeight="bold" color="text.primary" numberOfLines={2}>
              {property.title}
            </Text>
            
            <HStack justifyContent="space-between" alignItems="center">
              <Text fontSize="xl" fontWeight="bold" color="primary.500">
                {formatPrice(property.price)} {property.currency}
              </Text>
              <Text fontSize="sm" color="text.secondary">
                {property.areaSize} sq ft
              </Text>
            </HStack>
            
            <HStack space={4}>
              <HStack alignItems="center" space={1}>
                <Ionicons name="bed-outline" size={16} color={Colors.text.secondary} />
                <Text fontSize="sm" color="text.secondary">
                  {property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}
                </Text>
              </HStack>
              <HStack alignItems="center" space={1}>
                <Ionicons name="business-outline" size={16} color={Colors.text.secondary} />
                <Text fontSize="sm" color="text.secondary">
                  {property.propertyCategory}
                </Text>
              </HStack>
            </HStack>
            
            <HStack alignItems="center" space={1}>
              <Ionicons name="location-outline" size={14} color={Colors.text.secondary} />
              <Text fontSize="sm" color="text.secondary" numberOfLines={1} flex={1}>
                {property.address.line1}, {property.address.city}
              </Text>
            </HStack>
            
            <Text fontSize="xs" color="text.disabled">
              Posted {new Date(property.datePosted).toLocaleDateString()}
            </Text>
          </VStack>
        </Box>
      )}
    </Pressable>
  );
};

export default PropertyCard;