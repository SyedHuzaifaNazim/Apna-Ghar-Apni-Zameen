import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { memo } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useFavorites } from '../../context/FavoritesContext';
import { AreaUnit, Property } from '../../types/property';
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

  const formatPrice = (price: number): string => {
    if (price >= 10000000) {
      return `Rs ${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `Rs ${(price / 100000).toFixed(1)} Lac`;
    }
    return `Rs ${price.toLocaleString()}`;
  };

  const formatArea = (size: number, unit: AreaUnit): string => {
      const unitDisplay = unit.charAt(0).toUpperCase() + unit.slice(1);
      return `${size.toLocaleString()} ${unitDisplay}`;
  }

  const bathrooms = property.bathrooms ?? 0;
  const bedrooms = property.bedrooms ?? 0;

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8} style={styles.touchable}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: property.images[0] }}
            style={styles.image}
            resizeMode="cover"
          />
          {/* Badges - Grouped top left, Featured top right */}
          <View style={styles.badgeContainer}>
            <View style={[
              styles.badge,
              { backgroundColor: property.listingType === 'For Sale' ? Colors.status.forSale : Colors.status.forRent }
            ]}>
              <AppText variant="small" style={styles.badgeText}>
                {property.listingType}
              </AppText>
            </View>
          </View>
          
          {property.isFeatured && (
            <View style={styles.featuredBadgeContainer}>
              <View style={[styles.badge, styles.featuredBadge]}>
                <Ionicons name="star" size={14} color="white" style={{ marginRight: 4 }} />
                <AppText variant="small" style={styles.badgeText}>
                  Featured
                </AppText>
              </View>
            </View>
          )}
          
          {/* Favorite Button - REMOVED !onPress condition */}
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={(e) => {
              e.stopPropagation(); // Prevent card press when tapping favorite
              toggleFavorite(property.id);
            }}
          >
            <Ionicons 
              name={isFavorite(property.id) ? "heart" : "heart-outline"} 
              size={22}
              color={isFavorite(property.id) ? Colors.error[500] : Colors.gray[700]}
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          <AppText variant="h4" weight="semibold" numberOfLines={2} style={styles.title}>
            {property.title}
          </AppText>
          
          {/* Price and Area */}
          <View style={styles.priceRow}>
            <AppText variant="h3" weight="bold" style={styles.price}>
              {formatPrice(property.price)}
            </AppText>
            <AppText variant="body" color="secondary" style={styles.areaText}>
              {formatArea(property.areaSize, property.areaUnit)}
            </AppText>
          </View>
          
          {/* Bedrooms and Bathrooms */}
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Ionicons name="bed-outline" size={16} color={Colors.text.secondary} />
              <AppText variant="body" color="secondary" style={styles.detailText}>
                {bedrooms} {bedrooms === 1 ? 'Bed' : 'Beds'}
              </AppText>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="water-outline" size={16} color={Colors.text.secondary} />
              <AppText variant="body" color="secondary" style={styles.detailText}>
                {bathrooms} {bathrooms === 1 ? 'Bath' : 'Baths'}
              </AppText>
            </View>
            {/* Property Category */}
            <View style={styles.detailItem}>
              <Ionicons name="business-outline" size={16} color={Colors.text.secondary} />
              <AppText variant="body" color="secondary" style={styles.detailText} numberOfLines={1}>
                {property.propertyCategory}
              </AppText>
            </View>
          </View>
          
          {/* Location */}
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={16} color={Colors.text.secondary} />
            <AppText variant="body" color="secondary" numberOfLines={1} style={styles.locationText}>
              {property.address.line1}, {property.address.city}
            </AppText>
          </View>
          
          {/* Date Posted */}
          <AppText variant="small" color="disabled" style={styles.dateText}>
            Posted {new Date(property.datePosted).toLocaleDateString()}
          </AppText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: Colors.shadow.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 220,
  },
  badgeContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
  },
  featuredBadgeContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredBadge: {
    backgroundColor: Colors.status.featured,
  },
  badgeText: {
    color: 'white',
    fontWeight: '700',
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 10, // Moved to bottom-right of image for better visibility
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  content: {
    padding: 16,
  },
  title: {
    marginBottom: 4,
    fontSize: 18,
    color: Colors.text.primary,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 8,
    marginBottom: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    paddingTop: 10,
  },
  price: {
    color: Colors.primary[500],
    fontSize: 24,
  },
  areaText: {
    fontSize: 14,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 4,
    fontSize: 14,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    marginLeft: 6,
    flex: 1,
    fontSize: 14,
  },
  dateText: {
    fontSize: 11,
    color: Colors.gray[400],
  },
});

export default memo(PropertyCard);