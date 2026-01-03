import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { propertyApi } from '@/services/apiService';
import { storageService } from '@/services/storageService';
import { ListingType, Property, PropertyCategory } from '@/types/property';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

// --- MAPPER FUNCTION ---
const mapWordPressProperty = (wpItem: any): Property => {
  const acf = wpItem.acf || {};
  const embedded = wpItem._embedded || {};

  // Extract Featured Image
  let featuredImage = 'https://via.placeholder.com/400x300';
  if (embedded['wp:featuredmedia'] && embedded['wp:featuredmedia'][0]) {
    featuredImage = embedded['wp:featuredmedia'][0].source_url;
  } else if (wpItem.jetpack_featured_media_url) {
    featuredImage = wpItem.jetpack_featured_media_url;
  }

  return {
    id: wpItem.id,
    title: wpItem.title?.rendered || 'Untitled Property',
    listingType: (acf.listing_type as ListingType) || 'For Sale',
    propertyCategory: (acf.property_category as PropertyCategory) || 'Residential House',
    price: Number(acf.price) || 0,
    currency: acf.currency || 'PKR',
    areaSize: Number(acf.area_size) || 0,
    areaUnit: acf.area_unit || 'sqft',
    address: {
      city: acf.city || '',
      area: acf.area || '',
      line1: acf.address_line_1 || '',
      postalCode: acf.postal_code || '',
      latitude: Number(acf.latitude) || 24.8607,
      longitude: Number(acf.longitude) || 67.0011,
    },
    bedrooms: Number(acf.bedrooms) || 0,
    bathrooms: Number(acf.bathrooms) || 0,
    floorLevel: acf.floor_level ? Number(acf.floor_level) : null,
    furnishing: acf.furnishing || 'Unfurnished',
    yearBuilt: Number(acf.year_built) || new Date().getFullYear(),
    propertyCondition: acf.condition || 'Well-Maintained',
    amenities: Array.isArray(acf.amenities) ? acf.amenities : [],
    features: Array.isArray(acf.features) ? acf.features : [],
    tags: [],
    nearbyLandmarks: [],
    ownerType: acf.owner_type || 'Agent',
    ownerDetails: {
      name: acf.contact_name || 'Agent',
      phone: acf.contact_phone || '',
      email: acf.contact_email || '',
    },
    contactVisibility: 'Public',
    images: Array.isArray(acf.gallery) && acf.gallery.length > 0 ? acf.gallery : [featuredImage],
    waterSupply: 'Available',
    electricityBackup: 'None',
    parkingSpaces: Number(acf.parking_spaces) || 0,
    description: wpItem.content?.rendered?.replace(/<[^>]+>/g, '') || '',
    datePosted: wpItem.date,
    isFeatured: Boolean(acf.is_featured),
    views: 0,
  };
};

// --- LIST HOOK ---
export const useFetchProperties = (options: { enabled?: boolean; pageSize?: number } = {}) => {
  const { enabled = true, pageSize = 10 } = options;
  const { isOnline } = useNetworkStatus();
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOfflineData, setIsOfflineData] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchProperties = useCallback(async (isRefresh = false, isLoadMore = false, targetPage = page) => {
    if (!enabled) return;

    try {
      if (!isLoadMore) setLoading(true);
      setError(null);

      if (!isOnline) {
        const cached = await storageService.getCache<Property[]>('properties_cache');
        if (cached) {
          setProperties(cached);
          setIsOfflineData(true);
        } else {
          setError('No internet connection');
        }
        setLoading(false);
        setIsRefreshing(false);
        return;
      }

      const response = await propertyApi.getProperties({
        per_page: pageSize,
        page: targetPage,
      });

      const mappedData = Array.isArray(response.data) ? response.data.map(mapWordPressProperty) : [];

      if (isLoadMore) {
        setProperties(prev => [...prev, ...mappedData]);
      } else {
        setProperties(mappedData);
        setLastUpdated(new Date());
        if (targetPage === 1) {
            await storageService.setCache('properties_cache', mappedData);
        }
      }

      setHasMore(mappedData.length === pageSize);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fetch failed');
      if (!isLoadMore) Alert.alert('Error', 'Could not fetch properties.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [enabled, page, pageSize, isOnline]);

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
    refetch: refresh,
    refresh,
    hasMore,
    loadMore,
    isOfflineData,
    lastUpdated,
  };
};

// --- SINGLE PROPERTY HOOK ---
export const useFetchProperty = (id: number) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await propertyApi.getProperty(id);
        const mapped = mapWordPressProperty(response.data);
        setProperty(mapped);
      } catch (err: any) {
        setError(err.message || "Failed to load property");
      } finally {
        setLoading(false);
      }
    };
    
    load();
  }, [id]);

  return { property, loading, error };
};

export default useFetchProperties;