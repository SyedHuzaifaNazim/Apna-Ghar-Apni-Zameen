import { useLocalSearchParams, useRouter } from 'expo-router';
import { Box, ScrollView, VStack } from 'native-base';
import React, { useMemo } from 'react';

import { MOCK_PROPERTIES } from '@/api/apiMock';
import AppText from '@/components/base/AppText';
import { Colors } from '@/constants/Colors';
import ContactAgent from '@/features/listings/ListingDetail/ContactAgent';
import ImageGallery from '@/features/listings/ListingDetail/ImageGallery';
import PropertyInfo from '@/features/listings/ListingDetail/PropertyInfo';
import SimilarListings from '@/features/listings/ListingDetail/SimilarListings';

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const property = useMemo(() => {
    const propertyId = parseInt(id || '0', 10);
    return MOCK_PROPERTIES.find(p => p.id === propertyId);
  }, [id]);

  if (!property) {
    return (
      <Box flex={1} bg="white" safeArea justifyContent="center" alignItems="center">
        <AppText variant="h3" weight="semibold" color="error">
          Property not found
        </AppText>
        <AppText variant="body" color="secondary" mt={2}>
          The property you're looking for doesn't exist.
        </AppText>
      </Box>
    );
  }

  return (
    <Box flex={1} bg={Colors.background.secondary} safeArea>
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack space={0}>
          {/* Image Gallery */}
          <ImageGallery 
            images={property.images} 
            height={300}
            showThumbnails={true}
          />

          {/* Property Info */}
          <PropertyInfo property={property} />

          {/* Contact Agent */}
          <ContactAgent property={property} />

          {/* Similar Listings */}
          <SimilarListings currentProperty={property} count={4} />
        </VStack>
      </ScrollView>
    </Box>
  );
}

