import { Box, Center, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';

import { Property } from '../../api/apiMock';
import AppText from '../../components/base/AppText';
import PropertyCard from '../../components/ui/PropertyCard';
import { storageService, STORAGE_KEYS } from '../../services/storageService';

interface ViewedPropertiesProps {
  properties: Property[];
}

const ViewedProperties: React.FC<ViewedPropertiesProps> = ({ properties }) => {
  const [viewedIds, setViewedIds] = useState<number[]>([]);

  useEffect(() => {
    storageService
      .getItem<number[]>(STORAGE_KEYS.VIEWED_PROPERTIES)
      .then(ids => setViewedIds(ids || []));
  }, []);

  const viewedProperties = properties.filter(property => viewedIds.includes(property.id));

  if (viewedProperties.length === 0) {
    return (
      <Center py={8}>
        <AppText variant="body" color="secondary" align="center">
          You haven’t viewed any properties yet. Browse listings to start your history.
        </AppText>
      </Center>
    );
  }

  return (
    <VStack space={4}>
      <Box>
        <AppText variant="h3" weight="bold">
          Recently Viewed
        </AppText>
        <AppText variant="small" color="secondary">
          Based on your last {viewedProperties.length} visits
        </AppText>
      </Box>
      {viewedProperties.map(property => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </VStack>
  );
};

export default ViewedProperties;
