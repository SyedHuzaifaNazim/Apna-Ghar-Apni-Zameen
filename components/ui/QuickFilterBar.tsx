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
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        { iterations: 2 }
      ),
    ]).start();
  }, []);

  const animatedStyle = {
    opacity: slideAnim,
    transform: [
      {
        translateY: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-20, 0],
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
      activeColor: Colors.primary[500],
    },
    {
      id: 'for-rent',
      label: 'For Rent',
      value: 'For Rent',
      type: 'listingType',
      icon: 'home-outline',
      activeColor: Colors.secondary[500],
    },
    {
      id: 'studio',
      label: 'Studio',
      value: 0,
      type: 'bedrooms',
      icon: 'bed-outline',
      activeColor: Colors.info[500],
    },
    {
      id: '1-bed',
      label: '1 Bed',
      value: 1,
      type: 'bedrooms',
      icon: 'bed-outline',
      activeColor: Colors.success[500],
    },
    {
      id: '2-bed',
      label: '2 Beds',
      value: 2,
      type: 'bedrooms',
      icon: 'bed-outline',
      activeColor: Colors.warning[500],
    },
    {
      id: '3-bed',
      label: '3+ Beds',
      value: 3,
      type: 'bedrooms',
      icon: 'bed-outline',
      activeColor: Colors.rose[500],
    },
    {
      id: 'apartment',
      label: 'Apartment',
      value: 'Apartment',
      type: 'propertyCategory',
      icon: 'business-outline',
      activeColor: Colors.violet[500],
    },
    {
      id: 'house',
      label: 'House',
      value: 'House',
      type: 'propertyCategory',
      icon: 'business-outline',
      activeColor: Colors.amber[500],
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
      const newFilter: any = { [filter.type]: undefined };
      if (filter.type === 'listingType') {
        newFilter.listingType = '';
      } else if (filter.type === 'bedrooms') {
        newFilter.bedrooms = undefined;
      } else if (filter.type === 'propertyCategory') {
        newFilter.propertyCategory = '';
      }
      updateFilters(newFilter);
    } else {
      // Apply filter - clear conflicting filters first
      const newFilter: any = {};
      
      // Handle mutually exclusive filters
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
      <View style={styles.glowEffect} />
      
      <View style={styles.headerRow}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <AppText variant="h3" weight="semibold" style={styles.title}>
            Quick Filters
          </AppText>
        </Animated.View>
        
        {filterCount > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearAll}
            activeOpacity={0.7}
          >
            <Ionicons name="close-circle" size={16} color={Colors.error[500]} />
            <AppText
              variant="small"
              weight="medium"
              color="error"
              style={styles.clearText}
            >
              Clear All
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
                isActive && styles.filterButtonActive,
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
              {isActive && (
                <View style={styles.activeIndicator}>
                  <Ionicons name="checkmark" size={12} color="white" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
        
        {/* Spacer for better scrolling */}
        <View style={{ width: 16 }} />
      </ScrollView>

      {/* Active Filters Badge */}
      {filterCount > 0 && (
        <View style={styles.activeFiltersBadge}>
          <View style={styles.badgeContent}>
            <Ionicons name="funnel" size={14} color="white" />
            <AppText variant="small" weight="bold" style={styles.badgeText}>
              {filterCount} active
            </AppText>
          </View>
          <View style={styles.badgeTriangle} />
        </View>
      )}
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
  glowEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.primary[200],
    shadowColor: Colors.primary[400],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    color: Colors.text.primary,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: Colors.error[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.error[100],
  },
  clearText: {
    marginLeft: 4,
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.border.light,
    backgroundColor: Colors.background.card,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 1.5,
    elevation: 1,
    position: 'relative',
  },
  filterButtonActive: {
    shadowColor: Colors.primary[500],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
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
  activeIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.success[500],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.background.card,
  },
  activeFiltersBadge: {
    position: 'absolute',
    top: 0,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[500],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  badgeText: {
    color: 'white',
    marginLeft: 4,
  },
  badgeTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Colors.primary[400],
    marginTop: -1,
  },
});

export default QuickFilterBar;