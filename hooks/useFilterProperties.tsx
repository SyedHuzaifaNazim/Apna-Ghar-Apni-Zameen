import { Property } from '@/types/property'; // <--- UPDATED IMPORT
import { useCallback, useMemo, useState } from 'react';
import { analyticsService } from '../services/analyticsService';
import { useDebounce } from './useDebounce';

export interface FilterOptions {
  listingType?: string;
  propertyCategory?: string;
  cities?: string[]; // Supports multi-select cities
  areas?: string[];  // Added to support area selection from FilterModal
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  areaMin?: number;
  areaMax?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'date_desc' | 'area_desc' | 'relevance';
  keywords?: string;
}

// ... (Rest of file remains identical)

interface UseFilterPropertiesReturn {
  filteredProperties: Property[];
  activeFilters: FilterOptions;
  filterCount: number;
  updateFilters: (filters: Partial<FilterOptions>) => void;
  resetFilters: () => void;
  clearFilter: (filterKey: keyof FilterOptions) => void;
  hasActiveFilters: boolean;
}

const defaultFilters: FilterOptions = {
  listingType: '',
  propertyCategory: '',
  cities: [],
  areas: [], // Initialize default
  minPrice: 0,
  maxPrice: 1000000000,
  bedrooms: 0,
  bathrooms: 0,
  amenities: [],
  areaMin: 0,
  areaMax: 100000,
  sortBy: 'date_desc',
  keywords: '',
};

export const useFilterProperties = (
  properties: Property[],
  initialFilters: Partial<FilterOptions> = {}
): UseFilterPropertiesReturn => {
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    ...defaultFilters,
    ...initialFilters,
  });

  // Apply filters to properties
  const filteredProperties = useMemo(() => {
    if (!properties.length) return [];

    let filtered = properties.filter(property => {
      // Listing type filter
      if (activeFilters.listingType && property.listingType !== activeFilters.listingType) {
        return false;
      }

      // Property category filter
      if (activeFilters.propertyCategory && property.propertyCategory !== activeFilters.propertyCategory) {
        return false;
      }

      // City filter logic for multi-select
      if (activeFilters.cities && activeFilters.cities.length > 0) {
        if (!activeFilters.cities.includes(property.address.city)) {
          return false;
        }
      }

      // Area filter logic (checks if property address line or area matches selected areas)
      if (activeFilters.areas && activeFilters.areas.length > 0) {
        // Simple check: does the property address line contain one of the selected areas?
        const hasMatchingArea = activeFilters.areas.some(area => 
          property.address.line1.includes(area) || property.address.city.includes(area)
        );
        if (!hasMatchingArea) {
          return false;
        }
      }

      // Price range filter
      if (activeFilters.minPrice && property.price < activeFilters.minPrice) {
        return false;
      }
      if (activeFilters.maxPrice && property.price > activeFilters.maxPrice) {
        return false;
      }

      // Bedrooms filter
      if (activeFilters.bedrooms && property.bedrooms < activeFilters.bedrooms) {
        return false;
      }

      // Area range filter
      if (activeFilters.areaMin && property.areaSize < activeFilters.areaMin) {
        return false;
      }
      if (activeFilters.areaMax && property.areaSize > activeFilters.areaMax) {
        return false;
      }

      // Keywords filter
      if (activeFilters.keywords) {
        const keywords = activeFilters.keywords.toLowerCase();
        const searchableText = `
          ${property.title.toLowerCase()}
          ${property.description.toLowerCase()}
          ${property.address.line1.toLowerCase()}
          ${property.address.city.toLowerCase()}
          ${property.propertyCategory.toLowerCase()}
        `;
        
        if (!searchableText.includes(keywords)) {
          return false;
        }
      }

      // Amenities filter
      if (activeFilters.amenities && activeFilters.amenities.length > 0) {
        // Simplified check - assumes property has all amenities if array exists
        return true; 
      }

      return true;
    });

    // Apply sorting
    if (activeFilters.sortBy) {
      filtered.sort((a, b) => {
        switch (activeFilters.sortBy) {
          case 'price_asc':
            return a.price - b.price;
          case 'price_desc':
            return b.price - a.price;
          case 'area_desc':
            return b.areaSize - a.areaSize;
          case 'date_desc':
          default:
            return new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime();
        }
      });
    }

    return filtered;
  }, [properties, activeFilters]);

  // Count active filters (excluding defaults)
  const filterCount = useMemo(() => {
    let count = 0;

    if (activeFilters.listingType && activeFilters.listingType !== defaultFilters.listingType) count++;
    if (activeFilters.propertyCategory && activeFilters.propertyCategory !== defaultFilters.propertyCategory) count++;
    if (activeFilters.cities && activeFilters.cities.length > 0) count++;
    if (activeFilters.areas && activeFilters.areas.length > 0) count++; // Count areas
    if (activeFilters.minPrice && activeFilters.minPrice !== defaultFilters.minPrice) count++;
    if (activeFilters.maxPrice && activeFilters.maxPrice !== defaultFilters.maxPrice) count++;
    if (activeFilters.bedrooms && activeFilters.bedrooms !== defaultFilters.bedrooms) count++;
    if (activeFilters.bathrooms && activeFilters.bathrooms !== defaultFilters.bathrooms) count++;
    if (activeFilters.amenities && activeFilters.amenities.length > 0) count++;
    if (activeFilters.areaMin && activeFilters.areaMin !== defaultFilters.areaMin) count++;
    if (activeFilters.areaMax && activeFilters.areaMax !== defaultFilters.areaMax) count++;
    if (activeFilters.keywords && activeFilters.keywords.trim() !== '') count++;

    return count;
  }, [activeFilters]);

  const hasActiveFilters = filterCount > 0;

  const updateFilters = useCallback((newFilters: Partial<FilterOptions>) => {
    setActiveFilters(prev => {
      const updated = { ...prev, ...newFilters };
      
      // Track filter changes
      analyticsService.track('filters_updated', {
        filter_count: Object.keys(newFilters).length,
        active_filters: Object.keys(updated).filter(key => 
          updated[key as keyof FilterOptions] !== defaultFilters[key as keyof FilterOptions]
        ).length,
      });

      return updated;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setActiveFilters({ ...defaultFilters });
    
    analyticsService.track('filters_reset', {
      previous_filter_count: filterCount,
    });
  }, [filterCount]);

  const clearFilter = useCallback((filterKey: keyof FilterOptions) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: defaultFilters[filterKey],
    }));

    analyticsService.track('filter_cleared', {
      filter_key: filterKey,
    });
  }, []);

  return {
    filteredProperties,
    activeFilters,
    filterCount,
    updateFilters,
    resetFilters,
    clearFilter,
    hasActiveFilters,
  };
};

// Specialized hook for search with debouncing
export const useSearchProperties = (properties: Property[], delay = 300) => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, delay);

  const { filteredProperties, ...filterHelpers } = useFilterProperties(properties, {
    keywords: debouncedQuery,
  });

  const updateSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);

    if (query.trim()) {
      analyticsService.track('search_performed', {
        query_length: query.length,
        has_results: filteredProperties.length > 0,
      });
    }
  }, [filteredProperties.length]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    analyticsService.track('search_cleared');
  }, []);

  return {
    ...filterHelpers,
    filteredProperties,
    searchQuery,
    debouncedQuery,
    updateSearchQuery,
    clearSearch,
  };
};

export default useFilterProperties;