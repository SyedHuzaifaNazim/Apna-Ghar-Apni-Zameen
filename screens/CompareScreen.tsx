import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppButton from '@/components/base/AppButton';
import AppText from '@/components/base/AppText';
import LoadingSpinner from '@/components/base/LoadingSpinner';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Shadows, Spacing } from '@/constants/Layout';
import { useCompare } from '@/context/CompareContext';
import { useFetchPropertiesByIds } from '@/hooks/useFetchProperties';
import { formatArea, formatBedBath, formatPriceWithPeriod } from '@/lib/format';
import type { Property } from '@/types/property';

const COLUMN_WIDTH = 160;
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800';

interface Row {
  label: string;
  value: (property: Property) => string;
}

const ROWS: Row[] = [
  { label: 'Price', value: p => formatPriceWithPeriod(p.price, p.listingType) },
  { label: 'Type', value: p => p.listingType },
  { label: 'Category', value: p => p.propertyCategory },
  { label: 'Beds / Baths', value: p => formatBedBath(p.bedrooms, p.bathrooms) || '—' },
  { label: 'Area', value: p => formatArea(p.areaSize, p.areaUnit) },
  { label: 'Furnishing', value: p => p.furnishing },
  { label: 'Condition', value: p => p.propertyCondition },
  { label: 'Year Built', value: p => String(p.yearBuilt) },
  { label: 'Parking', value: p => (p.parkingSpaces > 0 ? `${p.parkingSpaces} spaces` : 'None') },
  { label: 'Electricity Backup', value: p => p.electricityBackup },
  { label: 'Water Supply', value: p => p.waterSupply },
  { label: 'Location', value: p => `${p.address.area}, ${p.address.city}` },
];

const CompareScreen: React.FC = () => {
  const router = useRouter();
  const { compareIds, removeFromCompare, clearCompare } = useCompare();
  const { properties, loading } = useFetchPropertiesByIds(compareIds);

  // Preserve selection order (the fetch-by-ids hook may not).
  const ordered = compareIds
    .map(id => properties.find(p => p.id === id))
    .filter((p): p is Property => !!p);

  const handleViewListing = (id: number) => {
    router.push({ pathname: '/listing/[id]', params: { id: String(id) } });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        {router.canGoBack() && (
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityRole="button">
            <Ionicons name="arrow-back" size={22} color={Colors.primary[600]} />
          </TouchableOpacity>
        )}
        <AppText variant="h3" weight="bold" style={styles.flex}>
          Compare Properties
        </AppText>
        {ordered.length > 0 && (
          <TouchableOpacity onPress={clearCompare} accessibilityRole="button" accessibilityLabel="Clear comparison">
            <AppText variant="bodySmall" weight="semibold" color="error">
              Clear
            </AppText>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <LoadingSpinner text="Loading properties…" />
      ) : ordered.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="git-compare-outline" size={56} color={Colors.gray[300]} />
          <AppText variant="h4" weight="semibold" align="center" style={styles.emptyTitle}>
            Nothing to compare yet
          </AppText>
          <AppText variant="bodySmall" color="muted" align="center" style={styles.emptySubtitle}>
            Go back to a listings screen, turn on Compare, and pick 2–3 properties.
          </AppText>
          <AppButton onPress={() => router.push('/search' as Href)} style={styles.emptyButton}>
            Start Searching
          </AppButton>
        </View>
      ) : (
        <View style={styles.tableRow}>
          {/* Fixed label rail — stays put while columns scroll horizontally. */}
          <View style={styles.labelRail}>
            <View style={styles.labelHeaderSpacer} />
            {ROWS.map(row => (
              <View key={row.label} style={styles.labelCell}>
                <AppText variant="caption" weight="bold" color="muted">
                  {row.label}
                </AppText>
              </View>
            ))}
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tableContent}>
            <View style={styles.columnsRow}>
              {ordered.map(property => (
                <View key={property.id} style={styles.column}>
                  <View style={styles.imageWrap}>
                    <Image
                      source={{ uri: property.images?.[0] || FALLBACK_IMAGE }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeFromCompare(property.id)}
                      accessibilityRole="button"
                      accessibilityLabel={`Remove ${property.title} from comparison`}
                    >
                      <Ionicons name="close" size={16} color={Colors.text.inverse} />
                    </TouchableOpacity>
                  </View>
                  <AppText variant="bodySmall" weight="bold" numberOfLines={2} style={styles.columnTitle}>
                    {property.title}
                  </AppText>
                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => handleViewListing(property.id)}
                    accessibilityRole="button"
                  >
                    <AppText variant="caption" weight="semibold" color="brand">
                      View Listing
                    </AppText>
                  </TouchableOpacity>

                  {ROWS.map(row => (
                    <View key={row.label} style={styles.valueCell}>
                      <AppText variant="bodySmall" weight="medium" numberOfLines={2}>
                        {row.value(property)}
                      </AppText>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.secondary },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    backgroundColor: Colors.background.card,
  },
  backButton: { padding: Spacing.xs },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.lg, gap: Spacing.sm },
  emptyTitle: { marginTop: Spacing.md },
  emptySubtitle: { marginBottom: Spacing.md },
  emptyButton: { minWidth: 200 },

  tableContent: { padding: Spacing.md },
  headerRow: { flexDirection: 'row', gap: Spacing.sm },
  column: { width: COLUMN_WIDTH },
  imageWrap: { position: 'relative', width: COLUMN_WIDTH, height: 100, borderRadius: BorderRadius.md, overflow: 'hidden', backgroundColor: Colors.gray[100] },
  image: { width: '100%', height: '100%' },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnTitle: { marginTop: Spacing.xs, minHeight: 36 },
  viewButton: {
    marginTop: Spacing.xs,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
  },

  rowLabel: { marginBottom: 2, letterSpacing: 0.3 },

  tableRow: { flex: 1, flexDirection: 'row' },
  labelRail: { width: 110, paddingLeft: Spacing.md, paddingTop: Spacing.md },
  labelHeaderSpacer: { height: 100 + Spacing.xs + 36 + Spacing.xs + 26 + Spacing.md },
  labelCell: {
    height: 52,
    marginTop: Spacing.sm,
    justifyContent: 'center',
    backgroundColor: Colors.background.card,
    borderTopLeftRadius: BorderRadius.md,
    borderBottomLeftRadius: BorderRadius.md,
    paddingLeft: Spacing.sm,
    ...Shadows.sm,
  },
  columnsRow: { flexDirection: 'row', gap: Spacing.sm },
  valueCell: {
    height: 52,
    marginTop: Spacing.sm,
    justifyContent: 'center',
    backgroundColor: Colors.background.card,
    borderTopRightRadius: BorderRadius.md,
    borderBottomRightRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    ...Shadows.sm,
  },
});

export default CompareScreen;
