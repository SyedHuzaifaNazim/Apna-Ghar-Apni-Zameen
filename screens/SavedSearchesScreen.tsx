import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { Href, useRouter } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppButton from '@/components/base/AppButton';
import AppText from '@/components/base/AppText';
import LoadingSpinner from '@/components/base/LoadingSpinner';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Shadows, Spacing } from '@/constants/Layout';
import type { SavedSearch } from '@/hooks/useSavedSearches';
import { useSavedSearches } from '@/hooks/useSavedSearches';
import { formatPrice } from '@/lib/format';

const describeFilters = (search: SavedSearch): string => {
  const parts: string[] = [];
  const { filters } = search;

  if (filters.listingType) parts.push(filters.listingType);
  if (filters.propertyCategory) parts.push(filters.propertyCategory);
  if (filters.cities && filters.cities.length > 0) parts.push(filters.cities.join(', '));
  if (filters.bedrooms) parts.push(`${filters.bedrooms}+ beds`);
  if (filters.minPrice || filters.maxPrice) {
    const min = filters.minPrice ? formatPrice(filters.minPrice) : 'Any';
    const max = filters.maxPrice ? formatPrice(filters.maxPrice) : 'Any';
    parts.push(`${min} – ${max}`);
  }

  return parts.length > 0 ? parts.join(' · ') : 'No filters applied';
};

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

const SavedSearchesScreen: React.FC = () => {
  const router = useRouter();
  const { savedSearches, isLoading, removeSavedSearch } = useSavedSearches();

  const handleApply = (search: SavedSearch) => {
    router.push({
      pathname: '/search',
      params: { query: search.query, filters: JSON.stringify(search.filters) },
    } as Href);
  };

  const handleDelete = (search: SavedSearch) => {
    Alert.alert('Delete saved search?', `"${search.label}" will be removed.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeSavedSearch(search.id) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        {router.canGoBack() && (
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityRole="button">
            <Ionicons name="arrow-back" size={22} color={Colors.primary[600]} />
          </TouchableOpacity>
        )}
        <AppText variant="h3" weight="bold">
          Saved Searches
        </AppText>
      </View>

      {isLoading ? (
        <LoadingSpinner text="Loading saved searches…" />
      ) : (
        <FlashList
          data={savedSearches}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => handleApply(item)} activeOpacity={0.8}>
              <View style={styles.cardIcon}>
                <Ionicons name="bookmark" size={18} color={Colors.primary[600]} />
              </View>
              <View style={styles.cardContent}>
                <AppText variant="body" weight="semibold" numberOfLines={1}>
                  {item.label}
                </AppText>
                {!!item.query && (
                  <AppText variant="bodySmall" color="secondary" numberOfLines={1}>
                    “{item.query}”
                  </AppText>
                )}
                <AppText variant="caption" color="muted" numberOfLines={1} style={styles.filtersLine}>
                  {describeFilters(item)}
                </AppText>
                <AppText variant="caption" color="disabled">
                  Saved {formatDate(item.createdAt)}
                </AppText>
              </View>
              <TouchableOpacity
                onPress={() => handleDelete(item)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityRole="button"
                accessibilityLabel={`Delete ${item.label}`}
              >
                <Ionicons name="trash-outline" size={18} color={Colors.error[500]} />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="bookmarks-outline" size={56} color={Colors.gray[300]} />
              <AppText variant="h4" weight="semibold" align="center" style={styles.emptyTitle}>
                No saved searches yet
              </AppText>
              <AppText variant="bodySmall" color="muted" align="center" style={styles.emptySubtitle}>
                Search for properties, then tap "Save" to revisit them later.
              </AppText>
              <AppButton onPress={() => router.push('/search')} style={styles.emptyButton}>
                Start Searching
              </AppButton>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.secondary },
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
  listContent: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: { flex: 1, gap: 2 },
  filtersLine: { marginTop: 2 },
  emptyState: { alignItems: 'center', paddingVertical: Spacing.xxl, paddingHorizontal: Spacing.lg, gap: Spacing.sm },
  emptyTitle: { marginTop: Spacing.md },
  emptySubtitle: { marginBottom: Spacing.md },
  emptyButton: { minWidth: 200 },
});

export default SavedSearchesScreen;
