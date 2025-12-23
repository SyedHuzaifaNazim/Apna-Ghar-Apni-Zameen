import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Property } from '@/api/apiMock';
import { Colors } from '@/constants/Colors';
import AppText from '../base/AppText';

interface MapMarkerProps {
  property: Property;
  isSelected?: boolean;
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
}) => {
  const getMarkerColor = () => {
    switch (property.listingType) {
      case 'For Sale':
        return Colors.success?.[500] || '#10B981';
      case 'For Rent':
      case 'Short Term Rent':
        return Colors.warning?.[500] || '#F59E0B';
      case 'Auction':
        return Colors.error?.[500] || '#EF4444';
      default:
        return Colors.primary[500];
    }
  };

  const markerColor = getMarkerColor();

  if (isSelected) {
    return (
      <View style={styles.selectedContainer}>
        <View style={[styles.selectedCard, { borderColor: markerColor }]}>
          <View style={styles.contentStack}>
            <AppText variant="body" weight="semibold" numberOfLines={1}>
              {property.title}
            </AppText>
            
            <AppText variant="h4" weight="bold" style={{ color: Colors.primary[500] }}>
              {formatPricePKR(property.price)}
            </AppText>
            
            <View style={styles.badgeRow}>
              <View 
                style={[
                  styles.badge, 
                  { backgroundColor: markerColor }
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
        {/* Triangle Arrow */}
        <View style={[styles.arrow, { borderTopColor: markerColor }]} />
      </View>
    );
  }

  return (
    <View style={styles.markerWrapper}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  selectedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  selectedCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    minWidth: 180,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  arrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 0,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    transform: [{ translateY: -2 }],
  },
  contentStack: {
    gap: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
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
    width: 60,
    height: 60,
  },
  markerCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 2,
  },
  starBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.secondary[500],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
  },
  priceBadge: {
    position: 'absolute',
    bottom: 2,
    backgroundColor: 'white',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    minWidth: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
    zIndex: 3,
    borderWidth: 0.5,
    borderColor: '#eee',
  },
  priceText: {
    fontSize: 9,
    color: Colors.text.primary,
  },
});

export default MapMarker;