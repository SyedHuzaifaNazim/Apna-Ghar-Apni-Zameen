// @ts-nocheck
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Property } from '../../../api/apiMock';
import AppText from '../../../components/base/AppText';
import { Colors } from '../../../constants/Colors';
import { BorderRadius } from '../../../constants/Layout';

interface PropertyInfoProps {
  property: Property;
}

// --- Custom Component Replacements ---

const CustomDivider = () => <View style={styles.divider} />;

const CustomBadge = ({ children, colorScheme, style }) => {
    const badgeStyle = {
        backgroundColor: colorScheme === 'success' ? Colors.success[500] : (colorScheme === 'warning' ? Colors.warning[500] : Colors.secondary[500]),
        ...style
    };
    return (
        <View style={[styles.badge, badgeStyle]}>
            <AppText variant="small" weight="bold" style={styles.badgeText}>{children}</AppText>
        </View>
    );
};

// --- Main Component ---

const PropertyInfo: React.FC<PropertyInfoProps> = ({ property }) => {
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `Rs ${(price / 10000000).toFixed(2)} Crore`;
    } else if (price >= 100000) {
      return `Rs ${(price / 100000).toFixed(1)} Lakh`;
    }
    return `Rs ${price.toLocaleString()}`;
  };

  const getPropertyAge = (datePosted: string) => {
    const postedDate = new Date(datePosted);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - postedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const keyMetrics = [
    {
      icon: 'bed-outline',
      label: 'Bedrooms',
      value: `${property.bedrooms}`,
    },
    {
      icon: 'water-outline',
      label: 'Bathrooms',
      value: `${property.bathrooms ?? 0}`, 
    },
    {
      icon: 'expand-outline',
      label: 'Area',
      value: `${property.areaSize.toLocaleString()} ${property.areaUnit}`,
    },
    {
      icon: 'build-outline',
      label: 'Condition',
      value: property.propertyCondition,
    },
    {
      icon: 'color-palette-outline',
      label: 'Furnishing',
      value: property.furnishing,
    },
    {
      icon: 'calendar-outline',
      label: 'Year Built',
      value: `${property.yearBuilt ?? 'N/A'}`,
    },
  ];

  const amenityMap = {
    'Swimming Pool': 'water-outline',
    'Gym': 'barbell-outline',
    'Security': 'shield-checkmark-outline',
    'Parking': 'car-outline',
    'Garden': 'leaf-outline',
    'Lift': 'arrow-up-circle-outline',
    'Power Backup': 'flash-outline',
    'Solar Panels': 'sunny-outline',
    'CCTV': 'videocam-outline',
    'Gated Community': 'home-outline',
    'High-Speed Elevators': 'arrow-up-circle-outline',
    'Underground Parking': 'car-sport-outline',
    'Fire Safety System': 'alert-circle-outline',
    'Reception Lobby': 'person-circle-outline',
  };
  
  const allFeatures = [...(property.features || []), ...(property.tags || [])];
  const allAmenities = property.amenities || [];
  
  const details = [
      { label: 'Property Type', value: property.propertyCategory },
      { label: 'Listing Type', value: property.listingType },
      { label: 'Floor Level', value: property.floorLevel !== null ? `${property.floorLevel}` : property.propertyCategory.includes('House') ? 'N/A' : 'Ground/House' },
      { label: 'Electricity Backup', value: property.electricityBackup },
      { label: 'Water Supply', value: property.waterSupply },
      { label: 'Parking Spaces', value: `${property.parkingSpaces ?? 0}` },
  ];
  
  const filteredDetails = details.filter(d => d.value !== 'N/A');

  return (
    <View style={styles.container}>
      {/* Price and Basic Info */}
      <View style={styles.section}>
        <View style={styles.header}>
          <View style={styles.titleInfo}>
            <AppText variant="h1" weight="bold" style={{ color: Colors.primary[600] }}>
              {formatPrice(property.price)}
            </AppText>
            <AppText variant="body" color="secondary">
              {property.listingType} | {property.propertyCategory}
            </AppText>
          </View>
          
          <View style={styles.badges}>
            <CustomBadge 
              colorScheme={property.listingType === 'For Sale' ? 'success' : 'warning'}
              style={{ marginRight: 8 }}
            >
              {property.listingType}
            </CustomBadge>
            {property.isFeatured && (
              <CustomBadge 
                colorScheme="secondary" 
              >
                Featured
              </CustomBadge>
            )}
          </View>
        </View>

        <AppText variant="h3" weight="semibold" style={{ marginTop: 12 }}>
          {property.title}
        </AppText>
      </View>

      <CustomDivider />

      {/* Key Metrics Grid (Bed, Bath, Area, etc.) */}
      <View style={styles.section}>
        <AppText variant="h4" weight="semibold">Key Metrics</AppText>
        <View style={styles.metricsGrid}>
          {keyMetrics.map((metric, index) => (
            <View 
              key={metric.label}
              style={styles.metricItem}
            >
              <View style={styles.metricIconBox}>
                <Ionicons name={metric.icon} size={20} color={Colors.primary[600]} />
              </View>
              <View style={styles.metricTextBox}>
                <AppText variant="body" weight="bold" align="center" style={styles.metricValue}>
                  {metric.value}
                </AppText>
                <AppText variant="small" color="secondary" align="center">
                  {metric.label}
                </AppText>
              </View>
            </View>
          ))}
        </View>
      </View>

      <CustomDivider />

      {/* Description */}
      <View style={styles.section}>
        <AppText variant="h4" weight="semibold">Description</AppText>
        <AppText variant="body" color="secondary" style={styles.descriptionText}>
          {property.description}
        </AppText>
      </View>

      {/* Amenities & Features */}
      {allAmenities.length > 0 && (
        <>
          <CustomDivider />
          <View style={styles.section}>
            <AppText variant="h4" weight="semibold">Amenities & Facilities</AppText>
            <View style={styles.wrapContainer}>
              {allAmenities.map((amenity, index) => (
                <View
                  key={amenity}
                  style={styles.amenityBadge}
                >
                  <Ionicons name={(amenityMap[amenity] || 'checkmark-circle-outline')} size={16} color={Colors.primary[500]} style={{ marginRight: 6 }} />
                  <AppText variant="body" color="primary" weight="medium" style={styles.amenityText}>
                    {amenity}
                  </AppText>
                </View>
              ))}
            </View>
          </View>
        </>
      )}

      {/* Additional Features/Tags */}
      {allFeatures.length > 0 && (
        <>
          <CustomDivider />
          <View style={styles.section}>
            <AppText variant="h4" weight="semibold">Highlights</AppText>
            <View style={styles.wrapContainer}>
              {allFeatures.map((feature, index) => (
                <View
                  key={feature}
                  style={styles.highlightBadge}
                >
                  <AppText variant="body" style={styles.highlightText}>
                    {feature}
                  </AppText>
                </View>
              ))}
            </View>
          </View>
        </>
      )}

      <CustomDivider />

      {/* Additional Details Table */}
      <View style={styles.section}>
        <AppText variant="h4" weight="semibold">Additional Details</AppText>
        <View style={styles.detailsTable}>
            {filteredDetails.map((detail, index) => (
                <View key={index} style={styles.detailsTableRow}>
                    <AppText variant="body" color="secondary">{detail.label}</AppText>
                    <AppText variant="body" weight="medium">{detail.value}</AppText>
                </View>
            ))}
            <View style={styles.detailsTableRow}>
                <AppText variant="body" color="secondary">Posted</AppText>
                <AppText variant="body" weight="medium">
                    {getPropertyAge(property.datePosted)}
                </AppText>
            </View>
        </View>
      </View>
      
      {/* Location */}
      <View style={styles.section}>
        <AppText variant="h4" weight="semibold">Location</AppText>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={20} color={Colors.text.secondary} style={{ marginRight: 12 }} />
          <View style={styles.locationTextContainer}>
            <AppText variant="body" weight="medium">
              {property.address.line1}
            </AppText>
            <AppText variant="body" color="secondary">
              {property.address.city}
            </AppText>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: Colors.shadow.dark,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
    position: 'relative',
    zIndex: 10,
  },
  section: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleInfo: {
    flex: 1,
    marginRight: 16,
  },
  badges: {
    flexDirection: 'row',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginVertical: 16,
  },
  // Metrics Grid
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: Colors.background.secondary,
    padding: 16,
    borderRadius: BorderRadius.lg,
  },
  metricItem: {
    width: '33.3%',
    alignItems: 'center',
    marginBottom: 16,
  },
  metricIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricTextBox: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 14,
  },
  // Description
  descriptionText: {
    lineHeight: 24,
    marginTop: 8,
  },
  // Amenities and Features
  wrapContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  amenityBadge: {
    backgroundColor: Colors.primary[50],
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  amenityText: {
    fontSize: 12,
  },
  highlightBadge: {
    backgroundColor: Colors.secondary[50],
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    marginBottom: 8,
  },
  highlightText: {
    color: Colors.secondary[700],
    fontWeight: '500',
    fontSize: 12,
  },
  // Details Table
  detailsTable: {
    backgroundColor: Colors.background.secondary,
    padding: 16,
    borderRadius: BorderRadius.lg,
  },
  detailsTableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  locationTextContainer: {
    flex: 1,
  },
});

export default PropertyInfo;