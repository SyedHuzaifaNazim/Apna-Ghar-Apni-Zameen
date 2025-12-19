import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { analyticsService } from '../services/analyticsService';
import { offlineQueueService } from '../services/offlineQueueService';
import { storageService } from '../services/storageService';
import { useDebounce } from './useDebounce';
import { useNetworkStatus } from './useNetworkStatus';

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
  resultCount?: number;
  filters?: any;
}

export interface SearchSuggestion {
  type: 'recent' | 'popular' | 'suggestion';
  text: string;
  icon?: string;
}

interface UseSearchReturn {
  // Search state
  query: string;
  results: any[];
  loading: boolean;
  hasSearched: boolean;
  
  // Search history
  searchHistory: SearchHistoryItem[];
  recentSearches: SearchHistoryItem[];
  
  // Suggestions
  suggestions: SearchSuggestion[];
  showSuggestions: boolean;
  
  // Actions
  setQuery: (query: string) => void;
  search: (searchQuery: string, filters?: any) => Promise<void>;
  clearSearch: () => void;
  clearHistory: () => Promise<void>;
  removeFromHistory: (id: string) => Promise<void>;
  
  // Analytics
  searchStats: {
    totalSearches: number;
    popularSearches: string[];
  };
}

const STORAGE_KEYS = {
  SEARCH_HISTORY: 'search_history',
  SEARCH_STATS: 'search_stats',
};

const POPULAR_SEARCHES = [
  'Apartments in Clifton',
  'Houses in Gulshan-e-Iqbal',
  'Commercial spaces in Saddar',
  'Plots in Bahria Town',
  'Shops in Tariq Road',
  'Offices on Shahrah-e-Faisal',
  'Warehouses in Korangi',
  'Luxury flats in DHA Karachi',
];

export const useSearch = (allProperties: any[]): UseSearchReturn => {
  const { isOnline } = useNetworkStatus();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [searchStats, setSearchStats] = useState({
    totalSearches: 0,
    popularSearches: POPULAR_SEARCHES,
  });

  // Load search history and stats
  useEffect(() => {
    const loadSearchData = async () => {
      try {
        const [history, stats] = await Promise.all([
          storageService.getItem<SearchHistoryItem[]>(STORAGE_KEYS.SEARCH_HISTORY),
          storageService.getItem<any>(STORAGE_KEYS.SEARCH_STATS),
        ]);

        setSearchHistory(history || []);
        setSearchStats(prev => ({
          ...prev,
          ...stats,
        }));
      } catch (error) {
        console.error('Failed to load search data:', error);
      }
    };

    loadSearchData();
  }, []);

  // Save search history
  const saveSearchHistory = useCallback(async (newHistory: SearchHistoryItem[]) => {
    try {
      await storageService.setItem(STORAGE_KEYS.SEARCH_HISTORY, newHistory);
      setSearchHistory(newHistory);
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  }, []);

  // Save search stats
  const saveSearchStats = useCallback(async (newStats: any) => {
    try {
      await storageService.setItem(STORAGE_KEYS.SEARCH_STATS, newStats);
      setSearchStats(prev => ({ ...prev, ...newStats }));
    } catch (error) {
      console.error('Failed to save search stats:', error);
    }
  }, []);

  const trackOrQueue = useCallback(
    async (eventName: string, params?: Record<string, any>) => {
      if (isOnline) {
        await analyticsService.track(eventName, params);
      } else {
        await offlineQueueService.enqueue('analytics:track', { eventName, params });
      }
    },
    [isOnline]
  );

  // Perform search
  const performSearch = useCallback(async (searchQuery: string, filters: any = {}) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    try {
      setLoading(true);
      setHasSearched(true);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

      // Simple client-side search (in real app, this would be an API call)
      const searchResults = allProperties.filter(property => {
        const searchableText = `
          ${property.title?.toLowerCase() || ''}
          ${property.description?.toLowerCase() || ''}
          ${property.address?.line1?.toLowerCase() || ''}
          ${property.address?.city?.toLowerCase() || ''}
          ${property.propertyCategory?.toLowerCase() || ''}
        `;

        return searchableText.includes(searchQuery.toLowerCase());
      });

      setResults(searchResults);

      // Add to search history
      const searchItem: SearchHistoryItem = {
        id: Date.now().toString(),
        query: searchQuery,
        timestamp: Date.now(),
        resultCount: searchResults.length,
        filters,
      };

      const newHistory = [
        searchItem,
        ...searchHistory.filter(item => item.query !== searchQuery),
      ].slice(0, 20); // Keep last 20 searches

      await saveSearchHistory(newHistory);

      // Update search stats
      await saveSearchStats({
        totalSearches: searchStats.totalSearches + 1,
      });

      await trackOrQueue('search_performed', {
        query: searchQuery,
        result_count: searchResults.length,
        has_filters: Object.keys(filters).length > 0,
        search_source: 'manual',
      });

    } catch (error) {
      await analyticsService.trackError(error as Error, {
        context: 'search',
        query: searchQuery,
      });

      Alert.alert(
        'Search failed',
        'Unable to perform search. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [allProperties, searchHistory, searchStats.totalSearches, saveSearchHistory, saveSearchStats, trackOrQueue]);

  // Debounced search
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      performSearch(debouncedQuery);
    } else {
      setResults([]);
      setHasSearched(false);
    }
  }, [debouncedQuery, performSearch]);

  // Handle query changes
  const handleSetQuery = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  // Manual search with filters
  const search = useCallback(async (searchQuery: string, filters: any = {}) => {
    setQuery(searchQuery);
    await performSearch(searchQuery, filters);
  }, [performSearch]);

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
    
    trackOrQueue('search_cleared');
  }, [trackOrQueue]);

  // Clear search history
  const clearHistory = useCallback(async () => {
    await saveSearchHistory([]);
    
    await trackOrQueue('search_history_cleared');
    
    Alert.alert(
      'History cleared',
      'Search history has been cleared'
    );
  }, [saveSearchHistory, trackOrQueue]);

  // Remove item from history
  const removeFromHistory = useCallback(async (id: string) => {
    const newHistory = searchHistory.filter(item => item.id !== id);
    await saveSearchHistory(newHistory);
    
    await trackOrQueue('search_history_item_removed');
  }, [searchHistory, saveSearchHistory, trackOrQueue]);

  // Generate suggestions
  const suggestions = useCallback((): SearchSuggestion[] => {
    const suggestionList: SearchSuggestion[] = [];

    // Recent searches
    searchHistory.slice(0, 5).forEach(item => {
      suggestionList.push({
        type: 'recent',
        text: item.query,
        icon: 'time',
      });
    });

    // Popular searches (if no recent searches or query is empty)
    if (suggestionList.length < 5 || !query.trim()) {
      POPULAR_SEARCHES.slice(0, 5 - suggestionList.length).forEach(text => {
        suggestionList.push({
          type: 'popular',
          text,
          icon: 'trending-up',
        });
      });
    }

    // Add query-based suggestions (simple implementation)
    if (query.trim().length > 2) {
      const propertyTypes = ['Flat', 'House', 'Villa', 'Shop', 'Office', 'Plot'];
      const cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Multan', 'Hyderabad'];
      
      propertyTypes.forEach(type => {
        cities.forEach(city => {
          if (suggestionList.length < 10) {
            suggestionList.push({
              type: 'suggestion',
              text: `${query} ${type} in ${city}`,
              icon: 'search',
            });
          }
        });
      });
    }

    return suggestionList.slice(0, 10);
  }, [query, searchHistory]);

  const showSuggestions = !hasSearched && query.trim().length > 0;
  const recentSearches = searchHistory.slice(0, 10);

  return {
    // Search state
    query,
    results,
    loading,
    hasSearched,
    
    // Search history
    searchHistory,
    recentSearches,
    
    // Suggestions
    suggestions: suggestions(),
    showSuggestions,
    
    // Actions
    setQuery: handleSetQuery,
    search,
    clearSearch,
    clearHistory,
    removeFromHistory,
    
    // Analytics
    searchStats,
  };
};

