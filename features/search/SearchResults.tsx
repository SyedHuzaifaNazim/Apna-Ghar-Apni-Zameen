import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Property } from '../../api/apiMock';
import AppText from '../../components/base/AppText';
import PropertyCard from '../../components/ui/PropertyCard';
import { Colors } from '../../constants/Colors';

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
      <View style={styles.centerContainer}>
        <ActivityIndicator color={Colors.primary[500]} size="large" />
        <AppText variant="body" color="secondary" style={styles.loadingText}>
          Searching properties…
        </AppText>
      </View>
    );
  }

  if (properties.length === 0) {
    return (
      <View style={[styles.centerContainer, styles.emptyContainer]}>
        <AppText variant="body" color="secondary" align="center">
          {emptyMessage}
        </AppText>
      </View>
    );
  }

  return (
    <FlashList
      data={properties}
      // estimatedItemSize removed for FlashList v2 compatibility
      keyExtractor={(item, index) => `${index}-${item.id}`}
      renderItem={({ item }) => (
        <View style={styles.itemContainer}>
          <PropertyCard property={item} />
        </View>
      )}
      ListHeaderComponent={
        <View style={styles.header}>
          <AppText variant="h3" weight="bold">
            {properties.length} properties found
          </AppText>
        </View>
      }
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyContainer: {
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
  },
  itemContainer: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4, // Add slight padding to align with cards if needed
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default SearchResults;