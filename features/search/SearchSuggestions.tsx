// features/search/SearchSuggestions.tsx - Example fix
import AppText from '@/components/base/AppText';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Box, HStack, Pressable, VStack } from 'native-base';
import React from 'react';

interface SearchSuggestionsProps {
  onSelectSuggestion: (suggestion: string) => void;
  onClearRecentSearches: () => void;
  recentSearches?: string[];
  popularSearches?: string[];
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  onSelectSuggestion,
  onClearRecentSearches,
  recentSearches = [],
  popularSearches = []
}) => {
  return (
    <Box flex={1} bg="white">
      <VStack space={6} p={4}>
        {/* Recent Searches - with null check */}
        {recentSearches && recentSearches.length > 0 && (
          <VStack space={3}>
            <HStack justifyContent="space-between" alignItems="center">
              <AppText variant="h3" weight="bold">Recent Searches</AppText>
              <Pressable onPress={onClearRecentSearches}>
                <AppText variant="small" color="primary">Clear all</AppText>
              </Pressable>
            </HStack>
            <VStack space={2}>
              {recentSearches.map((search, index) => (
                <Pressable
                  key={index}
                  onPress={() => onSelectSuggestion(search)}
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
        )}

        {/* Popular Searches - with null check */}
        {popularSearches && popularSearches.length > 0 && (
          <VStack space={3}>
            <AppText variant="h3" weight="bold">Popular Searches</AppText>
            <HStack flexWrap="wrap" space={2}>
              {popularSearches.map((search, index) => (
                <Pressable
                  key={index}
                  onPress={() => onSelectSuggestion(search)}
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
        )}
      </VStack>
    </Box>
  );
};

export default SearchSuggestions;