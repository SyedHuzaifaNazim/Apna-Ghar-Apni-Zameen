// @ts-nocheck
import { Ionicons } from '@expo/vector-icons';
import { Badge, Box, Divider, HStack, VStack } from 'native-base';
import React from 'react';

import { Property } from '../../../api/apiMock';
import AppText from '../../../components/base/AppText';
import { Colors } from '../../../constants/Colors';
import { BorderRadius } from '../../../constants/Layout';

interface PropertyInfoProps {
  property: Property;
}

const PropertyInfo: React.FC<PropertyInfoProps> = ({ property }) => {
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `Rs ${(price / 10000000).toFixed(1)} Crore`;
    } else if (price >= 100000) {
      return `Rs ${(price / 100000).toFixed(1)} Lakh`;
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

  const features = [
    {
      icon: 'bed-outline',
      label: 'Bedrooms',
      value: `${property.bedrooms} ${property.bedrooms === 1 ? 'Bed' : 'Beds'}`,
    },
    {
      icon: 'water-outline',
      label: 'Bathrooms',
      value: property.bedrooms > 1 ? `${property.bedrooms} Baths` : '1 Bath', // Mock data
    },
    {
      icon: 'expand-outline',
      label: 'Area',
      value: `${property.areaSize.toLocaleString()} sq ft`,
    },
    {
      icon: 'business-outline',
      label: 'Type',
      value: property.propertyCategory,
    },
    {
      icon: 'car-outline',
      label: 'Parking',
      value: property.bedrooms > 2 ? '2 Spaces' : '1 Space', // Mock data
    },
    {
      icon: 'calendar-outline',
      label: 'Posted',
      value: getPropertyAge(property.datePosted),
    },
  ];

  const amenities = [
    'Swimming Pool',
    'Gym',
    'Security',
    'Parking',
    'Garden',
    'Lift',
    'Power Backup',
    'Water Supply',
  ];

  return (
    <VStack space={6} bg="white" p={5} borderRadius={BorderRadius.xl}>
      {/* Price and Basic Info */}
      <VStack space={3}>
        <HStack justifyContent="space-between" alignItems="flex-start">
          <VStack flex={1} space={1}>
            <AppText variant="h1" weight="bold">
              {formatPrice(property.price)}
            </AppText>
            <AppText variant="body" color="secondary">
              {property.listingType} • {property.propertyCategory}
            </AppText>
          </VStack>
          
          <HStack space={2}>
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
        </HStack>

        <AppText variant="h3" weight="semibold">
          {property.title}
        </AppText>
      </VStack>

      <Divider />

      {/* Key Features Grid */}
      <VStack space={4}>
        <AppText variant="h4" weight="semibold">Key Features</AppText>
        <Box 
          bg={Colors.background.secondary}
          p={4}
          borderRadius={BorderRadius.lg}
        >
          <HStack flexWrap="wrap" justifyContent="space-between">
            {features.map((feature, index) => (
              <VStack 
                key={feature.label}
                width="48%"
                alignItems="center"
                space={2}
                mb={4}
                minHeight={70}
              >
                <Box 
                  width={12}
                  height={12}
                  borderRadius="full"
                  bg={Colors.primary[50]}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Ionicons name={feature.icon as any} size={20} color={Colors.primary[500]} />
                </Box>
                <VStack space={1} alignItems="center">
                  <AppText variant="body" weight="medium" align="center">
                    {feature.value}
                  </AppText>
                  <AppText variant="small" color="secondary" align="center">
                    {feature.label}
                  </AppText>
                </VStack>
              </VStack>
            ))}
          </HStack>
        </Box>
      </VStack>

      <Divider />

      {/* Description */}
      <VStack space={3}>
        <AppText variant="h4" weight="semibold">Description</AppText>
        <AppText variant="body" color="secondary" lineHeight={24}>
          {property.description}
        </AppText>
      </VStack>

      <Divider />

      {/* Amenities */}
      <VStack space={3}>
        <AppText variant="h4" weight="semibold">Amenities</AppText>
        <HStack flexWrap="wrap" space={2}>
          {amenities.map((amenity, index) => (
            <Box
              key={amenity}
              bg={Colors.primary[50]}
              px={3}
              py={2}
              borderRadius={BorderRadius.md}
              mb={2}
            >
              <HStack space={2} alignItems="center">
                <Ionicons name="checkmark" size={16} color={Colors.primary[500]} />
                <AppText variant="body" color="primary" weight="medium">
                  {amenity}
                </AppText>
              </HStack>
            </Box>
          ))}
        </HStack>
      </VStack>

      <Divider />

      {/* Location */}
      <VStack space={3}>
        <AppText variant="h4" weight="semibold">Location</AppText>
        <HStack space={3} alignItems="flex-start">
          <Ionicons name="location-outline" size={20} color={Colors.text.secondary} />
          <VStack flex={1} space={1}>
            <AppText variant="body" weight="medium">
              {property.address.line1}
            </AppText>
            <AppText variant="body" color="secondary">
              {property.address.city}
            </AppText>
          </VStack>
        </HStack>
      </VStack>

      {/* Additional Details */}
      <VStack space={3}>
        <AppText variant="h4" weight="semibold">Additional Details</AppText>
        <VStack space={2}>
          <HStack justifyContent="space-between">
            <AppText variant="body" color="secondary">Property ID</AppText>
            <AppText variant="body" weight="medium">#{property.id}</AppText>
          </HStack>
          <HStack justifyContent="space-between">
            <AppText variant="body" color="secondary">Posted On</AppText>
            <AppText variant="body" weight="medium">
              {new Date(property.datePosted).toLocaleDateString()}
            </AppText>
          </HStack>
          <HStack justifyContent="space-between">
            <AppText variant="body" color="secondary">Last Updated</AppText>
            <AppText variant="body" weight="medium">
              {getPropertyAge(property.datePosted)}
            </AppText>
          </HStack>
        </VStack>
      </VStack>
    </VStack>
  );
};

export default PropertyInfo;