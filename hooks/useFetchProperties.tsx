import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native'; // Replaced useToast with Alert for stability
import { MOCK_PROPERTIES, Property } from '../api/apiMock';
import { analyticsService } from '../services/analyticsService';
import { storageService } from '../services/storageService';
import { useNetworkStatus } from './useNetworkStatus';

interface UseFetchPropertiesReturn {
  properties: Property[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  refresh: () => Promise<void>;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  lastUpdated: number | null;
  isOfflineData: boolean;
}

interface FetchPropertiesOptions {
  enabled?: boolean;
  pageSize?: number;
  cacheTimeout?: number;
  refetchOnFocus?: boolean;
}

export const useFetchProperties = (options: FetchPropertiesOptions = {}): UseFetchPropertiesReturn => {
  const {
    enabled = true,
    pageSize = 20,
    cacheTimeout = 5 * 60 * 1000, // 5 minutes
    refetchOnFocus = true,
  } = options;

  // Removed useToast() as it causes crashes without NativeBaseProvider
  const { isOnline } = useNetworkStatus();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [isOfflineData, setIsOfflineData] = useState(false);

  const buildCacheKey = useCallback(
    (pageNum: number) => `properties_page_${pageNum}_size_${pageSize}`,
    [pageSize]
  );

  const fetchProperties = useCallback(async (isRefresh = false, isLoadMore = false, targetPage = page) => {
    if (!enabled) return;

    try {
      if (!isLoadMore) {
        setLoading(true);
      }
      setError(null);

      const cacheKey = buildCacheKey(targetPage);

      if (!isOnline) {
        const cachedData = await storageService.getCache<Property[]>(cacheKey);

        if (cachedData) {
          setProperties(cachedData);
          setHasMore(false);
          setIsOfflineData(true);
          setError(null);
        } else {
          setError('Offline and no cached data available');
        }

        setLoading(false);
        setIsRefreshing(false);
        return;
      }

      if (!isRefresh && !isLoadMore) {
        const cachedData = await storageService.getCache<Property[]>(cacheKey);
        if (cachedData) {
          setProperties(cachedData);
          setIsOfflineData(true);

          // Still fetch fresh data in background
          fetchFreshData();
          setLoading(false);
          return;
        }
      }
      setIsOfflineData(false);

      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 600));

      // Using mock data for now
      const sliceEnd = targetPage * pageSize;
      const mockProperties: Property[] = MOCK_PROPERTIES.slice(0, sliceEnd);

      setProperties(mockProperties);

      // Update pagination state
      setHasMore(sliceEnd < MOCK_PROPERTIES.length);

      // Cache the results
      await storageService.setCache(cacheKey, mockProperties, cacheTimeout);

      // Track analytics
      await analyticsService.track('properties_fetched', {
        page: targetPage,
        pageSize,
        count: mockProperties.length,
        source: isRefresh ? 'refresh' : isLoadMore ? 'load_more' : 'initial',
      });
      setLastUpdated(Date.now());

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch properties';
      setError(errorMessage);
      
      await analyticsService.trackError(err as Error, {
        context: 'fetch_properties',
        page: targetPage,
        pageSize,
      });

      if (!isLoadMore && isOnline) {
        // Replaced toast.show with Alert.alert
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [enabled, page, pageSize, cacheTimeout, buildCacheKey, isOnline]);

  const fetchFreshData = useCallback(async () => {
    try {
      // Simulate fresh API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const freshProperties: Property[] = MOCK_PROPERTIES;
      setProperties(freshProperties);
      
      // Update cache with fresh data
      await storageService.setCache(buildCacheKey(1), freshProperties, cacheTimeout);
    } catch (error) {
      console.error('Background refresh failed:', error);
    }
  }, [cacheTimeout, buildCacheKey]);

  const refetch = useCallback(async () => {
    setPage(1);
    await fetchProperties(true, false, 1);
  }, [fetchProperties]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    setPage(1);
    await fetchProperties(true, false, 1);
  }, [fetchProperties]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchProperties(false, true, nextPage);
  }, [loading, hasMore, fetchProperties, page]);

  // Initial fetch
  useEffect(() => {
    if (enabled) {
      fetchProperties(false, false, 1);
    }
  }, [enabled, fetchProperties]);

  // Handle app focus refetch
  useEffect(() => {
    if (!refetchOnFocus) return;

    const handleAppFocus = () => {
      if (enabled) {
        fetchFreshData();
      }
    };

    // In a real app, you would use AppState or focus events
    // AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      // AppState.removeEventListener('change', handleAppStateChange);
    };
  }, [enabled, refetchOnFocus, fetchFreshData]);

  return {
    properties,
    loading,
    error,
    refetch,
    refresh,
    hasMore,
    loadMore,
    lastUpdated,
    isOfflineData,
  };
};

// Hook for fetching a single property
export const useFetchProperty = (propertyId: number | null) => {
  // Removed useToast()
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperty = useCallback(async () => {
    if (!propertyId) {
      setProperty(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cacheKey = `property_${propertyId}`;
      const cachedProperty = await storageService.getCache<Property>(cacheKey);
      
      if (cachedProperty) {
        setProperty(cachedProperty);
        setLoading(false);
        
        // Fetch fresh data in background
        fetchFreshProperty(propertyId);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 400));

      const propertyData: Property | undefined = MOCK_PROPERTIES.find(p => p.id === propertyId);

      if (propertyData) {
        setProperty(propertyData);
        
        // Cache the property
        await storageService.setCache(cacheKey, propertyData, 10 * 60 * 1000); // 10 minutes
        
        // Track view
        await analyticsService.track('property_viewed', {
          property_id: propertyId,
          property_type: propertyData.propertyCategory,
          price: propertyData.price,
        });
      } else {
        throw new Error('Property not found');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch property';
      setError(errorMessage);
      
      await analyticsService.trackError(err as Error, {
        context: 'fetch_property',
        property_id: propertyId,
      });

      // Replaced toast with Alert
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  const fetchFreshProperty = useCallback(async (id: number) => {
    try {
      // Simulate fresh API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const freshProperty: Property | undefined = MOCK_PROPERTIES.find(p => p.id === id);
      if (freshProperty) {
        setProperty(freshProperty);
        await storageService.setCache(`property_${id}`, freshProperty, 10 * 60 * 1000);
      }
    } catch (error) {
      console.error('Background property refresh failed:', error);
    }
  }, []);

  const refetch = useCallback(() => {
    fetchProperty();
  }, [fetchProperty]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  return {
    property,
    loading,
    error,
    refetch,
  };
};

export default useFetchProperties;