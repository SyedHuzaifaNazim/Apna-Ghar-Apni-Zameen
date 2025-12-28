import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Property } from '@/types/property';
import AppText from '../../../components/base/AppText';
import { Colors } from '../../../constants/Colors';
import { BorderRadius } from '../../../constants/Layout';
import { useFavorites } from '../../../context/FavoritesContext';

interface CompactViewProps {
  property: Property;
  onPress: (propertyId: number) => void;
  onFavoritePress?: (propertyId: number) => void;
}

const CompactView: React.FC<CompactViewProps> = ({ 
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
    <Pressable onPress={handlePress} style={({ pressed }) => [
      styles.container,
      pressed && styles.pressed
    ]}>
      <View style={styles.content}>
        {/* Property Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: property.images[0] }}
            style={styles.image}
            resizeMode="cover"
          />
          
          {/* Listing Type Badge */}
          <View style={[
            styles.badge, 
            { backgroundColor: property.listingType === 'For Sale' ? Colors.success[500] : Colors.warning[500] }
          ]}>
            <AppText variant="small" weight="bold" style={styles.badgeText}>
              {property.listingType === 'For Sale' ? 'Sale' : 'Rent'}
            </AppText>
          </View>
        </View>

        {/* Property Info */}
        <View style={styles.infoContainer}>
          <AppText variant="body" weight="semibold" numberOfLines={1}>
            {property.title}
          </AppText>
          
          <AppText variant="h3" weight="bold" color="primary">
            {formatPrice(property.price)}
          </AppText>
          
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
          
          <AppText variant="small" color="secondary" numberOfLines={1}>
            {property.address.line1}
          </AppText>
        </View>

        {/* Favorite Button */}
        <TouchableOpacity onPress={handleFavoritePress} hitSlop={8}>
          <Ionicons 
            name={isFavorite(property.id) ? "heart" : "heart-outline"} 
            size={16} 
            color={isFavorite(property.id) ? Colors.status.featured : Colors.text.primary} 
          />
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
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
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  imageContainer: {
    position: 'relative',
    width: 64,
    height: 64,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: BorderRadius.md,
  },
  badge: {
    position: 'absolute',
    top: 4,
    left: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
  },
  infoContainer: {
    flex: 1,
    gap: 4,
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

export default CompactView;