import AppText from '@/components/base/AppText';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

interface QuickFilterBarProps {
  activeFilters: {
    listingType?: string;
    propertyCategory?: string;
    cities?: string[];
    [key: string]: any;
  };
  filterCount: number;
  updateFilters?: (filters: any) => void;
  onOpenAdvancedFilters: () => void; 
}

// --- MOCK CITY DATA (Top 5 for clean 3-column wrap) ---
const POPULAR_CITIES = [
    { label: 'All', value: 'all', icon: 'globe-outline' },
    { label: 'Karachi', value: 'Karachi', icon: 'pin-outline' },
    { label: 'Lahore', value: 'Lahore', icon: 'pin-outline' },
    { label: 'Islamabad', value: 'Islamabad', icon: 'pin-outline' },
    { label: 'Rawalpindi', value: 'Rawalpindi', icon: 'pin-outline' },
];

const QuickFilterBar: React.FC<QuickFilterBarProps> = ({
  activeFilters,
  filterCount,
  updateFilters,
  onOpenAdvancedFilters,
}) => {
  
  const currentListingType = activeFilters.listingType || '';
  const currentCities = activeFilters.cities || [];
  
  // Conditional rendering flag based on listing type selection
  const showCityFilters = currentListingType === 'For Sale' || currentListingType === 'For Rent';

  const filterOptions = useMemo(() => [
    {
      id: 'for-sale',
      label: 'Buy', 
      value: 'For Sale',
      type: 'listingType',
      icon: 'cash-outline',
      activeColor: Colors.status.forSale,
      isPrimary: true,
    },
    {
      id: 'for-rent',
      label: 'Rent', 
      value: 'For Rent',
      type: 'listingType',
      icon: 'key-outline',
      activeColor: Colors.status.forRent,
      isPrimary: true,
    },
    {
      id: 'house',
      label: 'House',
      value: 'Residential House',
      type: 'propertyCategory',
      icon: 'home-outline',
      activeColor: Colors.propertyType.residential,
      isPrimary: false,
    },
    {
      id: 'apartment',
      label: 'Flat', 
      value: 'Residential Flat',
      type: 'propertyCategory',
      icon: 'business-outline', 
      activeColor: Colors.propertyType.apartment,
      isPrimary: false,
    },
    {
      id: 'commercial',
      label: 'Office',
      value: 'Commercial Office',
      type: 'propertyCategory',
      icon: 'briefcase-outline',
      activeColor: Colors.propertyType.commercial,
      isPrimary: false,
    },
    {
      id: 'plot',
      label: 'Plot',
      value: 'Industrial Plot',
      type: 'propertyCategory',
      icon: 'map-outline',
      activeColor: Colors.propertyType.industrial,
      isPrimary: false,
    },
  ], []);

  const isFilterActive = useCallback((filter: any) => {
    if (!activeFilters || !filter.type) return false;
    
    if (filter.type === 'listingType' || filter.type === 'propertyCategory') {
      return activeFilters[filter.type] === filter.value;
    }
    return false;
  }, [activeFilters]);

  const handleFilterPress = (filter: any) => {
    if (!updateFilters) return;
    
    if (filter.type === 'listingType' || filter.type === 'propertyCategory') {
      const isActive = isFilterActive(filter);
      const newValue = isActive ? '' : filter.value;
      const newFilters: any = { [filter.type]: newValue };
      
      // If listingType changes, clear cities to ensure a fresh start
      if (filter.type === 'listingType') {
          newFilters.cities = [];
      }
      updateFilters(newFilters);
      return;
    }
    
    // Logic for City (multi-select)
    if (filter.type === 'city') {
      let nextCities = [...currentCities];
      const cityValue = filter.value;
      
      if (cityValue === 'all') {
          // 'All Cities' means clear specific city filters
          nextCities = [];
      } else {
          // Toggle individual city
          if (nextCities.includes(cityValue)) {
              nextCities = nextCities.filter(c => c !== cityValue);
          } else {
              nextCities = [...nextCities, cityValue];
          }
      }
      
      updateFilters({ cities: nextCities.filter(c => c !== 'all') }); // Ensure 'all' isn't stored
    }
  };

  const handleClearAll = () => {
    if (!updateFilters) return;
    updateFilters({
      listingType: '',
      propertyCategory: '',
      bedrooms: 0,
      minPrice: 0,
      maxPrice: 1000000000,
      amenities: [],
      keywords: '',
      cities: [], 
    });
  };

  // Separation of filters for rendering
  const listingTypeOptions = filterOptions.filter(f => f.isPrimary);
  const propertyTypeOptions = filterOptions.filter(f => !f.isPrimary);

  const slideAnim = useRef(new Animated.Value(1)).current; 
  const animatedStyle = { opacity: 1, transform: [{ translateY: 0 }] };
  
  const isCityFilterActive = currentCities.length > 0;
  
  const advancedButtonLabel = isCityFilterActive 
    ? `Cities (${currentCities.length} Active) & More Filters` 
    : 'Price, Beds, Areas & More Filters';
    
  const advancedButtonIcon = isCityFilterActive ? 'options' : 'options-outline';

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
              Clear All ({filterCount})
            </AppText>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.gridContainer}>
        
        {/* Row 1: Listing Status (Buy/Rent - 2 columns) */}
        <View style={styles.gridRow}>
            {listingTypeOptions.map((filter) => {
                const isActive = isFilterActive(filter);
                const iconColor = isActive ? Colors.text.inverse : filter.activeColor;
                
                return (
                    <TouchableOpacity
                        key={filter.id}
                        style={[
                            styles.filterButton,
                            styles.filterButtonHalf,
                            isActive && styles.filterButtonActive,
                        ]}
                        onPress={() => handleFilterPress(filter)}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={filter.icon as any}
                            size={26}
                            color={iconColor}
                            style={styles.filterIcon}
                        />
                        <AppText
                            variant="body"
                            weight="semibold"
                            style={[
                                styles.filterText,
                                { color: isActive ? Colors.text.inverse : filter.activeColor },
                            ]}
                        >
                            {filter.label}
                        </AppText>
                    </TouchableOpacity>
                );
            })}
        </View>
        
        {/* Row 2: Conditional City Selection Grid (3 columns) */}
        {showCityFilters && (
            <View style={[styles.gridRow, styles.cityGridRow]}>
                {POPULAR_CITIES.map((city) => {
                    // All is active if no other city is selected
                    const isAllActive = city.value === 'all' && currentCities.length === 0;
                    // Individual city is active if its value is in the array
                    const isIndividualActive = city.value !== 'all' && currentCities.includes(city.value);
                    const isActive = isAllActive || isIndividualActive;
                    
                    const cityColor = isActive ? Colors.text.inverse : Colors.primary[700];

                    return (
                        <TouchableOpacity
                            key={city.value}
                            style={[
                                styles.filterButton,
                                styles.filterButtonThird,
                                isActive 
                                    ? styles.filterButtonActive 
                                    : styles.cityButtonBase
                            ]}
                            onPress={() => handleFilterPress({ type: 'city', value: city.value })}
                            activeOpacity={0.7}
                        >
                            <Ionicons 
                                name={city.icon as any} 
                                size={20} 
                                color={cityColor}
                                style={styles.filterIconSmall}
                            />
                            <AppText
                                variant="small"
                                weight="medium"
                                style={[
                                    styles.filterText,
                                    { color: cityColor },
                                ]}
                            >
                                {city.label}
                            </AppText>
                        </TouchableOpacity>
                    );
                })}
            </View>
        )}
        
        {/* Row 3 (Conditional): Property Type Grid (4 columns) */}
        <View style={styles.gridRow}>
            {propertyTypeOptions.map((filter) => {
                const isActive = isFilterActive(filter);
                const iconColor = isActive ? Colors.text.inverse : filter.activeColor;
                
                return (
                    <TouchableOpacity
                        key={filter.id}
                        style={[
                            styles.filterButton,
                            styles.filterButtonQuarter, 
                            isActive && styles.filterButtonActive,
                        ]}
                        onPress={() => handleFilterPress(filter)}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={filter.icon as any}
                            size={20}
                            color={iconColor}
                            style={styles.filterIconSmall}
                        />
                        <AppText
                            variant="small"
                            weight="medium"
                            style={[
                                styles.filterText,
                                { color: isActive ? Colors.text.inverse : filter.activeColor },
                            ]}
                        >
                            {filter.label}
                        </AppText>
                    </TouchableOpacity>
                );
            })}
        </View>
        
        {/* Row 4: Advanced/Area Filter Button (Full Width, opens modal) */}
        <TouchableOpacity
            style={[
                styles.advancedButton, 
                isCityFilterActive 
                    ? { backgroundColor: Colors.primary[700], borderColor: Colors.primary[700] }
                    : styles.advancedButtonBase
            ]}
            onPress={onOpenAdvancedFilters}
            activeOpacity={0.8}
        >
            <Ionicons 
                name={advancedButtonIcon as any} 
                size={20} 
                color={isCityFilterActive ? Colors.text.inverse : Colors.primary[700]}
            />
            <AppText 
                variant="body" 
                weight="semibold" 
                style={{ color: isCityFilterActive ? Colors.text.inverse : Colors.primary[700] }}
            >
                {advancedButtonLabel}
            </AppText>
             <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={isCityFilterActive ? Colors.text.inverse : Colors.primary[700]}
            />
        </TouchableOpacity>
        
      </View>
      
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.card,
    borderRadius: 16, 
    padding: 16,
    shadowColor: Colors.shadow.dark, 
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
    paddingBottom: 8,
  },
  title: {
    color: Colors.text.primary,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  clearText: {
    marginLeft: 4,
    textDecorationLine: 'underline',
  },
  
  // --- Grid Layout ---
  gridContainer: {
      paddingTop: 8,
      gap: 12, 
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  cityGridRow: {
      justifyContent: 'flex-start',
  },
  
  // Filter Button Base Styles
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12, 
    borderWidth: 1.5,
    borderColor: Colors.gray[300],
    backgroundColor: Colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column', 
    minHeight: 80, 
  },
  filterButtonHalf: {
    width: '45%', 
  },
  // City button size (3 columns)
  filterButtonThird: {
    width: '31.5%', 
    minHeight: 65, 
    paddingVertical: 8,
  },
  // Property Type button size (4 columns)
  filterButtonQuarter: {
      width: '21%', 
      minHeight: 40, 
      paddingVertical: 8,
      paddingHorizontal: 1,
  },
  
  filterButtonActive: { 
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
    shadowColor: Colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  cityButtonBase: {
      borderColor: Colors.primary[200],
      backgroundColor: Colors.primary[50],
  },
  
  // Icon and Text Styles
  filterIcon: {
    marginBottom: 4, 
    marginRight: 0, 
  },
  filterIconSmall: {
    marginBottom: 4,
    marginRight: 0,
  },
  filterText: {
    color: Colors.text.primary,
    textAlign: 'center',
    fontSize: 14,
  },
  filterTextActive: {
    color: Colors.background.card,
  },
  
  // Advanced Button (Full Width)
  advancedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    marginTop: 12,
    gap: 12,
  },
  advancedButtonBase: {
    borderColor: Colors.primary[300],
    backgroundColor: Colors.primary[50], 
  }
});

export default QuickFilterBar;