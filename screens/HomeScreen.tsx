import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { debounce } from 'lodash';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ImageBackground, SafeAreaView, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { Property } from '@/api/apiMock';
import AppText from '@/components/base/AppText';
import LoadingSpinner from '@/components/base/LoadingSpinner';
import OfflineBanner from '@/components/base/OfflineBanner';
import FilterModal from '@/components/ui/FilterModal';
import PropertyCard from '@/components/ui/PropertyCard';
import QuickFilterBar from '@/components/ui/QuickFilterBar';
import { Colors } from '@/constants/Colors';
import { useFavorites } from '@/context/FavoritesContext';
import { useFetchProperties } from '@/hooks/useFetchProperties';
import { useFilterProperties } from '@/hooks/useFilterProperties';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

// --- Local Image Import ---
// Using the path specified by the user
const BACKGROUND_IMAGE = require('@/assets/images/background1.png'); 

// --- Custom Component Replacements ---

const CustomFab = ({ icon, onPress }) => (
    <TouchableOpacity 
        style={styles.fab}
        onPress={onPress}
        activeOpacity={0.8}
    >
        {icon}
    </TouchableOpacity>
);

const CustomIconButton = ({ icon, onPress, style }) => (
    <TouchableOpacity onPress={onPress} style={style} activeOpacity={0.7}>
        {icon}
    </TouchableOpacity>
);

