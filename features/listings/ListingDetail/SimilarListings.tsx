// features/listings/ListingDetail/SimilarListings.tsx
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

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

    // Navigate using the Expo router structure
    navigation.navigate('listing', { 
      screen: '[id]', 
      params: { id: property.id.toString() } 
    });
  };

  const handleViewAll = () => {
    analyticsService.track('view_all_similar', {
      property_id: currentProperty.id,
      similar_count: similarProperties.length,
    });

    // Navigate to search with similar filters
    navigation.navigate('search', { 
      screen: 'SearchScreen', 
      params: { 
          keywords: currentProperty.propertyCategory,
          city: currentProperty.address.city 
      } 
    });
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
          <TouchableOpacity onPress={handleViewAll}>
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
          <View style={styles.reasonItem}>
            <Ionicons name="business" size={16} color={Colors.primary[500]} style={styles.reasonIcon} />
            <AppText variant="body" color="secondary" style={styles.reasonText}>
              Same property type: {currentProperty.propertyCategory}
            </AppText>
          </View>
          
          <View style={styles.reasonItem}>
            <Ionicons name="location" size={16} color={Colors.primary[500]} style={styles.reasonIcon} />
            <AppText variant="body" color="secondary" style={styles.reasonText}>
              Similar location in {currentProperty.address.city}
            </AppText>
          </View>
          
          <View style={styles.reasonItem}>
            <Ionicons name="pricetag" size={16} color={Colors.primary[500]} style={styles.reasonIcon} />
            <AppText variant="body" color="secondary" style={styles.reasonText}>
              Comparable price range
            </AppText>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: BorderRadius.xl,
    marginTop: 16,
    marginBottom: 16, // Add some margin at bottom
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  scrollViewContent: { 
    paddingRight: 16,
  },
  horizontalList: {
    flexDirection: 'row',
    gap: 16,
  },
  cardWrapper: {
    width: 300,
  },
  whySimilarSection: {
    marginTop: 16,
    gap: 12,
    backgroundColor: Colors.background.secondary,
    padding: 16,
    borderRadius: BorderRadius.lg,
  },
  reasonList: {
      gap: 8,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  reasonIcon: {
      marginTop: 2,
      marginRight: 12,
  },
  reasonText: {
      flex: 1,
  }
});

export default SimilarListings;