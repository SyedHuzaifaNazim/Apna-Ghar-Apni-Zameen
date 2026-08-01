import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import AppText from '@/components/base/AppText';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Shadows, Spacing } from '@/constants/Layout';
import { FilterOptions } from '@/hooks/useFilterProperties';

interface QuickFilterBarProps {
  activeFilters: FilterOptions;
  filterCount: number;
  updateFilters?: (filters: Partial<FilterOptions>) => void;
  onOpenAdvancedFilters: () => void;
}

interface FilterOption {
  id: string;
  label: string;
  value: string;
  type: 'listingType' | 'propertyCategory';
  icon: keyof typeof Ionicons.glyphMap;
  activeColor: string;
  isPrimary: boolean;
}

// Top 5 cities for a clean 3-column wrap (FilterModal has the full city list).
const POPULAR_CITIES: { label: string; value: string; icon: keyof typeof Ionicons.glyphMap }[] = [
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

  const showCityFilters = currentListingType === 'For Sale' || currentListingType === 'For Rent';

  const filterOptions = useMemo<FilterOption[]>(
    () => [
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
    ],
    []
  );

  const isFilterActive = useCallback(
    (filter: FilterOption) => activeFilters[filter.type] === filter.value,
    [activeFilters]
  );

  const handleFilterPress = (filter: FilterOption | { type: 'city'; value: string }) => {
    if (!updateFilters) return;

    if (filter.type === 'listingType' || filter.type === 'propertyCategory') {
      const isActive = isFilterActive(filter);
      const newValue = isActive ? '' : filter.value;
      const newFilters: Partial<FilterOptions> = { [filter.type]: newValue };

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
        nextCities = [];
      } else if (nextCities.includes(cityValue)) {
        nextCities = nextCities.filter(c => c !== cityValue);
      } else {
        nextCities = [...nextCities, cityValue];
      }

      updateFilters({ cities: nextCities.filter(c => c !== 'all') });
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

  const listingTypeOptions = filterOptions.filter(f => f.isPrimary);
  const propertyTypeOptions = filterOptions.filter(f => !f.isPrimary);

  const isCityFilterActive = currentCities.length > 0;

  const advancedButtonLabel = isCityFilterActive
    ? `Cities (${currentCities.length} Active) & More Filters`
    : 'Price, Beds, Areas & More Filters';

  const advancedButtonIcon: keyof typeof Ionicons.glyphMap = isCityFilterActive ? 'options' : 'options-outline';

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <AppText variant="h4" weight="bold" style={styles.title}>
          Quick Categories
        </AppText>

        {filterCount > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClearAll} activeOpacity={0.7} accessibilityRole="button">
            <Ionicons name="close" size={14} color={Colors.error[500]} />
            <AppText variant="bodySmall" weight="medium" color="error" style={styles.clearText}>
              Clear All ({filterCount})
            </AppText>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.gridContainer}>
        {/* Row 1: Listing Status (Buy/Rent - 2 columns) */}
        <View style={styles.gridRow}>
          {listingTypeOptions.map(filter => {
            const isActive = isFilterActive(filter);
            const iconColor = isActive ? Colors.text.inverse : filter.activeColor;

            return (
              <TouchableOpacity
                key={filter.id}
                style={[styles.filterButton, styles.filterButtonHalf, isActive && styles.filterButtonActive]}
                onPress={() => handleFilterPress(filter)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
              >
                <Ionicons name={filter.icon} size={26} color={iconColor} style={styles.filterIcon} />
                <AppText
                  variant="body"
                  weight="semibold"
                  style={[styles.filterText, { color: isActive ? Colors.text.inverse : filter.activeColor }]}
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
            {POPULAR_CITIES.map(city => {
              const isAllActive = city.value === 'all' && currentCities.length === 0;
              const isIndividualActive = city.value !== 'all' && currentCities.includes(city.value);
              const isActive = isAllActive || isIndividualActive;

              const cityColor = isActive ? Colors.text.inverse : Colors.primary[700];

              return (
                <TouchableOpacity
                  key={city.value}
                  style={[
                    styles.filterButton,
                    styles.filterButtonThird,
                    isActive ? styles.filterButtonActive : styles.cityButtonBase,
                  ]}
                  onPress={() => handleFilterPress({ type: 'city', value: city.value })}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                >
                  <Ionicons name={city.icon} size={20} color={cityColor} style={styles.filterIconSmall} />
                  <AppText variant="bodySmall" weight="medium" style={[styles.filterText, { color: cityColor }]}>
                    {city.label}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Row 3: Property Type Grid (4 columns) */}
        <View style={styles.gridRow}>
          {propertyTypeOptions.map(filter => {
            const isActive = isFilterActive(filter);
            const iconColor = isActive ? Colors.text.inverse : filter.activeColor;

            return (
              <TouchableOpacity
                key={filter.id}
                style={[styles.filterButton, styles.filterButtonQuarter, isActive && styles.filterButtonActive]}
                onPress={() => handleFilterPress(filter)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
              >
                <Ionicons name={filter.icon} size={20} color={iconColor} style={styles.filterIconSmall} />
                <AppText
                  variant="bodySmall"
                  weight="medium"
                  style={[styles.filterText, { color: isActive ? Colors.text.inverse : filter.activeColor }]}
                >
                  {filter.label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Row 4: Advanced Filters (full width) */}
        <TouchableOpacity
          style={[
            styles.advancedButton,
            isCityFilterActive
              ? { backgroundColor: Colors.primary[700], borderColor: Colors.primary[700] }
              : styles.advancedButtonBase,
          ]}
          onPress={onOpenAdvancedFilters}
          activeOpacity={0.8}
          accessibilityRole="button"
        >
          <Ionicons
            name={advancedButtonIcon}
            size={20}
            color={isCityFilterActive ? Colors.text.inverse : Colors.primary[700]}
          />
          <AppText variant="body" weight="semibold" color={isCityFilterActive ? Colors.text.inverse : Colors.primary[700]}>
            {advancedButtonLabel}
          </AppText>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={isCityFilterActive ? Colors.text.inverse : Colors.primary[700]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
    ...Shadows.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
    paddingBottom: Spacing.sm,
  },
  title: { color: Colors.text.primary },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xxs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  clearText: { marginLeft: Spacing.xxs, textDecorationLine: 'underline' },

  gridContainer: { paddingTop: Spacing.sm, gap: Spacing.sm },
  gridRow: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: Spacing.sm },
  cityGridRow: { justifyContent: 'flex-start' },

  filterButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.gray[300],
    backgroundColor: Colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    minHeight: 80,
  },
  filterButtonHalf: { width: '45%' },
  filterButtonThird: { width: '31.5%', minHeight: 65, paddingVertical: Spacing.xs },
  filterButtonQuarter: { width: '21%', minHeight: 40, paddingVertical: Spacing.xs, paddingHorizontal: 1 },

  filterButtonActive: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
    ...Shadows.md,
  },
  cityButtonBase: { borderColor: Colors.primary[200], backgroundColor: Colors.primary[50] },

  filterIcon: { marginBottom: Spacing.xxs },
  filterIconSmall: { marginBottom: Spacing.xxs },
  filterText: { color: Colors.text.primary, textAlign: 'center', fontSize: 14 },

  advancedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  advancedButtonBase: { borderColor: Colors.primary[300], backgroundColor: Colors.primary[50] },
});

export default QuickFilterBar;
