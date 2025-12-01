import ErrorBoundary from '@/components/base/ErrorBoundary';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import {
  Box,
  Center,
  HStack,
  IconButton,
  Input,
  Pressable,
  ScrollView,
  VStack,
} from 'native-base';
import React, { useMemo, useState } from 'react';

import AppText from '@/components/base/AppText';
import FilterModal from '@/components/ui/FilterModal';
import PropertyCard from '@/components/ui/PropertyCard';
import { Colors } from '@/constants/Colors';
import { useFetchProperties } from '@/hooks/useFetchProperties';
import { useFilterProperties } from '@/hooks/useFilterProperties';

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
    <Box flex={1} bg="white" safeArea>
      {/* Search Header */}
      <Box px={4} py={3} bg="white" shadow={1} borderBottomWidth={1} borderBottomColor="gray.200">
        <HStack space={3} alignItems="center">
          <IconButton
            icon={<Ionicons name="arrow-back" size={24} color={Colors.primary[500]} />}
            onPress={() => router.back()}
            variant="ghost"
          />
          
          <Input
            placeholder="Search properties, locations, keywords..."
            value={searchQuery}
            onChangeText={query => {
              setSearchQuery(query);
              updateFilters({ keywords: query });
            }}
            flex={1}
            backgroundColor="gray.50"
            borderRadius="lg"
            fontSize="md"
            height={10}
            autoFocus={true}
            InputLeftElement={
              <Ionicons 
                name="search" 
                size={18} 
                color={Colors.text.secondary} 
                style={{ marginLeft: 12 }}
              />
            }
            InputRightElement={
              searchQuery.trim() ? (
                <IconButton
                  icon={<Ionicons name="close" size={18} color={Colors.text.secondary} />}
                  onPress={handleClearSearch}
                  variant="ghost"
                />
              ) : undefined
            }
            variant="unstyled"
            _focus={{
              backgroundColor: 'white',
              borderColor: Colors.primary[500],
              borderWidth: 1,
            }}
          />
          
          <IconButton
            backgroundColor={activeFilterCount > 0 ? "primary.500" : "gray.200"}
            borderRadius="lg"
            icon={
              <Ionicons 
                name="options-outline" 
                size={18} 
                color={activeFilterCount > 0 ? "white" : Colors.text.secondary} 
              />
            }
            onPress={() => setShowFilters(true)}
          >
            {activeFilterCount > 0 && (
              <Box
                position="absolute"
                top={-2}
                right={-2}
                bg="red.500"
                width={4}
                height={4}
                borderRadius="full"
                justifyContent="center"
                alignItems="center"
              >
                <AppText variant="small" color="inverse">
                  {activeFilterCount}
                </AppText>
              </Box>
            )}
          </IconButton>
        </HStack>
      </Box>

      {searchQuery || activeFilterCount > 0 ? (
        // Search Results
        <FlashList
          data={filteredProperties}
          renderItem={({ item }) => (
            <PropertyCard 
              property={item} 
              onPress={() => handlePropertyPress(item.id)}
            />
          )}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <VStack space={3} py={4} px={4}>
              <AppText variant="h3" weight="bold">
                Search Results ({filteredProperties.length})
              </AppText>
              {searchQuery && (
                <AppText variant="body" color="secondary">
                  Results for "{searchQuery}"
                </AppText>
              )}
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
              <IconButton
                icon={<Ionicons name="filter" size={24} color={Colors.primary[500]} />}
                onPress={() => setShowFilters(true)}
                variant="ghost"
                borderWidth={1}
                borderColor={Colors.primary[500]}
                backgroundColor="transparent"
                style={{ marginTop: 16 }}
              >
                <AppText variant="body" color="primary">
                  Adjust Filters
                </AppText>
              </IconButton>
            </Center>
          }
          contentContainerStyle={{ 
            paddingBottom: 20,
            backgroundColor: 'gray.50'
          }}
        />
      ) : (
        // Search Suggestions
        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack space={6} p={4}>
            {/* Recent Searches */}
            <VStack space={3}>
              <AppText variant="h3" weight="bold">Recent Searches</AppText>
              <VStack space={2}>
                {recentSearches.map((search, index) => (
                  <Pressable
                    key={index}
                    onPress={() => {
                      setSearchQuery(search);
                      updateFilters({ keywords: search });
                    }}
                    _pressed={{ backgroundColor: 'gray.50' }}
                  >
                    <HStack space={3} alignItems="center" py={3}>
                      <Ionicons name="time-outline" size={20} color={Colors.text.secondary} />
                      <Box flex={1}>
                        <AppText variant="body">{search}</AppText>
                      </Box>
                      <Ionicons name="arrow-up" size={16} color={Colors.text.disabled} />
                    </HStack>
                  </Pressable>
                ))}
              </VStack>
            </VStack>

            {/* Popular Searches */}
            <VStack space={3}>
              <AppText variant="h3" weight="bold">Popular Searches</AppText>
              <HStack flexWrap="wrap" space={2}>
                {popularSearches.map((search, index) => (
                  <Pressable
                    key={index}
                    onPress={() => {
                      setSearchQuery(search);
                      updateFilters({ keywords: search });
                    }}
                  >
                    {({ isPressed }) => (
                      <Box 
                        bg={isPressed ? "gray.200" : "gray.100"}
                        px={3} 
                        py={2} 
                        borderRadius="lg"
                      >
                        <AppText variant="body">{search}</AppText>
                      </Box>
                    )}
                  </Pressable>
                ))}
              </HStack>
            </VStack>

            {/* Search Tips */}
            <VStack space={3} bg="primary.50" p={4} borderRadius="xl">
              <AppText variant="h3" weight="bold" color="primary">
                Search Tips
              </AppText>
              <VStack space={2}>
                <HStack space={2} alignItems="flex-start">
                  <Ionicons name="search" size={16} color={Colors.primary[500]} style={{ marginTop: 2 }} />
                  <Box flex={1}>
                    <AppText variant="body" color="secondary">
                      Use specific Karachi and Lahore neighborhoods such as "Clifton" or "Gulberg"
                    </AppText>
                  </Box>
                </HStack>
                <HStack space={2} alignItems="flex-start">
                  <Ionicons name="business" size={16} color={Colors.primary[500]} style={{ marginTop: 2 }} />
                  <Box flex={1}>
                    <AppText variant="body" color="secondary">
                      Include property type like "3 bed", "Villa", or "Commercial"
                    </AppText>
                  </Box>
                </HStack>
                <HStack space={2} alignItems="flex-start">
                  <Ionicons name="options" size={16} color={Colors.primary[500]} style={{ marginTop: 2 }} />
                  <Box flex={1}>
                    <AppText variant="body" color="secondary">
                      Use filters for PKR price range, bedrooms, and amenities
                    </AppText>
                  </Box>
                </HStack>
              </VStack>
            </VStack>
          </VStack>
        </ScrollView>
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
    </Box>
    </ErrorBoundary>
  );
};

export default SearchScreen;
