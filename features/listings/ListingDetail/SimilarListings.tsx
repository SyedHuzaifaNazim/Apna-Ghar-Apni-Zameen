// @ts-nocheck
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Box, HStack, Pressable, ScrollView, VStack } from 'native-base';
import React from 'react';

import { MOCK_PROPERTIES, Property } from '../../../api/apiMock';
import AppText from '../../../components/base/AppText';
import PropertyCard from '../../../components/ui/PropertyCard';
import { Colors } from '../../../constants/Colors';
import { BorderRadius } from '../../../constants/Layout';
import { analyticsService } from '../../../services/analyticsService';

interface SimilarListingsProps {
  currentProperty: Property;
  count?: number;
}

const SimilarListings: React.FC<SimilarListingsProps> = ({ 
  currentProperty, 
  count = 4 
}) => {
  const navigation = useNavigation();

  // Filter similar properties based on criteria
  const getSimilarProperties = (): Property[] => {
    return MOCK_PROPERTIES
      .filter(property => 
        property.id !== currentProperty.id && // Exclude current property
        (property.propertyCategory === currentProperty.propertyCategory ||
         property.address.city === currentProperty.address.city ||
         Math.abs(property.price - currentProperty.price) / currentProperty.price < 0.3) // Within 30% price range
      )
      .slice(0, count);
  };

  const similarProperties = getSimilarProperties();

  const handlePropertyPress = (property: Property) => {
    analyticsService.track('similar_property_click', {
      from_property_id: currentProperty.id,
      to_property_id: property.id,
      similarity_reason: 'category_location_price',
    });

    navigation.navigate('ListingDetail', { propertyId: property.id });
  };

  const handleViewAll = () => {
    analyticsService.track('view_all_similar', {
      property_id: currentProperty.id,
      similar_count: similarProperties.length,
    });

    // Navigate to search with similar filters
    navigation.navigate('Search', { 
      similarTo: currentProperty.id 
    });
  };

  if (similarProperties.length === 0) {
    return null;
  }

  return (
    <VStack space={4} bg="white" p={5} borderRadius={BorderRadius.xl}>
      {/* Header */}
      <HStack justifyContent="space-between" alignItems="center">
        <VStack space={1}>
          <AppText variant="h4" weight="semibold">
            Similar Properties
          </AppText>
          <AppText variant="body" color="secondary">
            Properties you might also like
          </AppText>
        </VStack>
        
        {similarProperties.length > 2 && (
          <Pressable onPress={handleViewAll}>
            <AppText variant="body" color="primary" weight="medium">
              View All
            </AppText>
          </Pressable>
        )}
      </HStack>

      {/* Properties List */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
      >
        <HStack space={4}>
          {similarProperties.map(property => (
            <Box key={property.id} width={300}>
              <PropertyCard 
                property={property}
                onPress={() => handlePropertyPress(property)}
              />
            </Box>
          ))}
        </HStack>
      </ScrollView>

      {/* Why Similar Section */}
      <VStack 
        space={3} 
        bg={Colors.background.secondary}
        p={4}
        borderRadius={BorderRadius.lg}
      >
        <AppText variant="body" weight="semibold">
          Why these properties are similar:
        </AppText>
        
        <VStack space={2}>
          <HStack space={3} alignItems="flex-start">
            <Ionicons name="business" size={16} color={Colors.primary[500]} style={{ marginTop: 2 }} />
            <AppText variant="body" color="secondary" flex={1}>
              Same property type: {currentProperty.propertyCategory}
            </AppText>
          </HStack>
          
          <HStack space={3} alignItems="flex-start">
            <Ionicons name="location" size={16} color={Colors.primary[500]} style={{ marginTop: 2 }} />
            <AppText variant="body" color="secondary" flex={1}>
              Similar location in {currentProperty.address.city}
            </AppText>
          </HStack>
          
          <HStack space={3} alignItems="flex-start">
            <Ionicons name="pricetag" size={16} color={Colors.primary[500]} style={{ marginTop: 2 }} />
            <AppText variant="body" color="secondary" flex={1}>
              Comparable price range
            </AppText>
          </HStack>
        </VStack>
      </VStack>
    </VStack>
  );
};

export default SimilarListings;