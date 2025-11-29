import { Ionicons } from '@expo/vector-icons';
import { Badge, Box, HStack, VStack } from 'native-base';
import React from 'react';
import { Pressable } from 'react-native';

import { Colors } from '../../constants/Colors';
import AppText from '../base/AppText';

interface MapMarkerProps {
  property: {
    id: number;
    title: string;
    price: number;
    listingType: 'For Sale' | 'For Rent';
    isFeatured?: boolean;
  };
  isSelected?: boolean;
  onPress?: () => void;
}

const formatPricePKR = (price: number) => {
  if (price >= 10000000) {
    return `Rs ${(price / 10000000).toFixed(1)} Cr`;
  }
  if (price >= 100000) {
    return `Rs ${(price / 100000).toFixed(1)} L`;
  }
  return `Rs ${price.toLocaleString()}`;
};

const MapMarker: React.FC<MapMarkerProps> = ({
  property,
  isSelected = false,
  onPress
}) => {
  const getMarkerColor = () => {
    if (property.listingType === 'For Sale') return Colors.status.forSale;
    if (property.listingType === 'For Rent') return Colors.status.forRent;
    return Colors.primary;
  };

  if (isSelected) {
    return (
      <Pressable onPress={onPress}>
        <Box 
          bg="white" 
          borderRadius="lg" 
          p={3} 
          shadow={4} 
          minWidth={200}
          borderColor={getMarkerColor()}
          borderWidth={2}
        >
          <VStack space={1}>
            <AppText variant="body" weight="semibold" numberOfLines={2}>
              {property.title}
            </AppText>
            
            <AppText variant="h3" color="primary">
              {formatPricePKR(property.price)}
            </AppText>
            
            <HStack space={2} alignItems="center">
              <Badge 
                colorScheme={property.listingType === 'For Sale' ? 'success' : 'warning'}
                variant="solid"
                size="sm"
              >
                {property.listingType}
              </Badge>
              
              {property.isFeatured && (
                <Badge colorScheme="secondary" variant="solid" size="sm">
                  Featured
                </Badge>
              )}
            </HStack>
          </VStack>
        </Box>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress}>
      <Box
        width={40}
        height={40}
        borderRadius="full"
        backgroundColor={getMarkerColor()}
        justifyContent="center"
        alignItems="center"
        shadow={3}
        borderWidth={3}
        borderColor="white"
      >
        <Ionicons name="home" size={16} color="white" />
        
        {property.isFeatured && (
          <Box
            position="absolute"
            top={-2}
            right={-2}
            width={4}
            height={4}
            borderRadius="full"
            backgroundColor={Colors.secondary}
            justifyContent="center"
            alignItems="center"
          >
            <Ionicons name="star" size={8} color="white" />
          </Box>
        )}
        
        {/* Price Badge */}
        <Box
          position="absolute"
          bottom={-12}
          backgroundColor="white"
          px={2}
          py={1}
          borderRadius="md"
          shadow={1}
          minWidth={50}
        >
          <AppText variant="small" weight="semibold" align="center">
            {formatPricePKR(property.price)}
          </AppText>
        </Box>
      </Box>
    </Pressable>
  );
};

export default MapMarker;