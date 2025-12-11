import AppText from '@/components/base/AppText';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

interface QuickFilterBarProps {
  activeFilters: {
    listingType?: string;
    bedrooms?: number;
    propertyCategory?: string;
    [key: string]: any;
  };
  filterCount: number;
  updateFilters?: (filters: any) => void;
}

const QuickFilterBar: React.FC<QuickFilterBarProps> = ({
  activeFilters,
  filterCount,
  updateFilters,
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation for a smooth, floating look
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  const animatedStyle = {
    opacity: slideAnim,
    transform: [
      {
        translateY: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-10, 0],
        }),
      },
    ],
  };

  const filterOptions = [
    {
      id: 'for-sale',
      label: 'For Sale',
      value: 'For Sale',
      type: 'listingType',
      icon: 'cash-outline',
      activeColor: Colors.status.forSale,
    },
    {
      id: 'for-rent',
      label: 'For Rent',
      value: 'For Rent',
      type: 'listingType',
      icon: 'key-outline',
      activeColor: Colors.status.forRent,
    },
    {
      id: 'house',
      label: 'House',
      value: 'Residential House',
      type: 'propertyCategory',
      icon: 'home-outline',
      activeColor: Colors.propertyType.residential,
    },
    {
      id: 'flat',
      label: 'Apartment',
      value: 'Residential Flat',
      type: 'propertyCategory',
      icon: 'grid-outline',
      activeColor: Colors.propertyType.apartment,
    },
    {
      id: 'office',
      label: 'Office',
      value: 'Commercial Office',
      type: 'propertyCategory',
      icon: 'briefcase-outline',
      activeColor: Colors.propertyType.commercial,
    },
    {
      id: 'plot',
      label: 'Plot/Land',
      value: 'Industrial Plot',
      type: 'propertyCategory',
      icon: 'map-outline',
      activeColor: Colors.propertyType.plot,
    },
  ];

  const isFilterActive = (filter: any) => {
    if (!activeFilters) return false;
    
    if (filter.type === 'listingType') {
      return activeFilters.listingType === filter.value;
    }
    if (filter.type === 'bedrooms') {
      return activeFilters.bedrooms === filter.value;
    }
    if (filter.type === 'propertyCategory') {
      return activeFilters.propertyCategory === filter.value;
    }
    return false;
  };

  const handleFilterPress = (filter: any) => {
    if (!updateFilters) return;
    
    if (isFilterActive(filter)) {
      // Clear this specific filter
      const newFilter: any = {};
      if (filter.type === 'listingType') {
        newFilter.listingType = '';
      } else if (filter.type === 'bedrooms') {
        newFilter.bedrooms = undefined;
      } else if (filter.type === 'propertyCategory') {
        newFilter.propertyCategory = '';
      }
      updateFilters(newFilter);
    } else {
      // Apply filter - clearing the filter of the same type implicitly via updateFilters logic
      const newFilter: any = {};
      if (filter.type === 'listingType') {
        newFilter.listingType = filter.value;
      } else if (filter.type === 'bedrooms') {
        newFilter.bedrooms = filter.value;
      } else if (filter.type === 'propertyCategory') {
        newFilter.propertyCategory = filter.value;
      }
      updateFilters(newFilter);
    }
  };

  const handleClearAll = () => {
    if (!updateFilters) return;
    updateFilters({
      listingType: '',
      propertyCategory: '',
      bedrooms: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      amenities: [],
      keywords: '',
    });
  };

  // Separate options for rendering
  const listingTypeOptions = filterOptions.filter(f => f.type === 'listingType');
  const propertyTypeOptions = filterOptions.filter(f => f.type === 'propertyCategory');

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      
      <View style={styles.headerRow}>
        <AppText variant="h3" weight="bold" style={styles.title}>
          Quick Categories
        </AppText>
        
        {filterCount > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearAll}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={14} color={Colors.error[500]} />
            <AppText
              variant="small"
              weight="medium"
              color="error"
              style={styles.clearText}
            >
              Clear Filters ({filterCount})
            </AppText>
          </TouchableOpacity>
        )}
      </View>

      {/* Vertical Grid for Listing Type (2 columns) */}
      <View style={styles.contentSection}>
        <View style={styles.sectionHeader}>
            <Ionicons name="pricetags-outline" size={20} color={Colors.text.secondary} />
            <AppText variant="body" weight="medium" style={styles.sectionTitle}>Listing Status</AppText>
        </View>
        <View style={styles.grid}>
          {listingTypeOptions.map((filter) => {
            const isActive = isFilterActive(filter);
            
            return (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterButton,
                  styles.filterButtonHalf,
                  isActive && { 
                    backgroundColor: filter.activeColor,
                    borderColor: filter.activeColor,
                    shadowColor: filter.activeColor,
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                    elevation: 3,
                  },
                ]}
                onPress={() => handleFilterPress(filter)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={filter.icon as any}
                  size={20}
                  color={isActive ? Colors.background.card : filter.activeColor}
                  style={styles.filterIcon}
                />
                <AppText
                  variant="body"
                  weight="semibold"
                  style={[
                    styles.filterText,
                    isActive ? styles.filterTextActive : { color: filter.activeColor },
                  ]}
                >
                  {filter.label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Vertical Grid for Property Type (3 columns) */}
      <View style={styles.contentSection}>
        <View style={styles.sectionHeader}>
            <Ionicons name="business-outline" size={20} color={Colors.text.secondary} />
            <AppText variant="body" weight="medium" style={styles.sectionTitle}>Property Type</AppText>
        </View>
        <View style={styles.grid}>
          {propertyTypeOptions.map((filter) => {
            const isActive = isFilterActive(filter);
            
            return (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterButton,
                  styles.filterButtonThird,
                  isActive && { 
                    backgroundColor: filter.activeColor,
                    borderColor: filter.activeColor,
                    shadowColor: filter.activeColor,
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                    elevation: 3,
                  },
                ]}
                onPress={() => handleFilterPress(filter)}
                activeOpacity={0.7}
              >
                <AppText
                  variant="small"
                  weight="semibold"
                  align="center"
                  style={[
                    styles.filterText,
                    isActive ? styles.filterTextActive : { color: filter.activeColor },
                  ]}
                >
                  {filter.label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  // Main Container is now a fixed box structure
  container: {
    backgroundColor: Colors.background.card,
    borderRadius: 16, // Modern rounded corners
    padding: 16,
    shadowColor: Colors.shadow.dark, // Subtle floating shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 0,
  },
  title: {
    color: Colors.text.primary,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'transparent',
    borderRadius: 12,
    borderWidth: 0,
  },
  clearText: {
    marginLeft: 4,
    textDecorationLine: 'underline',
  },
  
  // Content Sections
  contentSection: {
    marginBottom: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[100],
    paddingTop: 12,
  },
  sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
  },
  sectionTitle: {
      marginLeft: 8,
      color: Colors.text.primary,
  },
  // Grid Layout
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8, // Standard gap between items
  },
  // Filter Button Base Styles
  filterButton: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12, // More rounded than pills
    borderWidth: 1.5,
    borderColor: Colors.gray[300],
    backgroundColor: Colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    minHeight: 50,
  },
  // Column sizing for Listing Type (2 columns)
  filterButtonHalf: {
    width: '49%', // Ensures proper spacing with justify-content: 'space-between'
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  // Column sizing for Property Type (3 columns)
  filterButtonThird: {
    width: '32%', // Ensures 3 items fit with gap
    minHeight: 60, // Taller button for tap target
    paddingVertical: 8,
  },
  // Active State Styles
  filterIcon: {
    marginRight: 6,
  },
  filterText: {
    color: Colors.text.primary,
  },
  filterTextActive: {
    color: Colors.background.card,
  },
});

export default QuickFilterBar;