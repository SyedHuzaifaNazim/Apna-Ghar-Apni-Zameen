import { Ionicons } from '@expo/vector-icons'; // ADD THIS IMPORT
import { useFocusEffect } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { debounce } from 'lodash'; // Install with: npm install lodash
import { Box, Center, Fab, HStack, IconButton, ScrollView, useToast, VStack } from 'native-base';
import React, { useCallback, useMemo, useRef, useState } from 'react';

import { Property } from '@/api/apiMock';
import AppText from '@/components/base/AppText';
import LoadingSpinner from '@/components/base/LoadingSpinner';
import OfflineBanner from '@/components/base/OfflineBanner';
import FilterModal from '@/components/ui/FilterModal';
import PropertyCard from '@/components/ui/PropertyCard';
import QuickFilterBar from '@/components/ui/QuickFilterBar';
import SearchHeader from '@/components/ui/SearchHeader';
import { Colors } from '@/constants/Colors';
import { useFavorites } from '@/context/FavoritesContext';
import { useFetchProperties } from '@/hooks/useFetchProperties';
import { useFilterProperties } from '@/hooks/useFilterProperties';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const { properties, loading, error, refetch, lastUpdated, isOfflineData } = useFetchProperties();
  const { favorites } = useFavorites();
  const { isOffline, syncStatus } = useNetworkStatus();

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const {
    filteredProperties,
    activeFilters,
    filterCount,
    updateFilters,
  } = useFilterProperties(properties);

  // Create a debounced search function for better performance
  const debouncedSearchRef = useRef(
    debounce((query: string) => {
      updateFilters({ keywords: query });
    }, 300) // 300ms delay
  ).current;

  // Clean up debounce on unmount
  useFocusEffect(
    useCallback(() => {
      refetch();
      
      return () => {
        debouncedSearchRef.cancel();
      };
    }, [refetch, debouncedSearchRef])
  );
