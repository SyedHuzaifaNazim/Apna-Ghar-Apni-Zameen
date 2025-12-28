import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Property } from '@/types/property';
import AppText from '../../../components/base/AppText';
import { Colors } from '../../../constants/Colors';
import { BorderRadius } from '../../../constants/Layout';
import { useFavorites } from '../../../context/FavoritesContext';

interface GridViewProps {
  property: Property;
  onPress: (propertyId: number) => void;
  onFavoritePress?: (propertyId: number) => void;
}

const GridView: React.FC<GridViewProps> = ({ 
  property, 
  onPress,
  onFavoritePress 
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  const handlePress = () => {
    onPress(property.id);
  };

  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    toggleFavorite(property.id);
    onFavoritePress?.(property.id);
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `Rs ${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
      return `Rs ${(price / 100000).toFixed(1)}L`;
    }
    return `Rs ${price.toLocaleString()}`;
  };

  return (
    <Pressable 
      onPress={handlePress} 
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed
      ]}
    >
      {/* Property Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: property.images[0] }}
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Badges */}
        <View style={styles.badgesContainer}>
          <View style={[
            styles.badge, 
            { backgroundColor: property.listingType === 'For Sale' ? Colors.success[500] : Colors.warning[500] }
          ]}>
            <AppText variant="small" weight="bold" style={styles.badgeText}>
              {property.listingType === 'For Sale' ? 'Sale' : 'Rent'}
            </AppText>
          </View>
          
          {property.isFeatured && (
            <View style={[styles.badge, { backgroundColor: Colors.secondary[500] }]}>
              <AppText variant="small" weight="bold" style={styles.badgeText}>
                Featured
              </AppText>
            </View>
          )}
        </View>

        {/* Favorite Button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleFavoritePress}
          hitSlop={8}
        >
          <Ionicons 
            name={isFavorite(property.id) ? "heart" : "heart-outline"} 
            size={16} 
            color={isFavorite(property.id) ? Colors.status.featured : Colors.text.primary} 
          />
        </TouchableOpacity>
      </View>

      {/* Property Details */}
      <View style={styles.detailsContainer}>
        {/* Price */}
        <AppText variant="h3" weight="bold" color="primary" numberOfLines={1}>
          {formatPrice(property.price)}
        </AppText>

        {/* Title */}
        <AppText variant="body" weight="semibold" numberOfLines={2} style={styles.title}>
          {property.title}
        </AppText>

        {/* Key Features */}
        <View style={styles.featuresRow}>
          <View style={styles.featureItem}>
            <Ionicons name="bed-outline" size={12} color={Colors.text.secondary} />
            <AppText variant="small" color="secondary">
              {property.bedrooms}
            </AppText>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="expand-outline" size={12} color={Colors.text.secondary} />
            <AppText variant="small" color="secondary">
              {property.areaSize} sq ft
            </AppText>
          </View>
        </View>

        {/* Location */}
        <AppText variant="small" color="secondary" numberOfLines={1}>
          {property.address.city}
        </AppText>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3F4F6', // gray.100
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgesContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    gap: 4,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    padding: 12,
    gap: 8,
  },
  title: {
    minHeight: 40,
  },
  featuresRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});

export default GridView;