import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Colors } from '../../constants/Colors';
import AppText from '../base/AppText';

interface MapMarkerProps {
  property: {
    id: number;
    title: string;
    price: number;
    listingType: 'For Sale' | 'For Rent';
    isFeatured?: boolean;
  };
  isSelected?: boolean;
  onPress?: () => void;
}

const formatPricePKR = (price: number) => {
  if (price >= 10000000) {
    return `Rs ${(price / 10000000).toFixed(1)} Cr`;
  }
  if (price >= 100000) {
    return `Rs ${(price / 100000).toFixed(1)} L`;
  }
  return `Rs ${price.toLocaleString()}`;
};

const MapMarker: React.FC<MapMarkerProps> = ({
  property,
  isSelected = false,
  onPress
}) => {
  const getMarkerColor = () => {
    if (property.listingType === 'For Sale') return Colors.success?.[500] || 'green';
    if (property.listingType === 'For Rent') return Colors.warning?.[500] || 'orange';
    return Colors.primary[500];
  };

  const markerColor = getMarkerColor();

  if (isSelected) {
    return (
      <Pressable onPress={onPress} style={styles.selectedContainer}>
        <View style={[styles.selectedCard, { borderColor: markerColor }]}>
          <View style={styles.contentStack}>
            <AppText variant="body" weight="semibold" numberOfLines={2}>
              {property.title}
            </AppText>
            
            <AppText variant="h3" style={{ color: Colors.primary[500] }}>
              {formatPricePKR(property.price)}
            </AppText>
            
            <View style={styles.badgeRow}>
              <View 
                style={[
                  styles.badge, 
                  { backgroundColor: property.listingType === 'For Sale' ? Colors.success?.[500] || 'green' : Colors.warning?.[500] || 'orange' }
                ]}
              >
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
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={styles.markerWrapper}>
      <View style={[styles.markerCircle, { backgroundColor: markerColor }]}>
        <Ionicons name="home" size={16} color="white" />
        
        {property.isFeatured && (
          <View style={styles.starBadge}>
            <Ionicons name="star" size={8} color="white" />
          </View>
        )}
      </View>
      
      {/* Price Badge Below Marker */}
      <View style={styles.priceBadge}>
        <AppText variant="small" weight="semibold" align="center" style={styles.priceText}>
          {formatPricePKR(property.price)}
        </AppText>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  selectedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    minWidth: 200,
    borderWidth: 2,
    // Shadows
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  contentStack: {
    gap: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
  },
  // Default Marker Styles
  markerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60, // Ensure touch target
    height: 60,
  },
  markerCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
    // Shadows
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 2,
  },
  starBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.secondary[500],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
  },
  priceBadge: {
    position: 'absolute',
    bottom: 0, // Position below the circle
    backgroundColor: 'white',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    minWidth: 50,
    alignItems: 'center',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
    zIndex: 3,
  },
  priceText: {
    fontSize: 10,
  },
});

export default MapMarker;