import { Ionicons } from '@expo/vector-icons';
import { HStack, Pressable, ScrollView, VStack } from 'native-base';
import React from 'react';

import AppText from '../../components/base/AppText';
import { SearchSuggestion } from '../../hooks/useSearch';

interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  onSelect: (text: string) => void;
}

const iconColorMap: Record<SearchSuggestion['type'], string> = {
  recent: '#757575',
  popular: '#ff9800',
  suggestion: '#2196f3',
};

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ suggestions, onSelect }) => {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <HStack space={3}>
        {suggestions.map((suggestion, index) => (
          <Pressable key={`${suggestion.text}-${index}`} onPress={() => onSelect(suggestion.text)}>
            <VStack
              space={1}
              borderRadius="xl"
              borderWidth={1}
              borderColor="gray.200"
              px={4}
              py={2}
              bg="white"
              minW={150}
            >
              <HStack alignItems="center" space={2}>
                <Ionicons
                  name={suggestion.icon ?? 'search'}
                  size={16}
                  color={iconColorMap[suggestion.type]}
                />
                <AppText variant="small" color="secondary">
                  {suggestion.type === 'recent'
                    ? 'Recent'
                    : suggestion.type === 'popular'
                    ? 'Popular'
                    : 'Try this'}
                </AppText>
              </HStack>
              <AppText variant="body" numberOfLines={2}>
                {suggestion.text}
              </AppText>
            </VStack>
          </Pressable>
        ))}
      </HStack>
    </ScrollView>
  );
};

export default SearchSuggestions;
