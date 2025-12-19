import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Property } from '../../api/apiMock';
import AppText from '../../components/base/AppText';
import PropertyCard from '../../components/ui/PropertyCard';
import { STORAGE_KEYS, storageService } from '../../services/storageService';

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
      <View style={styles.emptyContainer}>
        <AppText variant="body" color="secondary" align="center">
          You haven’t viewed any properties yet. Browse listings to start your history.
        </AppText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText variant="h3" weight="bold">
          Recently Viewed
        </AppText>
        <AppText variant="small" color="secondary">
          Based on your last {viewedProperties.length} visits
        </AppText>
      </View>
      
      <View style={styles.list}>
        {viewedProperties.map(property => (
          <View key={property.id} style={styles.cardWrapper}>
             <PropertyCard property={property} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  header: {
    marginBottom: 4,
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    gap: 16,
  },
  cardWrapper: {
    marginBottom: 4,
  }
});

export default ViewedProperties;