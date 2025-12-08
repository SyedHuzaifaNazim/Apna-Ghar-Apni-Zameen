import { FlashList } from '@shopify/flash-list';
import { Box, Center, HStack, Spinner } from 'native-base';
import React from 'react';

import { Property } from '../../api/apiMock';
import AppText from '../../components/base/AppText';
import PropertyCard from '../../components/ui/PropertyCard';

interface SearchResultsProps {
  properties: Property[];
  loading?: boolean;
  emptyMessage?: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  properties,
  loading = false,
  emptyMessage = 'No properties match your search. Try adjusting the filters.',
}) => {
  if (loading) {
    return (
      <Center py={8}>
        <Spinner color="primary.500" size="lg" />
        <AppText variant="body" color="secondary" style={{ marginTop: 12 }}>
          Searching properties…
        </AppText>
      </Center>
    );
  }

  if (properties.length === 0) {
    return (
      <Center py={10}>
        <AppText variant="body" color="secondary" align="center">
          {emptyMessage}
        </AppText>
      </Center>
    );
  }

  return (
    <FlashList
      data={properties}
      // estimatedItemSize={280}
      keyExtractor={(item, index) => `${index}-${item.id}`}
      renderItem={({ item }) => (
        <Box mb={4}>
          <PropertyCard property={item} />
        </Box>
      )}
      ListHeaderComponent={
        <HStack justifyContent="space-between" alignItems="center" mb={2}>
          <AppText variant="h3" weight="bold">
            {properties.length} properties found
          </AppText>
        </HStack>
      }
    />
  );
};

export default SearchResults;
