// @ts-nocheck
import { Ionicons } from '@expo/vector-icons';
import { Badge, Box, HStack, Image, Pressable, VStack } from 'native-base';
import React from 'react';

import { Property } from '../../../api/apiMock';
import AppText from '../../../components/base/AppText';
import { Colors } from '../../../constants/Colors';
import { BorderRadius, Shadows } from '../../../constants/Layout';
import { useFavorites } from '../../../context/FavoritesContext';

interface GridViewProps {
  property: Property;
  onPress: (propertyId: number) => void;
  onFavoritePress?: (propertyId: number) => void;
}

const GridView: React.FC<GridViewProps> = ({ 
  property, 
  onPress,
  onFavoritePress 
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  const handlePress = () => {
    onPress(property.id);
  };

  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    toggleFavorite(property.id);
    onFavoritePress?.(property.id);
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `Rs ${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
      return `Rs ${(price / 100000).toFixed(1)}L`;
    }
    return `Rs ${price.toLocaleString()}`;
  };

  return (
    <Pressable onPress={handlePress} flex={1}>
      {({ isPressed }) => (
        <Box 
          bg="white" 
          borderRadius={BorderRadius.lg}
          shadow={Shadows.sm}
          overflow="hidden"
          opacity={isPressed ? 0.9 : 1}
          style={{ transform: [{ scale: isPressed ? 0.98 : 1 }] }}
          flex={1}
        >
          {/* Property Image */}
          <Box position="relative">
            <Image
              source={{ uri: property.images[0] }}
              alt={property.title}
              width="100%"
              aspectRatio={1}
              resizeMode="cover"
            />
            
            {/* Badges */}
            <VStack position="absolute" top={2} left={2} space={1}>
              <Badge 
                colorScheme={property.listingType === 'For Sale' ? 'success' : 'warning'}
                variant="solid"
                size="sm"
                borderRadius={BorderRadius.sm}
              >
                {property.listingType === 'For Sale' ? 'Sale' : 'Rent'}
              </Badge>
              
              {property.isFeatured && (
                <Badge 
                  colorScheme="secondary" 
                  variant="solid"
                  size="sm"
                  borderRadius={BorderRadius.sm}
                >
                  Featured
                </Badge>
              )}
            </VStack>

            {/* Favorite Button */}
            <Pressable
              position="absolute"
              top={2}
              right={2}
              onPress={handleFavoritePress}
              hitSlop={8}
            >
              <Box
                bg="rgba(255,255,255,0.9)"
                width={8}
                height={8}
                borderRadius="full"
                justifyContent="center"
                alignItems="center"
              >
                <Ionicons 
                  name={isFavorite(property.id) ? "heart" : "heart-outline"} 
                  size={16} 
                  color={isFavorite(property.id) ? Colors.status.featured : Colors.text.primary} 
                />
              </Box>
            </Pressable>
          </Box>

          {/* Property Details */}
          <VStack space={2} p={3}>
            {/* Price */}
            <AppText variant="h3" weight="bold" color="primary" numberOfLines={1}>
              {formatPrice(property.price)}
            </AppText>

            {/* Title */}
            <AppText variant="body" weight="semibold" numberOfLines={2} minHeight={40}>
              {property.title}
            </AppText>

            {/* Key Features */}
            <HStack space={3} alignItems="center">
              <HStack space={1} alignItems="center">
                <Ionicons name="bed-outline" size={12} color={Colors.text.secondary} />
                <AppText variant="small" color="secondary">
                  {property.bedrooms}
                </AppText>
              </HStack>
              
              <HStack space={1} alignItems="center">
                <Ionicons name="expand-outline" size={12} color={Colors.text.secondary} />
                <AppText variant="small" color="secondary">
                  {property.areaSize} sq ft
                </AppText>
              </HStack>
            </HStack>

            {/* Location */}
            <AppText variant="small" color="secondary" numberOfLines={1}>
              {property.address.city}
            </AppText>
          </VStack>
        </Box>
      )}
    </Pressable>
  );
};

export default GridView;