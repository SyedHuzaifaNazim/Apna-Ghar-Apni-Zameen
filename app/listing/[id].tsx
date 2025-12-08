import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { MOCK_PROPERTIES, Property } from '@/api/apiMock';
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
    return MOCK_PROPERTIES.find((p: Property) => p.id === propertyId);
  }, [id]);

  if (!property) {
    return (
      <View style={[styles.flex1, styles.centerView, { backgroundColor: 'white' }]}>
        <AppText variant="h3" weight="semibold" style={{ color: Colors.error[500] }}>
          Property not found
        </AppText>
        <AppText variant="body" color="secondary" style={{ marginTop: 8 }}>
          The property you're looking for doesn't exist.
        </AppText>
      </View>
    );
  }

  return (
    <View style={styles.flex1}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: Colors.background.secondary }}>
        <View>
          {/* Image Gallery */}
          <ImageGallery 
            images={property.images} 
            height={350}
            showThumbnails={true}
          />

          {/* Property Info */}
          <PropertyInfo property={property} />

          {/* Contact Agent */}
          <ContactAgent property={property} />

          {/* Similar Listings */}
          <SimilarListings currentProperty={property} count={4} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  centerView: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});