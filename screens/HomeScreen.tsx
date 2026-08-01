import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppButton from '@/components/base/AppButton';
import AppText from '@/components/base/AppText';
import LoadingSpinner from '@/components/base/LoadingSpinner';
import OfflineBanner from '@/components/base/OfflineBanner';
import FilterModal from '@/components/ui/FilterModal';
import PropertyCard from '@/components/ui/PropertyCard';
import QuickFilterBar from '@/components/ui/QuickFilterBar';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Shadows, Spacing } from '@/constants/Layout';
import { useFavorites } from '@/context/FavoritesContext';
import { useFetchProperties } from '@/hooks/useFetchProperties';
import { useFilterProperties } from '@/hooks/useFilterProperties';
import type { Property } from '@/types/property';
import { useDrawer } from '../app/_layout';

const HERO_IMAGE = require('@/assets/images/background1.png');
const LOGO = require('@/assets/images/transparent-logo1.png');

const StatTile: React.FC<{ label: string; value: number; icon: keyof typeof Ionicons.glyphMap }> = ({
  label,
  value,
  icon,
}) => (
  <View style={styles.statTile}>
    <Ionicons name={icon} size={18} color={Colors.primary[500]} />
    <AppText variant="h4" weight="bold">
      {value}
    </AppText>
    <AppText variant="caption" color="muted">
      {label}
    </AppText>
  </View>
);

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { openDrawer } = useDrawer();

  const { properties, loading, loadingMore, error, refetch, loadMore, hasMore } = useFetchProperties();
  const { favorites } = useFavorites();

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { filteredProperties, activeFilters, filterCount, updateFilters } = useFilterProperties(properties);

  const isFiltering = filterCount > 0;
  const listData: Property[] = isFiltering ? filteredProperties : properties;

  const featured = useMemo(() => properties.filter(p => p.isFeatured).slice(0, 6), [properties]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const openProperty = useCallback(
    (id: number) => router.push({ pathname: '/listing/[id]', params: { id: String(id) } }),
    [router]
  );

  // Error state — only when there is nothing at all to show.
  if (error && properties.length === 0 && !loading) {
    return (
      <View style={[styles.flex, styles.centered, { paddingTop: insets.top }]}>
        <Ionicons name="cloud-offline-outline" size={64} color={Colors.gray[300]} />
        <AppText variant="h4" weight="semibold" align="center" style={styles.errorTitle}>
          Couldn&apos;t load properties
        </AppText>
        <AppText variant="bodySmall" color="muted" align="center" style={styles.errorBody}>
          {error}
        </AppText>
        <AppButton onPress={refetch} leftIcon={<Ionicons name="reload" size={16} color={Colors.text.inverse} />}>
          Try Again
        </AppButton>
      </View>
    );
  }

  const renderHeader = () => (
    <View>
      <ImageBackground source={HERO_IMAGE} style={[styles.hero, { paddingTop: insets.top + Spacing.md }]}>
        <View style={styles.heroOverlay} />

        <View style={styles.heroContent}>
          <View style={styles.heroTopRow}>
            <TouchableOpacity onPress={openDrawer} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="menu" size={28} color={Colors.text.inverse} />
            </TouchableOpacity>

            <Image source={LOGO} style={styles.logo} resizeMode="contain" />

            <TouchableOpacity
              onPress={() => router.push('/notifications')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="notifications-outline" size={24} color={Colors.text.inverse} />
            </TouchableOpacity>
          </View>

          <AppText variant="h3" weight="bold" color="inverse" style={styles.heroTitle}>
            Find your next property
          </AppText>
          <AppText variant="bodySmall" color="rgba(255,255,255,0.85)">
            {properties.length} listings across Pakistan
          </AppText>

          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color={Colors.gray[500]} />
            <TextInput
              placeholder="City, area, or property type"
              placeholderTextColor={Colors.gray[500]}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => router.push('/search')}
              returnKeyType="search"
              style={styles.searchInput}
            />
            <TouchableOpacity onPress={() => setShowFilters(true)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="options-outline" size={20} color={Colors.primary[500]} />
              {filterCount > 0 && <View style={styles.filterDot} />}
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.quickFilters}>
        <QuickFilterBar
          activeFilters={activeFilters}
          filterCount={filterCount}
          updateFilters={updateFilters}
          onOpenAdvancedFilters={() => setShowFilters(true)}
        />
      </View>

      <View style={styles.statsRow}>
        <StatTile label="Listings" value={properties.length} icon="home-outline" />
        <StatTile label="Saved" value={favorites.length} icon="heart-outline" />
        <StatTile label="Featured" value={featured.length} icon="star-outline" />
      </View>

      {!isFiltering && featured.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AppText variant="h4" weight="bold">
              Featured
            </AppText>
            <TouchableOpacity onPress={() => router.push('/industrial-hub')}>
              <AppText variant="bodySmall" color="brand" weight="semibold">
                See all
              </AppText>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredRow}
            decelerationRate="fast"
          >
            {featured.map(property => (
              <View key={`featured-${property.id}`} style={styles.featuredCard}>
                <PropertyCard property={property} onPress={p => openProperty(p.id)} />
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.listHeader}>
        <AppText variant="h4" weight="bold">
          {isFiltering ? 'Filtered results' : 'All properties'}
        </AppText>
        <AppText variant="bodySmall" color="muted">
          {listData.length} {listData.length === 1 ? 'property' : 'properties'}
        </AppText>
      </View>
    </View>
  );

  return (
    <View style={[styles.flex, { backgroundColor: Colors.background.secondary }]}>
      <OfflineBanner />

      {loading && properties.length === 0 ? (
        <LoadingSpinner text="Loading properties…" />
      ) : (
        <FlashList<Property>
          data={listData}
          keyExtractor={item => `property-${item.id}`}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <PropertyCard property={item} onPress={p => openProperty(p.id)} />
            </View>
          )}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="home-outline" size={56} color={Colors.gray[300]} />
              <AppText variant="h4" weight="semibold" align="center" style={styles.emptyTitle}>
                No properties match your filters
              </AppText>
              <AppButton variant="outline" onPress={() => updateFilters({})} style={styles.emptyButton}>
                Clear filters
              </AppButton>
            </View>
          }
          ListFooterComponent={
            <View style={styles.footerSpace}>
              {loadingMore && <ActivityIndicator color={Colors.primary[500]} />}
            </View>
          }
          onEndReached={hasMore ? loadMore : undefined}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={Colors.primary[500]} />
          }
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/map')} activeOpacity={0.85}>
        <Ionicons name="map" size={24} color={Colors.text.inverse} />
      </TouchableOpacity>

      <FilterModal
        isVisible={showFilters}
        onClose={() => setShowFilters(false)}
        currentFilters={activeFilters}
        onApplyFilters={filters => {
          updateFilters(filters);
          setShowFilters(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  centered: { alignItems: 'center', justifyContent: 'center', padding: Spacing.lg, gap: Spacing.sm },
  errorTitle: { marginTop: Spacing.md },
  errorBody: { marginBottom: Spacing.md },

  hero: { width: '100%', paddingBottom: Spacing.xl, backgroundColor: Colors.primary[700] },
  heroOverlay: { ...StyleSheet.absoluteFill, backgroundColor: Colors.primary[800], opacity: 0.72 },
  heroContent: { paddingHorizontal: Spacing.md, gap: 6 },
  heroTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.md },
  logo: { width: 140, height: 36 },
  heroTitle: { marginTop: Spacing.sm },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.round,
    paddingHorizontal: Spacing.md,
    height: 48,
    marginTop: Spacing.md,
    ...Shadows.md,
  },
  searchInput: { flex: 1, fontSize: 15, color: Colors.text.primary, paddingVertical: 0 },
  filterDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error[500],
  },

  quickFilters: { marginTop: -Spacing.lg, paddingHorizontal: Spacing.md, marginBottom: Spacing.md },

  statsRow: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.md, marginBottom: Spacing.lg },
  statTile: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },

  section: { marginBottom: Spacing.lg },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  featuredRow: { paddingHorizontal: Spacing.md, gap: Spacing.md },
  featuredCard: { width: 270 },

  listHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  cardWrapper: { paddingHorizontal: Spacing.md, marginBottom: Spacing.md },
  footerSpace: { height: 100, alignItems: 'center', justifyContent: 'center' },

  emptyState: { alignItems: 'center', paddingVertical: Spacing.xxl, paddingHorizontal: Spacing.lg, gap: Spacing.sm },
  emptyTitle: { marginTop: Spacing.md },
  emptyButton: { marginTop: Spacing.md },

  fab: {
    position: 'absolute',
    right: Spacing.md,
    bottom: 96,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
});

export default HomeScreen;
