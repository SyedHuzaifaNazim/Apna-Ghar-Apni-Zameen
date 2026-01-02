// screens/HomeScreen.tsx
import { Property } from '@/api/apiMock'; // <--- UPDATED IMPORT
import AppButton from '@/components/base/AppButton';
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
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { debounce } from 'lodash';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Image, ImageBackground, SafeAreaView, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useDrawer } from '../app/_layout';

// ... (Rest of the file remains exactly the same as provided, just change the import at the top)

// --- Component Types ---
interface CustomFabProps {
    icon: React.ReactNode;
    onPress: () => void;
}
interface CustomIconButtonProps {
    icon: React.ReactNode;
    onPress: () => void; 
    style?: any;
}
interface CustomInputProps {
    value: string;
    onChangeText: (text: string) => void;
    onClear: () => void;
    placeholder: string;
    iconName: string;
}
// -----------------------

const BACKGROUND_IMAGE = require('@/assets/images/background1.png'); 

const CustomFab: React.FC<CustomFabProps> = ({ icon, onPress }) => (
    <TouchableOpacity 
        style={styles.fab}
        onPress={onPress}
        activeOpacity={0.8}
    >
        {icon}
    </TouchableOpacity>
);

const CustomIconButton: React.FC<CustomIconButtonProps> = ({ icon, onPress, style }) => (
    <TouchableOpacity onPress={onPress} style={style} activeOpacity={0.7}>
        {icon}
    </TouchableOpacity>
);

