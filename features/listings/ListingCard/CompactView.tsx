// @ts-nocheck
import { Ionicons } from '@expo/vector-icons';
import { Badge, Box, HStack, Image, Pressable, VStack } from 'native-base';
import React from 'react';

import { Property } from '../../../api/apiMock';
import AppText from '../../../components/base/AppText';
import { Colors } from '../../../constants/Colors';
import { BorderRadius, Shadows } from '../../../constants/Layout';
import { useFavorites } from '../../../context/FavoritesContext';

interface CompactViewProps {
  property: Property;
  onPress: (propertyId: number) => void;
  onFavoritePress?: (propertyId: number) => void;
}

const CompactView: React.FC<CompactViewProps> = ({ 
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
    <Pressable onPress={handlePress}>
      {({ isPressed }) => (
        <Box 
          bg="white" 
          borderRadius={BorderRadius.lg}
          shadow={Shadows.sm}
          overflow="hidden"
          opacity={isPressed ? 0.9 : 1}
          style={{ transform: [{ scale: isPressed ? 0.98 : 1 }] }}
        >
          <HStack space={3} alignItems="center" p={3}>
            {/* Property Image */}
            <Box position="relative">
              <Image
                source={{ uri: property.images[0] }}
                alt={property.title}
                width={16}
                height={16}
                borderRadius={BorderRadius.md}
                resizeMode="cover"
              />
              
              {/* Listing Type Badge */}
              <Badge
                position="absolute"
                top={1}
                left={1}
                colorScheme={property.listingType === 'For Sale' ? 'success' : 'warning'}
                variant="solid"
                size="sm"
                borderRadius={BorderRadius.sm}
              >
                {property.listingType === 'For Sale' ? 'Sale' : 'Rent'}
              </Badge>
            </Box>

            {/* Property Info */}
            <VStack flex={1} space={1}>
              <AppText variant="body" weight="semibold" numberOfLines={1}>
                {property.title}
              </AppText>
              
              <AppText variant="h3" weight="bold" color="primary">
                {formatPrice(property.price)}
              </AppText>
              
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
              
              <AppText variant="small" color="secondary" numberOfLines={1}>
                {property.address.line1}
              </AppText>
            </VStack>

            {/* Favorite Button */}
            <Pressable onPress={handleFavoritePress} hitSlop={8}>
              <Ionicons 
                name={isFavorite(property.id) ? "heart" : "heart-outline"} 
                size={16} 
                color={isFavorite(property.id) ? Colors.status.featured : Colors.text.primary} 
              />
            </Pressable>
          </HStack>
        </Box>
      )}
    </Pressable>
  );
};

export default CompactView;