const CustomInput = ({ value, onChangeText, onClear, placeholder, iconName }) => (
    <View style={styles.searchInputWrapper}>
        <View style={styles.searchInputContainer}>
            <Ionicons name={iconName} size={22} color={Colors.gray[500]} style={styles.searchInputIcon} />
            <TextInput
                placeholder={placeholder}
                placeholderTextColor={Colors.gray[500]}
                value={value}
                onChangeText={onChangeText}
                style={styles.searchInput}
                autoCapitalize="none"
                autoCorrect={true} // Changed from false in previous version per user input
                returnKeyType="search"
                onChange={onChangeText}
            />
            {value.length > 0 && (
                <TouchableOpacity 
                    onPress={onClear}
                    style={styles.searchInputClearButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="close-circle" size={20} color={Colors.gray[500]} />
                </TouchableOpacity>
            )}
        </View>
    </View>
);

const HomeScreen: React.FC = () => {
  const router = useRouter();

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

  const debouncedSearchRef = useRef(
    debounce((query: string) => {
      updateFilters({ keywords: query });
    }, 300)
  ).current;

  useFocusEffect(
    useCallback(() => {
      refetch();
      
      return () => {
        debouncedSearchRef.cancel();
      };
    }, [refetch, debouncedSearchRef])
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
    return properties
      .filter(property => property.isFeatured)
      .slice(0, 5);
  }, [properties]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (err) {
      console.error('Refresh error:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    
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

  const activeFilterCount = useMemo(() => {
    const hasSearch = activeFilters.keywords && activeFilters.keywords.trim().length > 0;
    return Math.max(filterCount - (hasSearch ? 1 : 0), 0);
  }, [filterCount, activeFilters.keywords]);

  if (error) {
    return (
      <SafeAreaView style={[styles.flex1, { backgroundColor: Colors.background.primary }]}>
        <View style={styles.errorCenter}>
          <Ionicons name="warning-outline" size={64} color={Colors.error[500]} />
          <AppText variant="h3" weight="semibold" align="center" style={styles.errorTitle}>
            Failed to load properties
          </AppText>
          <AppText variant="body" color="secondary" align="center" style={styles.errorText}>
            {error}
          </AppText>
          <CustomIconButton
            icon={<Ionicons name="reload" size={24} color={Colors.primary[500]} />}
            onPress={refetch}
            style={styles.errorButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.flex1, { backgroundColor: Colors.background.secondary }]}>
      <OfflineBanner />

      {loading && !refreshing && <LoadingSpinner text="Loading properties..." />}

      <FlashList<Property>
        data={filteredProperties}
        renderItem={({ item }) => (
          <PropertyCard 
            property={item} 
            onPress={p => handlePropertyPress(p.id)} 
          />
        )}
        keyExtractor={item => `property-${item.id}`}
        estimatedItemSize={300}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* 1. IMMERSIVE HEADER/SEARCH BLOCK (Primary Color + Image) */}
            <SafeAreaView style={styles.immersiveHeaderSafeArea}>
              <ImageBackground
                // --- FIX: Using local asset file ---
                source={BACKGROUND_IMAGE}
                style={styles.imageBackground}
                imageStyle={styles.imageStyle}
              >
                {/* Image Overlay: Blends image with primary color and ensures text readability */}
                <View style={styles.imageOverlay} />

                <View style={styles.immersiveHeader}>
                  <View style={styles.headerRow}>
                    <AppText variant="h1" weight="bold" color="white" style={styles.headerTitle}>
                      Apna Ghar Apni Zameen
                    </AppText>
                    <TouchableOpacity onPress={handleFilterPress} activeOpacity={0.8}>
                      <View style={styles.filterIconWrapper}>
                        <Ionicons name="options-outline" size={24} color="white" />
                        {activeFilterCount > 0 && (
                          <View style={styles.filterBadge}>
                            <AppText variant="small" weight="bold" color="white" style={styles.filterBadgeText}>
                              {activeFilterCount}
                            </AppText>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.headerSearchSection}>
                    <AppText variant="h5" color="">
                      Find your next dream property
                    </AppText>
                    {/* Search Input in White */}
                    <CustomInput
                      value={searchQuery}
                      onChangeText={handleSearchChange}
                      onClear={() => handleSearchChange('')}
                      placeholder="Search properties, locations..."
                      iconName="search"
                    />
                  </View>
                </View>
              </ImageBackground>
            </SafeAreaView>
            
            {/* 2. QUICK FILTER BAR (Floating Effect) */}
            <View style={styles.quickFilterBarWrapper}>
              <QuickFilterBar
                activeFilters={activeFilters}
                filterCount={activeFilterCount}
                updateFilters={updateFilters}
              />
            </View>

            <View style={styles.contentContainer}>
              {/* 3. Stats Row */}
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <AppText variant="h2" weight="bold" color="primary">
                    {properties.length}+
                  </AppText>
                  <AppText variant="small" color="secondary" align="center">
                    Total Listings
                  </AppText>
                </View>
                <View style={styles.statBox}>
                  <AppText variant="h2" weight="bold" color="secondary">
                    {favorites.length}
                  </AppText>
                  <AppText variant="small" color="secondary" align="center">
                    Favorites
                  </AppText>
                </View>
                <View style={styles.statBox}>
                  <AppText variant="h2" weight="bold" color="warning.500">
                    {featuredProperties.length}
                  </AppText>
                  <AppText variant="small" color="secondary" align="center">
                    Premium Deals
                  </AppText>
                </View>
              </View>

              {/* 4. Featured Properties Section */}
              {featuredProperties.length > 0 && (
                <View style={styles.featuredSection}>
                  <View style={styles.featuredHeaderRow}>
                    <AppText variant="h2" weight="bold">
                      Featured Properties
                    </AppText>
                    <CustomIconButton
                      icon={<Ionicons name="star" size={20} color={Colors.status.featured} />}
                      onPress={handleFilterPress}
                      style={{ padding: 8 }}
                    />
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.featuredScrollViewContent}
                  >
                    {featuredProperties.map(property => (
                      <View key={`featured-${property.id}`} style={styles.featuredCardWrapper}>
                        <PropertyCard
                          property={property}
                          variant="featured"
                          onPress={p => handlePropertyPress(p.id)}
                        />
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* 5. All Listings Header */}
              <View style={styles.allListingsHeader}>
                <View style={styles.allListingsTitleRow}>
                  <AppText variant="h2" weight="bold">
                    All Listings
                  </AppText>
                  <View style={styles.allListingsInfo}>
                    <AppText variant="body" color="primary">
                      {filteredProperties.length} Properties
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
                  </View>
                </View>
                <AppText variant="body" color="secondary">
                  {searchQuery ? `Showing results for "${searchQuery}"` : 'Browse all properties available'}
                </AppText>
              </View>
            </View>
          </View>
        }
        contentContainerStyle={styles.flashListContent}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />

      {/* Floating Map Button */}
      <CustomFab
        icon={<Ionicons name="map" size={26} color="white" />}
        onPress={handleMapPress}
      />

      {/* Filter Modal */}
      <FilterModal
        isVisible={showFilters}
        onClose={() => setShowFilters(false)}
        onApplyFilters={filtersFromModal => {
          updateFilters(filtersFromModal);
          setShowFilters(false);
        }}
        currentFilters={modalFilters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  // --- Error View Styles ---
  errorCenter: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorTitle: {
    marginTop: 16,
  },
  errorText: {
    marginTop: 8,
  },
  errorButton: {
    marginTop: 16,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary[500],
  },
  // --- Immersive Header Styles (NativeBase Replacements) ---
  immersiveHeaderSafeArea: {
    backgroundColor: Colors.primary[600],
  },
  imageBackground: {
    width: '100%',
    minHeight: 250, // Ensure minimum height to show image
    backgroundColor: Colors.primary[600],
    justifyContent: 'flex-end',
  },
  imageStyle: {
    opacity: 0.5, // FIX: Increased image visibility
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.primary[800], // FIX: Using a darker shade of green
    opacity: 0.65, // FIX: Reduced opacity to let the image show through more clearly
  },
  immersiveHeader: {
    paddingHorizontal: 16,
    paddingBottom: 32, 
    paddingTop: 48, // Generous Top Padding for Status Bar Clearance
    position: 'relative', // Necessary for zIndex stacking with overlay
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    color: 'white',
  },
  filterIconWrapper: {
    padding: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: -2,
    right: 0,
    backgroundColor: Colors.error[500],
    borderRadius: 999,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    fontSize: 10,
  },
  headerSearchSection: {
    marginTop: 16,
    marginBottom: 0,
  },
  searchInputWrapper: {
    marginTop: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white', // Changed to white background
    borderRadius: 8,
    shadowColor: Colors.shadow.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 0,
    height: 48,
  },
  searchInputIcon: {
    marginLeft: 12,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    paddingHorizontal: 8,
    color: Colors.text.primary,
    paddingVertical: 0,
  },
  searchInputClearButton: {
    padding: 8,
    marginRight: 8,
  },
  // --- Quick Filter Floating ---
  quickFilterBarWrapper: {
    marginTop: -20,
    zIndex: 1,
    paddingHorizontal: 16,
  },
  // --- Content Styles ---
  contentContainer: {
    paddingTop: 24,
    backgroundColor: Colors.background.secondary,
  },
  // Stats Row
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: Colors.shadow.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  // Featured Section
  featuredSection: {
    marginTop: 8,
    marginBottom: 16,
  },
  featuredHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  featuredScrollViewContent: {
    paddingHorizontal: 16,
    paddingRight: 32,
    gap: 12,
  },
  featuredCardWrapper: {
    width: 280,
  },
  // All Listings Header
  allListingsHeader: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  allListingsTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  allListingsInfo: {
    alignItems: 'flex-end',
  },
  // FlashList
  flashListContent: {
    paddingBottom: 100,
  },
  // Floating Action Button (FAB)
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 16,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.shadow.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
});

export default HomeScreen;