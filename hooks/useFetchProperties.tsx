import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { ApiConfig } from '../constants/Config'; // Import ApiConfig
import { analyticsService } from '../services/analyticsService';
import { storageService } from '../services/storageService';
import { Property } from '../types/property'; // Import types from new location
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

      // Offline handling
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

      // Check cache first if not explicitly refreshing
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

      // ---------------------------------------------------------
      // REAL API CALL
      // ---------------------------------------------------------
      // Ensure POSTS_API is defined in your .env or Config
      const apiUrl = `${ApiConfig.postsApi}?page=${targetPage}&limit=${pageSize}`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: ApiConfig.headers.common,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Handle different API response structures
      // Assuming API returns { data: Property[], hasMore: boolean } or just Property[]
      const fetchedProperties: Property[] = Array.isArray(data) ? data : (data.data || []);
      const serverHasMore = data.hasMore !== undefined ? data.hasMore : fetchedProperties.length >= pageSize;

      if (isLoadMore) {
        setProperties(prev => [...prev, ...fetchedProperties]);
      } else {
        setProperties(fetchedProperties);
      }

      setHasMore(serverHasMore);

      // Cache the results
      await storageService.setCache(cacheKey, fetchedProperties, cacheTimeout);

      // Track analytics
      await analyticsService.track('properties_fetched', {
        page: targetPage,
        pageSize,
        count: fetchedProperties.length,
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
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [enabled, page, pageSize, cacheTimeout, buildCacheKey, isOnline]);

  const fetchFreshData = useCallback(async () => {
    try {
      const apiUrl = `${ApiConfig.postsApi}?page=1&limit=${pageSize}`;
      const response = await fetch(apiUrl, { headers: ApiConfig.headers.common });
      
      if (response.ok) {
        const data = await response.json();
        const freshProperties: Property[] = Array.isArray(data) ? data : (data.data || []);
        setProperties(freshProperties);
        await storageService.setCache(buildCacheKey(1), freshProperties, cacheTimeout);
      }
    } catch (error) {
      console.error('Background refresh failed:', error);
    }
  }, [cacheTimeout, buildCacheKey, pageSize]);

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

  useEffect(() => {
    if (enabled) {
      fetchProperties(false, false, 1);
    }
  }, [enabled, fetchProperties]);

  useEffect(() => {
    if (!refetchOnFocus) return;
    const handleAppFocus = () => {
      if (enabled) {
        fetchFreshData();
      }
    };
    return () => {};
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

      const cacheKey = `property_${propertyId}`;
      const cachedProperty = await storageService.getCache<Property>(cacheKey);
      
      if (cachedProperty) {
        setProperty(cachedProperty);
        setLoading(false);
        // Fetch fresh data in background
        fetchFreshProperty(propertyId);
        return;
      }

      // REAL API CALL
      const apiUrl = `${ApiConfig.postsApi}/${propertyId}`;
      const response = await fetch(apiUrl, { headers: ApiConfig.headers.common });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const propertyData: Property = await response.json();

      if (propertyData) {
        setProperty(propertyData);
        await storageService.setCache(cacheKey, propertyData, 10 * 60 * 1000); 
        
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

      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  const fetchFreshProperty = useCallback(async (id: number) => {
    try {
      const apiUrl = `${ApiConfig.postsApi}/${id}`;
      const response = await fetch(apiUrl, { headers: ApiConfig.headers.common });
      
      if (response.ok) {
        const freshProperty: Property = await response.json();
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