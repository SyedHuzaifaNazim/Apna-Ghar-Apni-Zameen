import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { ApiConfig } from '../constants/Config';
import { storageService } from '../services/storageService';
import { Property } from '../types/property';
import { useNetworkStatus } from './useNetworkStatus';

// --- MAPPER FUNCTION ---
const mapWordPressProperty = (wpItem: any): Property => {
  // Helper to safely get nested values (ACF fields)
  const acf = wpItem.acf || {};
  
  return {
    id: wpItem.id,
    title: wpItem.title?.rendered || 'Untitled Property',
    // Fallback to 0 if price is missing or not a number
    price: Number(acf.price) || 0,
    currency: acf.currency || 'PKR',
    listingType: acf.type === 'rent' ? 'For Rent' : 'For Sale', // Map backend value to Frontend Type
    propertyCategory: acf.category || 'Residential House',
    
    address: {
      city: acf.city || 'Unknown City',
      area: acf.area || '',
      line1: acf.address || '',
      postalCode: acf.postal_code || '',
      latitude: Number(acf.latitude) || 0,
      longitude: Number(acf.longitude) || 0,
    },

    bedrooms: Number(acf.bedrooms) || 0,
    bathrooms: Number(acf.bathrooms) || 0,
    floorLevel: Number(acf.floor_level) || null,
    furnishing: acf.furnishing || 'Unfurnished',

    yearBuilt: Number(acf.year_built) || new Date().getFullYear(),
    propertyCondition: acf.condition || 'Well-Maintained',

    amenities: Array.isArray(acf.amenities) ? acf.amenities : [],
    features: Array.isArray(acf.features) ? acf.features : [],
    tags: [], // WP might not have tags in this specific format

    nearbyLandmarks: [], // Populate if available

    ownerType: acf.owner_type || 'Agent',
    ownerDetails: {
      name: acf.contact_name || 'Agent',
      phone: acf.contact_phone || '',
      email: acf.contact_email || '',
    },

    contactVisibility: 'Public',

    // Handle images safely
    images: Array.isArray(acf.gallery) 
      ? acf.gallery 
      : [wpItem.jetpack_featured_media_url || 'https://via.placeholder.com/400x300'], 

    waterSupply: 'Available',
    electricityBackup: 'None',
    parkingSpaces: Number(acf.parking) || 0,

    description: wpItem.content?.rendered?.replace(/<[^>]+>/g, '') || '', // Strip HTML tags
    datePosted: wpItem.date || new Date().toISOString(),
    isFeatured: Boolean(acf.is_featured),
    views: 0,
    areaSize: Number(acf.area_size) || 0,
    areaUnit: acf.area_unit || 'sqft',
  };
};

// --- HOOK ---

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
    pageSize = 10, // WordPress default is usually 10
    cacheTimeout = 5 * 60 * 1000,
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
    (pageNum: number) => `properties_wp_page_${pageNum}`,
    []
  );

  const fetchProperties = useCallback(async (isRefresh = false, isLoadMore = false, targetPage = page) => {
    if (!enabled) return;

    try {
      if (!isLoadMore) setLoading(true);
      setError(null);

      // --- OFFLINE CHECK ---
      if (!isOnline) {
        const cachedData = await storageService.getCache<Property[]>(buildCacheKey(targetPage));
        if (cachedData) {
          setProperties(cachedData);
          setIsOfflineData(true);
        } else {
          setError('No internet connection');
        }
        setLoading(false);
        setIsRefreshing(false);
        return;
      }

      // --- REAL API CALL ---
      // NOTE: ApiConfig.postsApi should NOT have query params like '?per_page=10'
      const apiUrl = `${ApiConfig.postsApi}?page=${targetPage}&per_page=${pageSize}`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: ApiConfig.headers.common,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const rawData = await response.json();
      
      // WordPress returns an array of posts directly
      const rawPosts = Array.isArray(rawData) ? rawData : [];
      
      // MAP THE DATA
      const mappedProperties = rawPosts.map(mapWordPressProperty);

      if (isLoadMore) {
        setProperties(prev => [...prev, ...mappedProperties]);
      } else {
        setProperties(mappedProperties);
      }

      // Determine if there are more pages (Simplistic check for WP)
      setHasMore(rawPosts.length === pageSize);

      await storageService.setCache(buildCacheKey(targetPage), mappedProperties, cacheTimeout);
      setLastUpdated(Date.now());

    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Fetch failed';
      setError(msg);
      if (!isLoadMore) Alert.alert('Error', msg);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [enabled, page, pageSize, cacheTimeout, isOnline]);

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
    if (enabled) fetchProperties(false, false, 1);
  }, [enabled, fetchProperties]);

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

export const useFetchProperty = (propertyId: number | null) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperty = useCallback(async () => {
    if (!propertyId) return;
    setLoading(true);
    try {
        // Fetch specific post from WP
        const response = await fetch(`${ApiConfig.postsApi}/${propertyId}`);
        if (!response.ok) throw new Error('Failed to fetch property');
        
        const rawData = await response.json();
        // Map the single item
        const mapped = mapWordPressProperty(rawData);
        setProperty(mapped);
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Error');
    } finally {
        setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
      fetchProperty();
  }, [fetchProperty]);

  return { property, loading, error, refetch: fetchProperty };
};

export default useFetchProperties;