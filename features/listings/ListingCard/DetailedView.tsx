// @ts-nocheck
import { Ionicons } from '@expo/vector-icons';
import { Badge, Box, HStack, IconButton, Image, Pressable, VStack } from 'native-base';
import React from 'react';

import { Property } from '../../../api/apiMock';
import AppText from '../../../components/base/AppText';
import { Colors } from '../../../constants/Colors';
import { BorderRadius, Shadows } from '../../../constants/Layout';
import { useFavorites } from '../../../context/FavoritesContext';

interface DetailedViewProps {
  property: Property;
  onPress: (propertyId: number) => void;
  onSharePress?: (property: Property) => void;
  onContactPress?: (property: Property) => void;
}

const DetailedView: React.FC<DetailedViewProps> = ({ 
  property, 
  onPress,
  onSharePress,
  onContactPress
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  const handlePress = () => {
    onPress(property.id);
  };

  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    toggleFavorite(property.id);
  };

  const handleSharePress = (e: any) => {
    e.stopPropagation();
    onSharePress?.(property);
  };

  const handleContactPress = (e: any) => {
    e.stopPropagation();
    onContactPress?.(property);
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `Rs ${(price / 10000000).toFixed(1)} Crore`;
    } else if (price >= 100000) {
      return `Rs ${(price / 100000).toFixed(1)} Lac`;
    }
    return `Rs ${price.toLocaleString()}`;
  };

  const getPropertyAge = (datePosted: string) => {
    const postedDate = new Date(datePosted);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - postedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <Pressable onPress={handlePress}>
      {({ isPressed }) => (
        <Box 
          bg="white" 
          borderRadius={BorderRadius.xl}
          shadow={Shadows.md}
          overflow="hidden"
          opacity={isPressed ? 0.9 : 1}
          style={{ transform: [{ scale: isPressed ? 0.98 : 1 }] }}
        >
          {/* Property Image */}
          <Box position="relative">
            <Image
              source={{ uri: property.images[0] }}
              alt={property.title}
              width="100%"
              height={200}
              resizeMode="cover"
            />
            
            {/* Badges */}
            <HStack position="absolute" top={3} left={3} space={2}>
              <Badge 
                colorScheme={property.listingType === 'For Sale' ? 'success' : 'warning'}
                variant="solid"
                borderRadius={BorderRadius.md}
              >
                {property.listingType}
              </Badge>
              
              {property.isFeatured && (
                <Badge 
                  colorScheme="secondary" 
                  variant="solid"
                  borderRadius={BorderRadius.md}
                >
                  Featured
                </Badge>
              )}
            </HStack>

            {/* Action Buttons */}
            <HStack position="absolute" top={3} right={3} space={1}>
              <IconButton
                icon={<Ionicons name="share-outline" size={16} color="white" />}
                onPress={handleSharePress}
                bg="rgba(0,0,0,0.5)"
                borderRadius="full"
                size="sm"
                _pressed={{ bg: 'rgba(0,0,0,0.7)' }}
              />
              
              <IconButton
                icon={
                  <Ionicons 
                    name={isFavorite(property.id) ? "heart" : "heart-outline"} 
                    size={16} 
                    color={isFavorite(property.id) ? Colors.status.featured : "white"} 
                  />
                }
                onPress={handleFavoritePress}
                bg="rgba(0,0,0,0.5)"
                borderRadius="full"
                size="sm"
                _pressed={{ bg: 'rgba(0,0,0,0.7)' }}
              />
            </HStack>
          </Box>

          {/* Property Details */}
          <VStack space={3} p={4}>
            {/* Title and Price */}
            <VStack space={1}>
              <AppText variant="h4" weight="semibold" numberOfLines={2}>
                {property.title}
              </AppText>
              <AppText variant="h2" weight="bold" color="primary">
                {formatPrice(property.price)}
              </AppText>
            </VStack>

            {/* Key Features */}
            <HStack justifyContent="space-between" alignItems="center">
              <HStack space={4}>
                <HStack space={1} alignItems="center">
                  <Ionicons name="bed-outline" size={16} color={Colors.text.secondary} />
                  <AppText variant="body" color="secondary">
                    {property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}
                  </AppText>
                </HStack>
                
                <HStack space={1} alignItems="center">
                  <Ionicons name="expand-outline" size={16} color={Colors.text.secondary} />
                  <AppText variant="body" color="secondary">
                    {property.areaSize} sq ft
                  </AppText>
                </HStack>
              </HStack>
              
              <AppText variant="body" color="secondary">
                {property.propertyCategory}
              </AppText>
            </HStack>

            {/* Location */}
            <HStack space={2} alignItems="flex-start">
              <Ionicons name="location-outline" size={14} color={Colors.text.secondary} style={{ marginTop: 2 }} />
              <AppText variant="body" color="secondary" numberOfLines={2} flex={1}>
                {property.address.line1}, {property.address.city}
              </AppText>
            </HStack>

            {/* Additional Info and Actions */}
            <HStack justifyContent="space-between" alignItems="center">
              <AppText variant="small" color="disabled">
                {getPropertyAge(property.datePosted)}
              </AppText>
              
              <Pressable 
                onPress={handleContactPress}
                hitSlop={8}
              >
                <HStack space={1} alignItems="center">
                  <AppText variant="body" color="primary" weight="medium">
                    Contact
                  </AppText>
                  <Ionicons name="arrow-forward" size={14} color={Colors.primary[500]} />
                </HStack>
              </Pressable>
            </HStack>
          </VStack>
        </Box>
      )}
    </Pressable>
  );
};

export default DetailedView;