const CustomInput: React.FC<CustomInputProps> = ({ value, onChangeText, onClear, placeholder, iconName }) => (
    <View style={styles.searchInputWrapper}>
        <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={22} color={Colors.gray[500]} style={styles.searchInputIcon} />
            <TextInput
                placeholder={placeholder}
                placeholderTextColor={Colors.gray[500]}
                value={value}
                onChangeText={onChangeText}
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={true}
                returnKeyType="search"
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
  const { openDrawer } = useDrawer(); 

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
      cities: activeFilters.cities || [], 
      minPrice: activeFilters.minPrice ?? 0,
      maxPrice: activeFilters.maxPrice ?? 100000000,
      bedrooms: activeFilters.bedrooms ?? 0,
      amenities: activeFilters.amenities ?? [],
    }),
    [activeFilters]
  );

  const allListingsCount = properties.length; 
  
  const showFilteredResultsList = filterCount > 0;
  const mainListData: Property[] = showFilteredResultsList ? filteredProperties : [];

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

  const handleOpenAdvancedFilters = useCallback(() => {
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
  
  const renderAllListingsSection = () => (
      <View style={styles.allListingsHeader}>
          <View style={styles.allListingsTitleRow}>
              <AppText variant="h2" weight="bold">
                  {showFilteredResultsList ? 'Filter Results' : 'Browse All Properties'}
              </AppText>
          </View>
          
          {showFilteredResultsList ? (
              <AppText variant="body" color="primary" style={{ marginBottom: 12 }}>
                  Found {filteredProperties.length} matching properties.
              </AppText>
          ) : (
              <>
                {/* Featured Properties Section (shown only when no filters are active) */}
                {featuredProperties.length > 0 && (
                    <View style={styles.featuredSection}>
                        <View style={styles.featuredHeaderRow}>
                            <AppText variant="h2" weight="bold">
                            Featured Properties
                            </AppText>
                            <CustomIconButton
                            icon={<Ionicons name="star" size={20} color={Colors.status.featured} />}
                            style={{ padding: 8 }}
                            onPress={() => {}} 
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
                
                <AppText variant="body" color="secondary" style={{ marginBottom: 12, marginTop: 16 }}>
                    See all {allListingsCount} listings in the Industrial Hub.
                </AppText>
                <AppButton
                    onPress={() => router.push('/industrial-hub')}
                    leftIcon={<Ionicons name="arrow-forward" size={18} color="white" />}
                >
                    Go to Industrial Hub
                </AppButton>
              </>
          )}
      </View>
  );

  return (
    <View style={[styles.flex1, { backgroundColor: Colors.background.secondary }]}>
      <OfflineBanner />

      {loading && !refreshing && <LoadingSpinner text="Loading properties..." />}

      <FlashList<Property>
        data={mainListData}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}> 
              <PropertyCard 
                property={item} 
                onPress={p => handlePropertyPress(p.id)} 
              />
          </View>
        )}
        keyExtractor={item => `property-${item.id}`}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* 1. IMMERSIVE HEADER/SEARCH BLOCK */}
            <SafeAreaView style={styles.immersiveHeaderSafeArea}>
              <ImageBackground
                source={BACKGROUND_IMAGE}
                style={styles.imageBackground}
                imageStyle={styles.imageStyle}
              >
                {/* Image Overlay */}
                <View style={styles.imageOverlay} />

                <View style={styles.immersiveHeader}>
                  <View style={styles.headerRow}>
                    {/* HAMBURGER ICON */}
                    <TouchableOpacity onPress={openDrawer} activeOpacity={0.8} style={styles.hamburgerButton}>
                        <Ionicons name="menu" size={30} color="white" />
                    </TouchableOpacity>
                    <AppText variant="h1" weight="bold" color="white" style={styles.headerTitle}>
                    <Image
                      source={require('@/assets/images/transparent-logo1.png')}
                      resizeMode="contain"
                      style={styles.logoImage}
                    />
                      {/* Apna Ghar Apni Zameen */}
                      
                    </AppText>
                      <TouchableOpacity onPress={handleOpenAdvancedFilters} activeOpacity={0.8}>
                      <View style={styles.filterIconWrapper}>
                        <Ionicons name="options-outline" size={24} color="white" />
                        {filterCount > 0 && ( 
                          <View style={styles.filterBadge}>
                            <AppText variant="small" weight="bold" color="white" style={styles.filterBadgeText}>
                              {filterCount}
                            </AppText>
                          </View>
                        )}
                      </View>
                      
                    </TouchableOpacity>
                    
                  </View>
                  
                    <AppText variant="h3" color='#d1cfcf'>
                      Find your next dream property!
                    </AppText>

                    <AppText variant="body" color="secondary" style={styles.spacer}>
                      Find your next dream property!
                    </AppText>
                  <View style={styles.headerSearchSection}>
                    {/* Search Input (Styled round) */}
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
            
            {/* 2. QUICK FILTER BAR (Static Grid) */}
            <View style={styles.quickFilterBarWrapper}>
              <QuickFilterBar
                activeFilters={activeFilters}
                filterCount={filterCount}
                updateFilters={updateFilters}
                onOpenAdvancedFilters={handleOpenAdvancedFilters}
              />
            </View>

            <View style={styles.contentContainer}>
              {/* 3. Stats Row (Always visible) */}
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <AppText variant="h2" weight="bold" color="primary">
                    {allListingsCount}+
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

              {/* 5. ALL LISTINGS / FILTER RESULTS HEADER */}
              {renderAllListingsSection()}
              
              {/* Render an empty component if filters are active but yield no results */}
              {showFilteredResultsList && mainListData.length === 0 && (
                <View style={styles.emptyFilterResults}>
                    <Ionicons name="sad-outline" size={64} color={Colors.gray[400]} />
                    <AppText variant="h3" weight="bold" style={{ marginTop: 16 }}>No Results Found</AppText>
                    <AppText variant="body" color="secondary" align="center" style={{ marginTop: 8, paddingHorizontal: 40 }}>
                        Try adjusting your quick filters or use the advanced options for a wider search.
                    </AppText>
                </View>
              )}
            </View>
          </View>
        }
        ListFooterComponent={showFilteredResultsList && mainListData.length > 0 ? <View style={{ height: 100 }} /> : null}
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
  // --- Immersive Header Styles (UI FIX for search bar overlap) ---
  immersiveHeaderSafeArea: {
    backgroundColor: Colors.primary[600],
  },
  imageBackground: {
    width: '100%',
    minHeight: 200, 
    backgroundColor: Colors.primary[600],
    justifyContent: 'center',
  },
  imageStyle: {
    opacity: 0.5, 
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.primary[800], 
    opacity: 0.65, 
  },
  immersiveHeader: {
    paddingHorizontal: 16,
    paddingBottom: 60, // Sufficient space above search bar
    paddingTop: 48, 
    position: 'relative', 
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20, 
    position: 'relative',
  },
  hamburgerButton: {
    position: 'absolute',
    left: 0,
    top: -5, 
    zIndex: 20,
    padding: 5,
  },
  headerTitle: {
    fontSize: 26,
    color: 'white',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 40, 
  },
  filterIconWrapper: {
    padding: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    top: -5,
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
    color: Colors.text.primary,
  },
  searchInputWrapper: {
    marginTop: 5,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    // FIX: Make search bar rounder and add shadow for visual impact
    borderRadius: 999, 
    shadowColor: Colors.shadow.dark,
    shadowOffset: { width: 0, height: 6 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 10,
    elevation: 8, 
    height: 40, 
  },
  searchInputIcon: {
    marginLeft: 16,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    paddingHorizontal: 8,
    color: Colors.text.primary,
    paddingVertical: 0,
  },
  searchInputClearButton: {
    padding: 8,
    marginRight: 12,
  },
  // --- Quick Filter Positioning (Pulls up under search bar) ---
  quickFilterBarWrapper: {
    marginTop: -40, // Aggressively pull the filter box up over the banner
    zIndex: 1,
    paddingHorizontal: 16,
    marginBottom: 16, 
  },
  // --- Content Styles ---
  contentContainer: {
    paddingTop: 16, 
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
    paddingHorizontal: 16,
  },
  featuredHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0, 
    marginBottom: 12,
  },
  featuredScrollViewContent: {
    paddingHorizontal: 0, 
    paddingRight: 16, 
    gap: 12,
  },
  featuredCardWrapper: {
    width: 280,
  },
  // All Listings / Filter Results Header
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
  // FlashList
  flashListContent: {
    paddingBottom: 100,
    alignSelf: 'stretch',
  },
  // FIX: Wrapper style for individual list items to ensure padding
  cardWrapper: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  emptyFilterResults: {
      alignItems: 'center',
      padding: 40,
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
  spacer: {
    height: 35,
  },
  logoImage: {
    width: 400,
    height: 100,
    marginRight: 8,
    // Ensure the image isn't hidden behind the absolute positioned hamburger
    zIndex: 10, 
  },
});

export default HomeScreen;