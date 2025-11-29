import { Box, Center, VStack } from 'native-base';
import React from 'react';

import { Property } from '../../api/apiMock';
import AppText from '../../components/base/AppText';
import PropertyCard from '../../components/ui/PropertyCard';
import { useFavoriteProperties } from '../../hooks/useFavorites';

interface FavoritesListProps {
  properties: Property[];
}

const FavoritesList: React.FC<FavoritesListProps> = ({ properties }) => {
  const { favoriteProperties } = useFavoriteProperties(properties);

  if (favoriteProperties.length === 0) {
    return (
      <Center py={10}>
        <AppText variant="body" color="secondary" align="center">
          Save a property to view it here. Tap the heart icon on any listing.
        </AppText>
      </Center>
    );
  }

  return (
    <VStack space={4}>
      <AppText variant="h3" weight="bold">
        Favorite Properties
      </AppText>
      {favoriteProperties.map(property => (
        <Box key={property.id}>
          <PropertyCard property={property} />
        </Box>
      ))}
    </VStack>
  );
};

export default FavoritesList;
