import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { Box, Center, Fab, HStack, IconButton, ScrollView, useToast, VStack } from 'native-base';
import React, { useCallback, useMemo, useState } from 'react';

import { Property } from '@/api/apiMock';
import AppText from '@/components/base/AppText';
import LoadingSpinner from '@/components/base/LoadingSpinner';
import OfflineBanner from '@/components/base/OfflineBanner';
import FilterModal from '@/components/ui/FilterModal';
import PropertyCard from '@/components/ui/PropertyCard';
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
    updateFilters,
  } = useFilterProperties(properties);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

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

  const featuredProperties = useMemo(() => {
    return filteredProperties.filter(property => property.isFeatured).slice(0, 5);
  }, [filteredProperties]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);

    toast.show({
      title: 'Refreshed',
      description: 'Property listings updated',
      duration: 2000,
    });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    updateFilters({ keywords: query });
  };

  const handlePropertyPress = (propertyId: number) => {
    router.push(`/listing/${propertyId}`);
  };

  const handleMapPress = () => {
    router.push('/map');
  };

  if (error) {
    return (
      <Box flex={1} bg={Colors.background.primary} safeArea>
        <SearchHeader
          onFilterPress={() => setShowFilters(true)}
          onSearchChange={handleSearchChange}
          searchQuery={searchQuery}
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
        onFilterPress={() => setShowFilters(true)}
        onSearchChange={handleSearchChange}
        searchQuery={searchQuery}
      />

      {loading && !refreshing ? (
        <LoadingSpinner text="Loading properties..." />
      ) : (
        <FlashList<Property>
          data={filteredProperties}
          renderItem={({ item }) => (
            <PropertyCard property={item} onPress={p => handlePropertyPress(p.id)} />
          )}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <VStack space={6} py={4} bg="gray.50">
              <VStack space={2} px={4}>
                <AppText variant="h1" weight="bold">
                  Find Your Dream Home
                </AppText>
                <AppText variant="body" color="secondary">
                  Discover the perfect property from our curated collection
                </AppText>
              </VStack>

              <HStack space={3} px={4}>
                <Box flex={1} bg="white" p={4} borderRadius="xl" shadow={1}>
                  <AppText variant="h2" weight="bold" color="primary" align="center">
                    {properties.length}
                  </AppText>
                  <AppText variant="small" color="secondary" align="center">
                    Properties
                  </AppText>
                </Box>
                <Box flex={1} bg="white" p={4} borderRadius="xl" shadow={1}>
                  <AppText variant="h2" weight="bold" color="primary" align="center">
                    {favorites.length}
                  </AppText>
                  <AppText variant="small" color="secondary" align="center">
                    Favorites
                  </AppText>
                </Box>
                <Box flex={1} bg="white" p={4} borderRadius="xl" shadow={1}>
                  <AppText variant="h2" weight="bold" color="primary" align="center">
                    {featuredProperties.length}
                  </AppText>
                  <AppText variant="small" color="secondary" align="center">
                    Featured
                  </AppText>
                </Box>
              </HStack>

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
                        <Box key={property.id} width={300}>
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
                Try adjusting your search criteria or filters
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