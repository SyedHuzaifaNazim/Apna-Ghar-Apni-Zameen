import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Property } from '../../../api/apiMock';
import AppText from '../../../components/base/AppText';
import { Colors } from '../../../constants/Colors';
import { BorderRadius } from '../../../constants/Layout';
import { useFavorites } from '../../../context/FavoritesContext';

interface DetailedViewProps {
  property: Property;
  onPress: (propertyId: number) => void;
  onSharePress?: (property: Property) => void;
  onContactPress?: (property: Property) => void;
}

const DetailedView: React.FC<DetailedViewProps> = ({ 
  property, 
  onPress,
  onSharePress,
  onContactPress
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  const handlePress = () => {
    onPress(property.id);
  };

  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    toggleFavorite(property.id);
  };

  const handleSharePress = (e: any) => {
    e.stopPropagation();
    onSharePress?.(property);
  };

  const handleContactPress = (e: any) => {
    e.stopPropagation();
    onContactPress?.(property);
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `Rs ${(price / 10000000).toFixed(1)} Crore`;
    } else if (price >= 100000) {
      return `Rs ${(price / 100000).toFixed(1)} Lac`;
    }
    return `Rs ${price.toLocaleString()}`;
  };

  const getPropertyAge = (datePosted: string) => {
    const postedDate = new Date(datePosted);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - postedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
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
              {property.listingType}
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

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleSharePress}
          >
            <Ionicons name="share-outline" size={16} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleFavoritePress}
          >
            <Ionicons 
              name={isFavorite(property.id) ? "heart" : "heart-outline"} 
              size={16} 
              color={isFavorite(property.id) ? Colors.status.featured : "white"} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Property Details */}
      <View style={styles.detailsContainer}>
        {/* Title and Price */}
        <View style={styles.headerInfo}>
          <AppText variant="h4" weight="semibold" numberOfLines={2}>
            {property.title}
          </AppText>
          <AppText variant="h2" weight="bold" color="primary">
            {formatPrice(property.price)}
          </AppText>
        </View>

        {/* Key Features */}
        <View style={styles.featuresRow}>
          <View style={styles.featureGroup}>
            <View style={styles.featureItem}>
              <Ionicons name="bed-outline" size={16} color={Colors.text.secondary} />
              <AppText variant="body" color="secondary">
                {property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}
              </AppText>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="expand-outline" size={16} color={Colors.text.secondary} />
              <AppText variant="body" color="secondary">
                {property.areaSize} sq ft
              </AppText>
            </View>
          </View>
          
          <AppText variant="body" color="secondary">
            {property.propertyCategory}
          </AppText>
        </View>

        {/* Location */}
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={Colors.text.secondary} style={{ marginTop: 2 }} />
          <AppText variant="body" color="secondary" numberOfLines={2} style={styles.locationText}>
            {property.address.line1}, {property.address.city}
          </AppText>
        </View>

        {/* Additional Info and Actions */}
        <View style={styles.footerRow}>
          <AppText variant="small" color="disabled">
            {getPropertyAge(property.datePosted)}
          </AppText>
          
          <TouchableOpacity 
            onPress={handleContactPress}
            hitSlop={8}
            style={styles.contactButton}
          >
            <AppText variant="body" color="primary" weight="medium">
              Contact
            </AppText>
            <Ionicons name="arrow-forward" size={14} color={Colors.primary[500]} />
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: BorderRadius.xl,
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
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgesContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.md,
  },
  badgeText: {
    color: 'white',
  },
  actionsContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    gap: 4,
  },
  iconButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    padding: 16,
    gap: 12,
  },
  headerInfo: {
    gap: 4,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featureGroup: {
    flexDirection: 'row',
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  locationText: {
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});

export default DetailedView;