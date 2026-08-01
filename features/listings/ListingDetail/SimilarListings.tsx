import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import AppText from '@/components/base/AppText';
import PropertyCard from '@/components/ui/PropertyCard';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/Layout';
import { useFetchProperties } from '@/hooks/useFetchProperties';
import { analyticsService } from '@/services/analyticsService';
import type { Property } from '@/types/property';

interface SimilarListingsProps {
  currentProperty: Property;
  count?: number;
}

const SimilarListings: React.FC<SimilarListingsProps> = ({ 
  currentProperty, 
  count = 4 
}) => {
  const router = useRouter();

  // Approximates "similar" by category, city, or price proximity to the current property.
  // Needs the whole pool to search within, not one infinite-scroll page.
  const { properties } = useFetchProperties({ paginate: false });

  const isPriceClose = (property: Property) =>
    Math.abs(property.price - currentProperty.price) / currentProperty.price < 0.3;

  const similarProperties = properties
      .filter(property =>
        property.id !== currentProperty.id &&
        (property.propertyCategory === currentProperty.propertyCategory ||
         property.address.city === currentProperty.address.city ||
         isPriceClose(property))
      )
      .slice(0, count);

  // Only claim the reasons that actually apply to at least one result shown —
  // the OR-based match above doesn't guarantee every reason held for every result.
  const matchedByCategory = similarProperties.some(p => p.propertyCategory === currentProperty.propertyCategory);
  const matchedByCity = similarProperties.some(p => p.address.city === currentProperty.address.city);
  const matchedByPrice = similarProperties.some(isPriceClose);


  const handlePropertyPress = (property: Property) => {
    analyticsService.track('similar_property_click', {
      from_property_id: currentProperty.id,
      to_property_id: property.id,
      similarity_reason: 'category_location_price',
    });

    router.push({ pathname: '/listing/[id]', params: { id: property.id.toString() } });
  };

  const handleViewAll = () => {
    analyticsService.track('view_all_similar', {
      property_id: currentProperty.id,
      similar_count: similarProperties.length,
    });

    router.push('/search');
  };

  if (similarProperties.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <AppText variant="h4" weight="semibold">
            Similar Properties
          </AppText>
          <AppText variant="body" color="secondary">
            Properties you might also like
          </AppText>
        </View>
        
        {similarProperties.length > 2 && (
          <TouchableOpacity onPress={handleViewAll} accessibilityRole="button">
            <AppText variant="body" color="primary" weight="medium">
              View All
            </AppText>
          </TouchableOpacity>
        )}
      </View>

      {/* Properties List */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.horizontalList}>
          {similarProperties.map(property => (
            <View key={property.id} style={styles.cardWrapper}>
              <PropertyCard 
                property={property}
                onPress={() => handlePropertyPress(property)}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Why Similar Section */}
      <View style={styles.whySimilarSection}>
        <AppText variant="body" weight="semibold">
          Why these properties are similar:
        </AppText>
        
        <View style={styles.reasonList}>
          {matchedByCategory && (
            <View style={styles.reasonItem}>
              <Ionicons name="business" size={16} color={Colors.primary[500]} style={styles.reasonIcon} />
              <AppText variant="body" color="secondary" style={styles.reasonText}>
                Same property type: {currentProperty.propertyCategory}
              </AppText>
            </View>
          )}

          {matchedByCity && (
            <View style={styles.reasonItem}>
              <Ionicons name="location" size={16} color={Colors.primary[500]} style={styles.reasonIcon} />
              <AppText variant="body" color="secondary" style={styles.reasonText}>
                Similar location in {currentProperty.address.city}
              </AppText>
            </View>
          )}

          {matchedByPrice && (
            <View style={styles.reasonItem}>
              <Ionicons name="pricetag" size={16} color={Colors.primary[500]} style={styles.reasonIcon} />
              <AppText variant="body" color="secondary" style={styles.reasonText}>
                Comparable price range
              </AppText>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.xl,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  scrollViewContent: { paddingRight: Spacing.md },
  horizontalList: { flexDirection: 'row', gap: Spacing.md },
  cardWrapper: { width: 300 },
  whySimilarSection: {
    marginTop: Spacing.md,
    gap: Spacing.sm + 4,
    backgroundColor: Colors.background.secondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  reasonList: { gap: Spacing.sm },
  reasonItem: { flexDirection: 'row', alignItems: 'flex-start' },
  reasonIcon: { marginTop: 2, marginRight: Spacing.md },
  reasonText: { flex: 1 },
});

export default SimilarListings;