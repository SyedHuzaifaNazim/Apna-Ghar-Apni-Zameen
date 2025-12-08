import AppText from '@/components/base/AppText';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  ScrollView,
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
      icon: 'business-outline',
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

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {filterOptions.map((filter) => {
          const isActive = isFilterActive(filter);
          
          return (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                isActive && { 
                  backgroundColor: filter.activeColor,
                  borderColor: filter.activeColor,
                },
              ]}
              onPress={() => handleFilterPress(filter)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={filter.icon as any}
                size={16}
                color={isActive ? Colors.background.card : filter.activeColor}
                style={styles.filterIcon}
              />
              <AppText
                variant="small"
                weight="semibold"
                style={[
                  styles.filterText,
                  isActive && styles.filterTextActive,
                ]}
              >
                {filter.label}
              </AppText>
            </TouchableOpacity>
          );
        })}
        
        <View style={{ width: 16 }} />
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.card,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    position: 'relative',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
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
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: Colors.gray[300],
    backgroundColor: Colors.background.primary,
  },
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