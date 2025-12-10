import AppText from '@/components/base/AppText';
import ErrorBoundary from '@/components/base/ErrorBoundary';
import FilterModal from '@/components/ui/FilterModal';
import PropertyCard from '@/components/ui/PropertyCard';
import { Colors } from '@/constants/Colors';
import SearchSuggestions from '@/features/search/SearchSuggestions';
import { useFetchProperties } from '@/hooks/useFetchProperties';
import { useFilterProperties } from '@/hooks/useFilterProperties';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const SearchScreen: React.FC = () => {
  const router = useRouter();
  const { properties, loading } = useFetchProperties();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const {
    filteredProperties,
    activeFilters,
    filterCount,
    updateFilters,
  } = useFilterProperties(properties);

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

  const handlePropertyPress = (propertyId: number) => {
    router.push(`/listing/${propertyId}`);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    updateFilters({ keywords: '' });
  };

  const activeFilterCount = Math.max(
    filterCount - (activeFilters.keywords && activeFilters.keywords.trim() ? 1 : 0),
    0
  );

  // Mock data for search suggestions
  const recentSearches = [
    '3 bed flat in Clifton',
    'Commercial shop in Saddar',
    'Luxury apartment DHA',
    'Budget homes in Gulshan'
  ];

  const popularSearches = [
    'Plot in Bahria Town',
    'Penthouse Karachi',
    'Office space Karachi',
    'House in Lahore',
    'Studio Islamabad'
  ];

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
        {/* Search Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.primary[500]} />
          </TouchableOpacity>
          
          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
              <Ionicons 
                name="search" 
                size={18} 
                color={Colors.text.secondary}
                style={styles.searchIcon}
              />
              <TextInput
                placeholder="Search properties, locations, keywords..."
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={query => {
                  setSearchQuery(query);
                  updateFilters({ keywords: query });
                }}
                style={styles.searchInput}
                autoFocus={true}
              />
              {searchQuery.trim() ? (
                <TouchableOpacity 
                  style={styles.clearButton}
                  onPress={handleClearSearch}
                >
                  <Ionicons name="close" size={18} color={Colors.text.secondary} />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
          
          <View style={styles.filterButtonContainer}>
            <TouchableOpacity 
              style={[
                styles.filterButton,
                { backgroundColor: activeFilterCount > 0 ? Colors.primary[500] : '#e5e7eb' }
              ]}
              onPress={() => setShowFilters(true)}
            >
              <Ionicons 
                name="options-outline" 
                size={18} 
                color={activeFilterCount > 0 ? "white" : Colors.text.secondary} 
              />
              {activeFilterCount > 0 && (
                <View style={styles.filterBadge}>
                  <AppText variant="small" style={styles.filterBadgeText}>
                    {activeFilterCount}
                  </AppText>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {searchQuery || activeFilterCount > 0 ? (
          // Search Results
          <FlashList
            data={filteredProperties}
            renderItem={({ item }) => (
              <View style={styles.propertyCardWrapper}>
                <PropertyCard 
                  property={item} 
                  onPress={() => handlePropertyPress(item.id)}
                />
              </View>
            )}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={styles.resultsHeader}>
                <AppText variant="h3" fontWeight="bold">
                  Search Results ({filteredProperties.length})
                </AppText>
                {searchQuery && (
                  <AppText variant="body" color="secondary" style={styles.resultsQuery}>
                    Results for "{searchQuery}"
                  </AppText>
                )}
              </View>
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={64} color={Colors.text.disabled} />
                <AppText variant="h3" fontWeight="semibold" style={styles.emptyTitle}>
                  No properties found
                </AppText>
                <AppText variant="body" color="secondary" style={styles.emptyText}>
                  Try adjusting your search criteria or filters
                </AppText>
                <TouchableOpacity
                  style={styles.emptyFilterButton}
                  onPress={() => setShowFilters(true)}
                >
                  <Ionicons name="filter" size={20} color={Colors.primary[500]} />
                  <AppText variant="body" color="primary" style={styles.emptyFilterButtonText}>
                    Adjust Filters
                  </AppText>
                </TouchableOpacity>
              </View>
            }
            contentContainerStyle={styles.listContent}
            estimatedItemSize={200}
          />
        ) : (
          // Search Suggestions
          <SearchSuggestions
            onSelectSuggestion={(suggestion: string) => {
              setSearchQuery(suggestion);
              updateFilters({ keywords: suggestion });
            }}
            onClearRecentSearches={() => {}}
            recentSearches={recentSearches}
            popularSearches={popularSearches}
          />
        )}

        {showFilters && (
          <FilterModal
            isVisible={showFilters}
            onClose={() => setShowFilters(false)}
            onApplyFilters={nextFilters => {
              updateFilters(nextFilters);
              setShowFilters(false);
            }}
            currentFilters={modalFilters}
          />
        )}
      </SafeAreaView>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  searchContainer: {
    flex: 1,
    marginRight: 12,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    height: 40,
  },
  searchIcon: {
    marginLeft: 12,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    paddingHorizontal: 8,
    color: '#333',
  },
  clearButton: {
    padding: 8,
    marginRight: 8,
  },
  filterButtonContainer: {
    position: 'relative',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  resultsQuery: {
    marginTop: 4,
  },
  propertyCardWrapper: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 64,
  },
  emptyTitle: {
    marginTop: 16,
    textAlign: 'center',
  },
  emptyText: {
    marginTop: 8,
    textAlign: 'center',
  },
  emptyFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary[500],
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 16,
  },
  emptyFilterButtonText: {
    marginLeft: 8,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default SearchScreen;