import AppText from '@/components/base/AppText';
import ErrorBoundary from '@/components/base/ErrorBoundary';
import FilterModal from '@/components/ui/FilterModal';
import PropertyCard from '@/components/ui/PropertyCard';
import { Colors } from '@/constants/Colors';
import SearchSuggestions from '@/features/search/SearchSuggestions';
import { propertyApi } from '@/services/apiService';
import { Property } from '@/types/property';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const SearchScreen: React.FC = () => {
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Debounced API Call for Server-Side Search
  const performSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const response = await propertyApi.searchProperties(query);
        if (response.data && Array.isArray(response.data)) {
            setResults(response.data as any);
        }
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    performSearch(searchQuery);
    return () => {
      performSearch.cancel();
    };
  }, [searchQuery, performSearch]);

  const handlePropertyPress = (propertyId: number) => {
    router.push(`/listing/${propertyId}`);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setResults([]);
  };

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
                onChangeText={setSearchQuery}
                style={styles.searchInput}
                autoFocus={true}
              />
              {loading ? (
                <View style={styles.clearButton}>
                    <ActivityIndicator size="small" color={Colors.primary[500]} />
                </View>
              ) : searchQuery.trim() ? (
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
                { backgroundColor: '#e5e7eb' }
              ]}
              onPress={() => setShowFilters(true)}
            >
              <Ionicons 
                name="options-outline" 
                size={18} 
                color={Colors.text.secondary} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {searchQuery.length > 0 ? (
          // Search Results
          <FlashList
            data={results}
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
              !loading ? (
                <View style={styles.resultsHeader}>
                    <AppText variant="h3" weight="bold">
                    Search Results ({results.length})
                    </AppText>
                    <AppText variant="body" color="secondary" style={styles.resultsQuery}>
                        Results for "{searchQuery}"
                    </AppText>
                </View>
              ) : null
            }
            ListEmptyComponent={
              !loading ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="search-outline" size={64} color={Colors.text.disabled} />
                    <AppText variant="h3" weight="semibold" style={styles.emptyTitle}>
                    No properties found
                    </AppText>
                    <AppText variant="body" color="secondary" style={styles.emptyText}>
                    Try adjusting your search criteria or keywords
                    </AppText>
                </View>
              ) : null
            }
            contentContainerStyle={styles.listContent}
            // estimatedItemSize removed to resolve type error
          />
        ) : (
          // Search Suggestions (Default State)
          <SearchSuggestions
            onSelectSuggestion={(suggestion: string) => {
              setSearchQuery(suggestion);
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
            onApplyFilters={() => {
                setShowFilters(false);
            }}
            currentFilters={{}}
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