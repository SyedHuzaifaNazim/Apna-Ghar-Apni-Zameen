import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import AppText from '@/components/base/AppText';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/Layout';
import { formatArea, formatPriceWithPeriod } from '@/lib/format';
import type { Property } from '@/types/property';

interface PropertyInfoProps {
  property: Property;
}

const CustomDivider = () => <View style={styles.divider} />;

interface CustomBadgeProps {
  children: React.ReactNode;
  color: string;
  style?: ViewStyle;
}

// Takes an explicit color (rather than a fixed enum) so the badge can match
// PropertyCard's status colors exactly — this used to have its own
// success/warning scheme, so a "For Rent" property showed green on its card
// but yellow on its own detail page.
const CustomBadge = ({ children, color, style }: CustomBadgeProps) => (
  <View style={[styles.badge, { backgroundColor: color }, style]}>
    <AppText variant="bodySmall" weight="bold" style={styles.badgeText}>
      {children}
    </AppText>
  </View>
);

const PropertyInfo: React.FC<PropertyInfoProps> = ({ property }) => {
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

  const isRental = property.listingType === 'For Rent' || property.listingType === 'Short Term Rent';

  const keyMetrics = [
    { icon: 'bed-outline' as const, label: 'Bedrooms', value: `${property.bedrooms}` },
    { icon: 'water-outline' as const, label: 'Bathrooms', value: `${property.bathrooms ?? 0}` },
    { icon: 'expand-outline' as const, label: 'Area', value: formatArea(property.areaSize, property.areaUnit) },
    { icon: 'build-outline' as const, label: 'Condition', value: property.propertyCondition },
    { icon: 'color-palette-outline' as const, label: 'Furnishing', value: property.furnishing },
    { icon: 'calendar-outline' as const, label: 'Year Built', value: `${property.yearBuilt ?? 'N/A'}` },
  ];

  const amenityMap: Record<string, keyof typeof Ionicons.glyphMap> = {
    'Swimming Pool': 'water-outline',
    Gym: 'barbell-outline',
    Security: 'shield-checkmark-outline',
    Parking: 'car-outline',
    Garden: 'leaf-outline',
    Lift: 'arrow-up-circle-outline',
    'Power Backup': 'flash-outline',
    'Solar Panels': 'sunny-outline',
    CCTV: 'videocam-outline',
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
    {
      label: 'Floor Level',
      value:
        property.floorLevel !== null && property.floorLevel !== undefined
          ? `${property.floorLevel}`
          : property.propertyCategory.includes('House')
            ? 'N/A'
            : 'Ground/House',
    },
    { label: 'Electricity Backup', value: property.electricityBackup },
    { label: 'Water Supply', value: property.waterSupply },
    { label: 'Parking Spaces', value: `${property.parkingSpaces ?? 0}` },
  ];

  const filteredDetails = details.filter(d => d.value !== 'N/A' && d.value !== undefined);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.header}>
          <View style={styles.titleInfo}>
            <AppText variant="h1" weight="bold" color={Colors.primary[600]}>
              {formatPriceWithPeriod(property.price, property.listingType)}
            </AppText>
            <AppText variant="body" color="secondary">
              {property.listingType} | {property.propertyCategory}
            </AppText>
          </View>

          <View style={styles.badges}>
            <CustomBadge color={isRental ? Colors.status.forRent : Colors.status.forSale} style={styles.badgeSpacing}>
              {property.listingType}
            </CustomBadge>
            {property.isFeatured && <CustomBadge color={Colors.status.featured}>Featured</CustomBadge>}
          </View>
        </View>

        <AppText variant="h3" weight="semibold" style={styles.titleText}>
          {property.title}
        </AppText>
      </View>

      <CustomDivider />

      <View style={styles.section}>
        <AppText variant="h4" weight="semibold">
          Key Metrics
        </AppText>
        <View style={styles.metricsGrid}>
          {keyMetrics.map(metric => (
            <View key={metric.label} style={styles.metricItem}>
              <View style={styles.metricIconBox}>
                <Ionicons name={metric.icon} size={20} color={Colors.primary[600]} />
              </View>
              <View style={styles.metricTextBox}>
                <AppText variant="body" weight="bold" align="center" style={styles.metricValue}>
                  {metric.value}
                </AppText>
                <AppText variant="bodySmall" color="secondary" align="center">
                  {metric.label}
                </AppText>
              </View>
            </View>
          ))}
        </View>
      </View>

      <CustomDivider />

      <View style={styles.section}>
        <AppText variant="h4" weight="semibold">
          Description
        </AppText>
        <AppText variant="body" color="secondary" style={styles.descriptionText}>
          {property.description}
        </AppText>
      </View>

      {allAmenities.length > 0 && (
        <>
          <CustomDivider />
          <View style={styles.section}>
            <AppText variant="h4" weight="semibold">
              Amenities & Facilities
            </AppText>
            <View style={styles.wrapContainer}>
              {allAmenities.map(amenity => (
                <View key={amenity} style={styles.amenityBadge}>
                  <Ionicons
                    name={amenityMap[amenity] || 'checkmark-circle-outline'}
                    size={16}
                    color={Colors.primary[500]}
                    style={styles.amenityIcon}
                  />
                  <AppText variant="body" color="primary" weight="medium" style={styles.amenityText}>
                    {amenity}
                  </AppText>
                </View>
              ))}
            </View>
          </View>
        </>
      )}

      {allFeatures.length > 0 && (
        <>
          <CustomDivider />
          <View style={styles.section}>
            <AppText variant="h4" weight="semibold">
              Highlights
            </AppText>
            <View style={styles.wrapContainer}>
              {allFeatures.map(feature => (
                <View key={feature} style={styles.highlightBadge}>
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

      <View style={styles.section}>
        <AppText variant="h4" weight="semibold">
          Additional Details
        </AppText>
        <View style={styles.detailsTable}>
          {filteredDetails.map((detail, index) => (
            <View key={index} style={styles.detailsTableRow}>
              <AppText variant="body" color="secondary">
                {detail.label}
              </AppText>
              <AppText variant="body" weight="medium">
                {String(detail.value)}
              </AppText>
            </View>
          ))}
          <View style={styles.detailsTableRow}>
            <AppText variant="body" color="secondary">
              Posted
            </AppText>
            <AppText variant="body" weight="medium">
              {getPropertyAge(property.datePosted)}
            </AppText>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <AppText variant="h4" weight="semibold">
          Location
        </AppText>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={20} color={Colors.text.secondary} style={styles.locationIcon} />
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
    backgroundColor: Colors.background.card,
    padding: Spacing.lg,
    marginTop: -Spacing.lg,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    shadowColor: Colors.shadow.dark,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
    position: 'relative',
    zIndex: 10,
  },
  section: { marginBottom: Spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  titleInfo: { flex: 1, marginRight: Spacing.md },
  titleText: { marginTop: Spacing.sm + 4 },
  badges: { flexDirection: 'row' },
  badgeSpacing: { marginRight: Spacing.sm },
  badge: {
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xxs,
    borderRadius: BorderRadius.round,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeText: { color: Colors.text.inverse },
  divider: { height: 1, backgroundColor: Colors.border.light, marginVertical: Spacing.md },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: Colors.background.secondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  metricItem: { width: '33.3%', alignItems: 'center', marginBottom: Spacing.md },
  metricIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  metricTextBox: { alignItems: 'center' },
  metricValue: { fontSize: 14 },
  descriptionText: { lineHeight: 24, marginTop: Spacing.sm },
  wrapContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: Spacing.sm, gap: Spacing.sm },
  amenityBadge: {
    backgroundColor: Colors.primary[50],
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  amenityIcon: { marginRight: Spacing.xs + 2 },
  amenityText: { fontSize: 12 },
  highlightBadge: {
    backgroundColor: Colors.secondary[50],
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    marginBottom: Spacing.sm,
  },
  highlightText: { color: Colors.secondary[700], fontWeight: '500', fontSize: 12 },
  detailsTable: { backgroundColor: Colors.background.secondary, padding: Spacing.md, borderRadius: BorderRadius.lg },
  detailsTableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  locationRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: Spacing.sm },
  locationIcon: { marginRight: Spacing.md },
  locationTextContainer: { flex: 1 },
});

export default PropertyInfo;
