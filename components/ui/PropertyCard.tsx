import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Property } from '../../api/apiMock';
import { Colors } from '../../constants/Colors';
import { useFavorites } from '../../context/FavoritesContext';
import AppText from '../base/AppText';

interface PropertyCardProps {
  property: Property;
  onPress?: (property: Property) => void;
  variant?: 'default' | 'featured';
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onPress, variant = 'default' }) => {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();

  const handlePress = () => {
    if (onPress) {
      onPress(property);
      return;
    }

    router.push({
      pathname: '/listing/[id]',
      params: { id: property.id.toString() },
    });
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 100000) {
      return `${(price / 100000).toFixed(1)}L`;
    }
    return price.toLocaleString();
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: property.images[0] }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.badgeContainer}>
            <View style={[
              styles.badge,
              { backgroundColor: property.listingType === 'For Sale' ? '#10b981' : '#f59e0b' }
            ]}>
              <AppText variant="small" style={styles.badgeText}>
                {property.listingType}
              </AppText>
            </View>
          </View>
          {property.isFeatured && (
            <View style={[styles.badgeContainer, styles.featuredBadgeContainer]}>
              <View style={[styles.badge, styles.featuredBadge]}>
                <AppText variant="small" style={styles.badgeText}>
                  Featured
                </AppText>
              </View>
            </View>
          )}
          {!onPress && (
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => toggleFavorite(property.id)}
            >
              <Ionicons 
                name={isFavorite(property.id) ? "heart" : "heart-outline"} 
                size={20} 
                color={isFavorite(property.id) ? Colors.status.featured : Colors.text.primary} 
              />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.content}>
          <AppText variant="h4" fontWeight="bold" numberOfLines={2} style={styles.title}>
            {property.title}
          </AppText>
          
          <View style={styles.priceRow}>
            <AppText variant="h3" fontWeight="bold" style={styles.price}>
              {formatPrice(property.price)} {property.currency}
            </AppText>
            <AppText variant="body" color="secondary">
              {property.areaSize} sq ft
            </AppText>
          </View>
          
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Ionicons name="bed-outline" size={16} color={Colors.text.secondary} />
              <AppText variant="body" color="secondary" style={styles.detailText}>
                {property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}
              </AppText>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="business-outline" size={16} color={Colors.text.secondary} />
              <AppText variant="body" color="secondary" style={styles.detailText}>
                {property.propertyCategory}
              </AppText>
            </View>
          </View>
          
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color={Colors.text.secondary} />
            <AppText variant="body" color="secondary" numberOfLines={1} style={styles.locationText}>
              {property.address.line1}, {property.address.city}
            </AppText>
          </View>
          
          <AppText variant="small" color="disabled" style={styles.dateText}>
            Posted {new Date(property.datePosted).toLocaleDateString()}
          </AppText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  featuredBadgeContainer: {
    left: undefined,
    right: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  featuredBadge: {
    backgroundColor: '#8b5cf6',
  },
  badgeText: {
    color: 'white',
    fontWeight: '600',
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'white',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  title: {
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    color: Colors.primary[500],
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    marginLeft: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    marginLeft: 4,
    flex: 1,
  },
  dateText: {
    fontSize: 12,
  },
});

export default PropertyCard;