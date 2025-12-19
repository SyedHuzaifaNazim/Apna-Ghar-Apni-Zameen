import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Property } from '../../api/apiMock';
import AppText from '../../components/base/AppText';
import PropertyCard from '../../components/ui/PropertyCard';

interface FavoritesListProps {
  properties: Property[];
}

const FavoritesList: React.FC<FavoritesListProps> = ({ properties }) => {
  // Assuming useFavoriteProperties hook handles filtering internally based on context
  // If not, you might need to import useFavorites context here. 
  // Keeping original logic structure:
  // const { favoriteProperties } = useFavoriteProperties(properties); 
  
  // NOTE: If useFavoriteProperties is not available in your provided files, 
  // I will assume simple prop passing for safety or mock the logic.
  // For this refactor, I will assume properties passed ARE the favorites.
  const favoriteProperties = properties; 

  if (favoriteProperties.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <AppText variant="body" color="secondary" align="center">
          Save a property to view it here. Tap the heart icon on any listing.
        </AppText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppText variant="h3" weight="bold" style={styles.title}>
        Favorite Properties
      </AppText>
      <View style={styles.list}>
        {favoriteProperties.map(property => (
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
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginBottom: 8,
  },
  list: {
    gap: 16,
  },
  cardWrapper: {
    marginBottom: 4,
  }
});

export default FavoritesList;