// Type '{ filters: { listingType: string; propertyCategory: string; city: string; minPrice: number; maxPrice: number; bedrooms: number; amenities: string[]; }; onApply: (filters: Partial<FilterOptions>) => void; onReset: () => void; }' is not assignable to type 'IntrinsicAttributes & QuickFilterBarProps'.
//   Property 'filters' does not exist on type 'IntrinsicAttributes & QuickFilterBarProps'.ts(2322)
// (property) filters: {
//     listingType: string;
//     propertyCategory: string;
//     city: string;
//     minPrice: number;
//     maxPrice: number;
//     bedrooms: number;
//     amenities: string[];
// }
  const modalFilters = useMemo(
    () => ({
      listingType: activeFilters.listingType || '',
      propertyCategory: activeFilters.propertyCategory || '',
      city: activeFilters.city || '',
      minPrice: activeFilters.minPrice ?? 0,
      maxPrice: activeFilters.maxPrice ?? 100000000,
      bedrooms: activeFilters.bedrooms ?? 0,
      amenities: activeFilters.amenities ?? [],
    }),
    [activeFilters]
  );

  // Memoize featured properties
  const featuredProperties = useMemo(() => {
    return filteredProperties
      .filter(property => property.isFeatured)
      .slice(0, 5);
  }, [filteredProperties]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      toast.show({
        title: 'Refreshed',
        description: 'Property listings updated',
        duration: 2000,
      });
    } catch (err) {
      console.error('Refresh error:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    
    // Use debounced search for better performance
    if (query.trim().length >= 2 || query.length === 0) {
      debouncedSearchRef(query);
    }
  }, [debouncedSearchRef]);

  const handlePropertyPress = useCallback((propertyId: number) => {
    router.push(`/listing/${propertyId}`);
  }, [router]);

  const handleMapPress = useCallback(() => {
    router.push('/map');
  }, [router]);

  const handleFilterPress = useCallback(() => {
    setShowFilters(true);
  }, []);

  // Calculate active filter count excluding search
  const activeFilterCount = useMemo(() => {
    const hasSearch = activeFilters.keywords && activeFilters.keywords.trim().length > 0;
    return Math.max(filterCount - (hasSearch ? 1 : 0), 0);
  }, [filterCount, activeFilters.keywords]);

  if (error) {
    return (
      <Box flex={1} bg={Colors.background.primary} safeArea>
        <SearchHeader
          onFilterPress={handleFilterPress}
          onSearchChange={handleSearchChange}
          searchQuery={searchQuery}
          filterCount={activeFilterCount}
        />
        <Center flex={1} px={4}>
          <Ionicons name="warning-outline" size={64} color={Colors.error[500]} />
          <AppText variant="h3" weight="semibold" align="center" style={{ marginTop: 16 }}>
            Failed to load properties
          </AppText>
          <AppText variant="body" color="secondary" align="center" style={{ marginTop: 8 }}>
            {error}
          </AppText>
          <IconButton
            icon={<Ionicons name="reload" size={24} color={Colors.primary[500]} />}
            onPress={refetch}
            variant="outline"
            style={{ marginTop: 16 }}
          />
        </Center>
      </Box>
    );
  }

  return (
    <Box flex={1} bg="gray.50" safeArea>
      <OfflineBanner />

      <SearchHeader
        onFilterPress={handleFilterPress}
        onSearchChange={handleSearchChange}
        searchQuery={searchQuery}
        filterCount={activeFilterCount}
      />

      {loading && !refreshing ? (
        <LoadingSpinner text="Loading properties..." />
      ) : (
        <FlashList<Property>
          data={filteredProperties}
          renderItem={({ item }) => (
            <PropertyCard 
              property={item} 
              onPress={p => handlePropertyPress(p.id)} 
            />
          )}
          keyExtractor={item => `property-${item.id}`}
          estimatedItemSize={280}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <VStack space={6} py={4} bg="gray.50">
              {/* Header Content */}
              {/* Quick Filter Bar */}
              
              <VStack space={2} px={4}>
                <AppText variant="h1" weight="bold">
                  Find Your Dream Home
                </AppText>
                <QuickFilterBar
  activeFilters={activeFilters}
  filterCount={activeFilterCount}
  updateFilters={updateFilters} // Make sure this is not undefined
/>
                <AppText variant="body" color="secondary">
                  Discover the perfect property from our curated collection
                </AppText>
              </VStack>

              {/* Stats Row */}
              <HStack space={3} px={4}>
                <Box flex={1} bg="white" p={4} borderRadius={12} shadow={1}>
                  <AppText variant="h2" weight="bold" color="primary" align="center">
                    {properties.length}
                  </AppText>
                  <AppText variant="small" color="secondary" align="center">
                    Properties
                  </AppText>
                </Box>
                <Box flex={1} bg="white" p={4} borderRadius={12} shadow={1}>
                  <AppText variant="h2" weight="bold" color="primary" align="center">
                    {favorites.length}
                  </AppText>
                  <AppText variant="small" color="secondary" align="center">
                    Favorites
                  </AppText>
                </Box>
                <Box flex={1} bg="white" p={4} borderRadius={12} shadow={1}>
                  <AppText variant="h2" weight="bold" color="primary" align="center">
                    {featuredProperties.length}
                  </AppText>
                  <AppText variant="small" color="secondary" align="center">
                    Featured
                  </AppText>
                </Box>
              </HStack>

              {/* Featured Properties Section */}
              {featuredProperties.length > 0 && (
                <VStack space={3}>
                  <HStack justifyContent="space-between" alignItems="center" px={4}>
                    <AppText variant="h2" weight="bold">
                      Featured Properties
                    </AppText>
                    <IconButton
                      icon={<Ionicons name="star" size={20} color={Colors.secondary[500]} />}
                      variant="ghost"
                    />
                  </HStack>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                  >
                    <HStack space={3}>
                      {featuredProperties.map(property => (
                        <Box key={`featured-${property.id}`} width={300}>
                          <PropertyCard
                            property={property}
                            variant="featured"
                            onPress={p => handlePropertyPress(p.id)}
                          />
                        </Box>
                      ))}
                    </HStack>
                  </ScrollView>
                </VStack>
              )}

              {/* Recent Listings Header */}
              <VStack space={2} px={4}>
                <HStack justifyContent="space-between" alignItems="center">
                  <AppText variant="h2" weight="bold">
                    Recent Listings
                  </AppText>
                  <VStack alignItems="flex-end">
                    <AppText variant="body" color="primary">
                      {filteredProperties.length} found
                    </AppText>
                    {lastUpdated && (
                      <AppText variant="small" color="secondary">
                        {isOfflineData || isOffline ? 'Offline data' : 'Updated'} •{' '}
                        {new Date(lastUpdated).toLocaleTimeString()}
                      </AppText>
                    )}
                    {syncStatus === 'error' && (
                      <AppText variant="small" color="error">
                        Sync failed, tap banner to retry
                      </AppText>
                    )}
                  </VStack>
                </HStack>
                <AppText variant="body" color="secondary">
                  New properties added recently
                </AppText>
              </VStack>
            </VStack>
          }
          ListEmptyComponent={
            <Center py={8}>
              <Ionicons name="search-outline" size={64} color={Colors.text.disabled} />
              <AppText variant="h3" weight="semibold" style={{ marginTop: 16 }}>
                No properties found
              </AppText>
              <AppText variant="body" color="secondary" style={{ marginTop: 8 }} align="center">
                {searchQuery ? 
                  `No results for "${searchQuery}"` : 
                  'Try adjusting your search criteria or filters'
                }
              </AppText>
            </Center>
          }
          contentContainerStyle={{
            paddingBottom: 100,
            backgroundColor: 'gray.50',
          }}
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
      )}

      <Fab
        renderInPortal={false}
        shadow={2}
        size="lg"
        icon={<Ionicons name="map" size={24} color="white" />}
        colorScheme="primary"
        onPress={handleMapPress}
        bottom={100}
      />

      <FilterModal
        isVisible={showFilters}
        onClose={() => setShowFilters(false)}
        onApplyFilters={filtersFromModal => {
          updateFilters(filtersFromModal);
          setShowFilters(false);
        }}
        currentFilters={modalFilters}
      />
    </Box>
  );
};

export default HomeScreen;