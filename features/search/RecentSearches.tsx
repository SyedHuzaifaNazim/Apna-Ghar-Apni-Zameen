import { Ionicons } from '@expo/vector-icons';
import { Box, HStack, IconButton, Pressable, VStack } from 'native-base';
import React from 'react';

import AppText from '../../components/base/AppText';
import { SearchHistoryItem } from '../../hooks/useSearch';

interface RecentSearchesProps {
  items: SearchHistoryItem[];
  onSelect: (item: SearchHistoryItem) => void;
  onClear?: () => void;
  onRemove?: (id: string) => void;
}

const RecentSearches: React.FC<RecentSearchesProps> = ({
  items,
  onSelect,
  onClear,
  onRemove,
}) => {
  if (items.length === 0) {
    return (
      <Box py={6} alignItems="center">
        <Ionicons name="time-outline" size={32} color="#9e9e9e" />
        <AppText variant="body" color="secondary" align="center" mt={2}>
          Start searching to build your history
        </AppText>
      </Box>
    );
  }

  return (
    <VStack space={3}>
      <HStack justifyContent="space-between" alignItems="center">
        <AppText variant="h3" weight="bold">
          Recent Searches
        </AppText>
        {onClear && (
          <IconButton
            icon={<Ionicons name="trash-outline" size={20} color="#d32f2f" />}
            onPress={onClear}
            variant="ghost"
          />
        )}
      </HStack>

      <VStack space={2}>
        {items.map(item => (
          <Pressable
            key={item.id}
            onPress={() => onSelect(item)}
            _pressed={{ opacity: 0.7 }}
          >
            <HStack
              alignItems="center"
              justifyContent="space-between"
              bg="gray.50"
              borderRadius="xl"
              px={4}
              py={3}
            >
              <HStack space={3} alignItems="center" flex={1}>
                <Ionicons name="time-outline" size={18} color="#757575" />
                <VStack flex={1}>
                  <AppText variant="body" numberOfLines={1}>
                    {item.query}
                  </AppText>
                  <AppText variant="small" color="secondary">
                    {new Date(item.timestamp).toLocaleString()}
                  </AppText>
                </VStack>
              </HStack>

              {onRemove && (
                <IconButton
                  icon={<Ionicons name="close" size={16} color="#9e9e9e" />}
                  onPress={() => onRemove(item.id)}
                  variant="ghost"
                />
              )}
            </HStack>
          </Pressable>
        ))}
      </VStack>
    </VStack>
  );
};

export default RecentSearches;