// Hook for advanced search with filters
export const useAdvancedSearch = (allProperties: any[]) => {
  const { isOnline } = useNetworkStatus();
  const [filters, setFilters] = useState<any>({});
  const [advancedResults, setAdvancedResults] = useState<any[]>([]);
  const [advancedLoading, setAdvancedLoading] = useState(false);

  const trackAdvancedEvent = useCallback(
    async (eventName: string, params?: Record<string, any>) => {
      if (isOnline) {
        await analyticsService.track(eventName, params);
      } else {
        await offlineQueueService.enqueue('analytics:track', { eventName, params });
      }
    },
    [isOnline]
  );

  const performAdvancedSearch = useCallback(async (searchFilters: any) => {
    try {
      setAdvancedLoading(true);
      setFilters(searchFilters);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      // Filter properties based on advanced criteria
      const filtered = allProperties.filter(property => {
        // Price range
        if (searchFilters.minPrice && property.price < searchFilters.minPrice) return false;
        if (searchFilters.maxPrice && property.price > searchFilters.maxPrice) return false;

        // Property type
        if (searchFilters.propertyType && property.propertyCategory !== searchFilters.propertyType) return false;

        // Bedrooms
        if (searchFilters.bedrooms && property.bedrooms < searchFilters.bedrooms) return false;

        // Area
        if (searchFilters.minArea && property.areaSize < searchFilters.minArea) return false;
        if (searchFilters.maxArea && property.areaSize > searchFilters.maxArea) return false;

        // Location
        if (searchFilters.city && property.address.city !== searchFilters.city) return false;

        // Listing type
        if (searchFilters.listingType && property.listingType !== searchFilters.listingType) return false;

        return true;
      });

      setAdvancedResults(filtered);

      await trackAdvancedEvent('advanced_search_performed', {
        filter_count: Object.keys(searchFilters).length,
        result_count: filtered.length,
        filters_applied: Object.keys(searchFilters),
      });

    } catch (error) {
      await analyticsService.trackError(error as Error, {
        context: 'advanced_search',
        filters: searchFilters,
      });
    } finally {
      setAdvancedLoading(false);
    }
  }, [allProperties, trackAdvancedEvent]);

  const clearFilters = useCallback(() => {
    setFilters({});
    setAdvancedResults([]);
    
    trackAdvancedEvent('search_filters_cleared');
  }, [trackAdvancedEvent]);

  return {
    filters,
    advancedResults,
    advancedLoading,
    performAdvancedSearch,
    clearFilters,
  };
};

export default useSearch;