import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppButton from '@/components/base/AppButton';
import AppText from '@/components/base/AppText';
import ErrorBoundary from '@/components/base/ErrorBoundary';
import FilterModal from '@/components/ui/FilterModal';
import PropertyCard from '@/components/ui/PropertyCard';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Shadows, Spacing } from '@/constants/Layout';
import { MAX_COMPARE, useCompare } from '@/context/CompareContext';
import SearchSuggestions from '@/features/search/SearchSuggestions';
import { useFetchProperties } from '@/hooks/useFetchProperties';
import { FilterOptions, useFilterProperties } from '@/hooks/useFilterProperties';
import { useSavedSearches } from '@/hooks/useSavedSearches';
import { storageService } from '@/services/storageService';
import type { Property } from '@/types/property';

const RECENT_SEARCHES_KEY = 'search_history';
const MAX_RECENT = 8;
const DEBOUNCE_MS = 250;

const POPULAR_SEARCHES = [
  'Plot in Bahria Town',
  'Penthouse Karachi',
  'Office space',
  'House in Lahore',
  'Studio Islamabad',
];

const SearchScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ query?: string; filters?: string }>();

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [searchLabel, setSearchLabel] = useState('');
  const [compareMode, setCompareMode] = useState(false);

  const { compareIds, isComparing, toggleCompare, canAddMore } = useCompare();

  // Free-text search needs the whole pool to search within (there's no
  // server-side search endpoint), not one infinite-scroll page at a time.
  const { properties, loading } = useFetchProperties({ paginate: false });
  const { filteredProperties, activeFilters, filterCount, updateFilters } = useFilterProperties(properties);
  const { saveSearch } = useSavedSearches();

  // Arriving from a saved search (Saved Searches screen passes query + filters as params).
  useEffect(() => {
    if (params.query) setQuery(params.query);
    if (params.filters) {
      try {
        updateFilters(JSON.parse(params.filters) as Partial<FilterOptions>);
      } catch {
        // Malformed param — ignore rather than crash.
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.query, params.filters]);

  // Debounce the raw input so we don't re-filter on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  // Load persisted recent searches (previously these were hardcoded strings).
  useEffect(() => {
    let cancelled = false;
    storageService
      .getItem<string[]>(RECENT_SEARCHES_KEY)
      .then(saved => {
        if (!cancelled && Array.isArray(saved)) setRecentSearches(saved);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const rememberSearch = useCallback((term: string) => {
    const clean = term.trim();
    if (clean.length < 2) return;

    setRecentSearches(prev => {
      const next = [clean, ...prev.filter(item => item.toLowerCase() !== clean.toLowerCase())].slice(0, MAX_RECENT);
      storageService.setItem(RECENT_SEARCHES_KEY, next).catch(() => undefined);
      return next;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    storageService.removeItem(RECENT_SEARCHES_KEY).catch(() => undefined);
  }, []);

  // Free-text match across the fields a buyer would actually search by.
  const results = useMemo<Property[]>(() => {
    const source = filterCount > 0 ? filteredProperties : properties;
    if (!debouncedQuery) return [];

    const needle = debouncedQuery.toLowerCase();
    return source.filter(property => {
      const haystack = [
        property.title,
        property.address.city,
        property.address.area,
        property.address.line1,
        property.propertyCategory,
        property.listingType,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [debouncedQuery, properties, filteredProperties, filterCount]);

  const handleSelectSuggestion = useCallback(
    (suggestion: string) => {
      setQuery(suggestion);
      rememberSearch(suggestion);
    },
    [rememberSearch]
  );

  const handleOpenProperty = useCallback(
    (id: number) => {
      rememberSearch(debouncedQuery);
      router.push({ pathname: '/listing/[id]', params: { id: String(id) } });
    },
    [router, rememberSearch, debouncedQuery]
  );

  const handleConfirmSave = async () => {
    const label = searchLabel.trim() || debouncedQuery || 'Saved search';
    await saveSearch(label, debouncedQuery, activeFilters);
    setShowSaveModal(false);
    setSearchLabel('');
  };

  const isSearching = query.trim().length > 0;
  const showSpinner = loading && properties.length === 0;
  const canSave = isSearching || filterCount > 0;

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Search bar */}
        <View style={styles.header}>
          {router.canGoBack() && (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          )}

          <View style={styles.searchField}>
            <Ionicons name="search" size={18} color={Colors.gray[500]} />
            <TextInput
              placeholder="Search city, area, or property type"
              placeholderTextColor={Colors.gray[500]}
              value={query}
              onChangeText={setQuery}
              style={styles.input}
              autoFocus
              returnKeyType="search"
              onSubmitEditing={() => rememberSearch(query)}
            />
            {isSearching && (
              <TouchableOpacity onPress={() => setQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close-circle" size={18} color={Colors.gray[500]} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push('/saved-searches' as Href)}
            accessibilityRole="button"
            accessibilityLabel="View saved searches"
          >
            <Ionicons name="bookmarks-outline" size={20} color={Colors.text.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconButton, compareMode && styles.filterButtonActive]}
            onPress={() => setCompareMode(prev => !prev)}
            accessibilityRole="button"
            accessibilityLabel={compareMode ? 'Exit compare mode' : 'Compare properties'}
          >
            <Ionicons
              name="git-compare-outline"
              size={20}
              color={compareMode ? Colors.text.inverse : Colors.text.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconButton, filterCount > 0 && styles.filterButtonActive]}
            onPress={() => setShowFilters(true)}
          >
            <Ionicons
              name="options-outline"
              size={20}
              color={filterCount > 0 ? Colors.text.inverse : Colors.text.primary}
            />
            {filterCount > 0 && (
              <View style={styles.filterBadge}>
                <AppText variant="caption" weight="bold" color="inverse">
                  {filterCount}
                </AppText>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {showSpinner ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.primary[500]} />
          </View>
        ) : isSearching ? (
          <FlashList
            data={results}
            keyExtractor={item => `search-${item.id}`}
            renderItem={({ item }) => (
              <View style={styles.cardWrapper}>
                <PropertyCard
                  property={item}
                  onPress={p => handleOpenProperty(p.id)}
                  compareMode={compareMode}
                  isCompareSelected={isComparing(item.id)}
                  onToggleCompare={p => toggleCompare(p.id)}
                />
              </View>
            )}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <View style={styles.resultsHeader}>
                <View style={styles.flex}>
                  <AppText variant="h4" weight="bold">
                    {results.length} {results.length === 1 ? 'result' : 'results'}
                  </AppText>
                  <AppText variant="bodySmall" color="muted">
                    for “{debouncedQuery}”
                  </AppText>
                </View>
                {canSave && (
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => setShowSaveModal(true)}
                    accessibilityRole="button"
                    accessibilityLabel="Save this search"
                  >
                    <Ionicons name="bookmark-outline" size={16} color={Colors.primary[600]} />
                    <AppText variant="bodySmall" weight="semibold" color="brand">
                      Save
                    </AppText>
                  </TouchableOpacity>
                )}
              </View>
            }
            ListEmptyComponent={
              debouncedQuery ? (
                <View style={styles.emptyState}>
                  <Ionicons name="search-outline" size={56} color={Colors.gray[300]} />
                  <AppText variant="h4" weight="semibold" align="center" style={styles.emptyTitle}>
                    Nothing matched “{debouncedQuery}”
                  </AppText>
                  <AppText variant="bodySmall" color="muted" align="center">
                    Try a different city, area, or property type.
                  </AppText>
                </View>
              ) : null
            }
          />
        ) : (
          <SearchSuggestions
            recentSearches={recentSearches}
            popularSearches={POPULAR_SEARCHES}
            onSelectSuggestion={handleSelectSuggestion}
            onClearRecentSearches={clearRecentSearches}
          />
        )}

        <FilterModal
          isVisible={showFilters}
          onClose={() => setShowFilters(false)}
          currentFilters={activeFilters}
          onApplyFilters={filters => {
            updateFilters(filters);
            setShowFilters(false);
          }}
        />

        <Modal
          visible={showSaveModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowSaveModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <AppText variant="h4" weight="bold">
                Save this search
              </AppText>
              <AppText variant="bodySmall" color="secondary" style={styles.modalSubtitle}>
                Give it a name so you can find it again later.
              </AppText>
              <TextInput
                placeholder={debouncedQuery || 'e.g. 3 bed flats in Clifton'}
                placeholderTextColor={Colors.gray[500]}
                value={searchLabel}
                onChangeText={setSearchLabel}
                style={styles.modalInput}
                autoFocus
              />
              <View style={styles.modalButtonRow}>
                <AppButton variant="outline" style={styles.modalButton} onPress={() => setShowSaveModal(false)}>
                  Cancel
                </AppButton>
                <AppButton style={styles.modalButton} onPress={handleConfirmSave}>
                  Save
                </AppButton>
              </View>
            </View>
          </View>
        </Modal>

        {compareMode && compareIds.length > 0 && (
          <View style={styles.compareBar}>
            <AppText variant="bodySmall" weight="semibold" style={styles.flex}>
              {compareIds.length} of {MAX_COMPARE} selected
            </AppText>
            <AppButton
              style={styles.compareBarButton}
              isDisabled={compareIds.length < 2}
              onPress={() => router.push('/compare' as Href)}
            >
              Compare Now
            </AppButton>
          </View>
        )}
        {compareMode && !canAddMore && (
          <View style={styles.compareLimitHint} pointerEvents="none">
            <AppText variant="caption" color="inverse">
              Max {MAX_COMPARE} properties — remove one to add another.
            </AppText>
          </View>
        )}
      </SafeAreaView>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.primary },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  backButton: { padding: 4 },
  searchField: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    height: 44,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  input: { flex: 1, fontSize: 15, color: Colors.text.primary, paddingVertical: 0 },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  filterButtonActive: { backgroundColor: Colors.primary[500], borderColor: Colors.primary[500] },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: Colors.error[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  listContent: { paddingBottom: Spacing.xxl },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primary[50],
  },
  cardWrapper: { paddingHorizontal: Spacing.md, marginBottom: Spacing.md },
  emptyState: { alignItems: 'center', paddingTop: Spacing.xxl, paddingHorizontal: Spacing.lg, gap: Spacing.sm },
  emptyTitle: { marginTop: Spacing.md },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.lg,
  },
  modalSubtitle: { marginTop: Spacing.xs, marginBottom: Spacing.md },
  modalInput: {
    height: 48,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
    backgroundColor: Colors.background.secondary,
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
  },
  modalButtonRow: { flexDirection: 'row', gap: Spacing.sm },
  modalButton: { flex: 1 },

  compareBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.background.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    ...Shadows.lg,
  },
  compareBarButton: { minWidth: 150 },
  compareLimitHint: {
    position: 'absolute',
    top: 70,
    alignSelf: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.round,
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
});

export default SearchScreen;
