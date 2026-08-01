import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { Href, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Share, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppButton from '@/components/base/AppButton';
import AppText from '@/components/base/AppText';
import LoadingSpinner from '@/components/base/LoadingSpinner';
import PropertyCard from '@/components/ui/PropertyCard';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Shadows, Spacing } from '@/constants/Layout';
import { MAX_COMPARE, useCompare } from '@/context/CompareContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useFetchPropertiesByIds } from '@/hooks/useFetchProperties';
import { formatPriceWithPeriod } from '@/lib/format';

const FavoritesScreen: React.FC = () => {
  const router = useRouter();
  // Favorites are device-local (not account-tied), so this list is available
  // to guests too — matches PropertyCard's heart toggle, which never checks auth.
  const { favorites, isLoading: favoritesLoading, clearFavorites } = useFavorites();
  const { properties: favoriteProperties, loading: propertiesLoading } = useFetchPropertiesByIds(favorites);
  const { compareIds, isComparing, toggleCompare } = useCompare();

  const [isClearing, setIsClearing] = useState(false);
  const [compareMode, setCompareMode] = useState(false);

  const isLoading = favoritesLoading || propertiesLoading;

  const handleOpenProperty = (id: number) => {
    router.push({ pathname: '/listing/[id]', params: { id: String(id) } });
  };

  const handleClearAll = () => {
    Alert.alert('Clear all favorites?', `This removes all ${favoriteProperties.length} saved properties.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear All',
        style: 'destructive',
        onPress: () => {
          setIsClearing(true);
          clearFavorites();
          setIsClearing(false);
        },
      },
    ]);
  };

  const handleShare = async () => {
    const lines = favoriteProperties
      .slice(0, 10)
      .map(p => `• ${p.title} — ${formatPriceWithPeriod(p.price, p.listingType)}`);

    try {
      await Share.share({
        message: `My saved properties on Farsh e Zameen:\n\n${lines.join('\n')}`,
      });
    } catch {
      // User dismissed the share sheet — nothing to do.
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        {router.canGoBack() && (
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={22} color={Colors.text.primary} />
          </TouchableOpacity>
        )}

        <View style={styles.headerTitleContainer}>
          <AppText variant="h3" weight="bold">
            Favorites
          </AppText>
          {favoriteProperties.length > 0 && (
            <AppText variant="bodySmall" color="muted">
              {favoriteProperties.length} saved {favoriteProperties.length === 1 ? 'property' : 'properties'}
            </AppText>
          )}
        </View>

        {favoriteProperties.length > 0 && (
          <TouchableOpacity
            onPress={() => setCompareMode(prev => !prev)}
            style={[styles.iconButton, compareMode && styles.iconButtonActive]}
            accessibilityRole="button"
            accessibilityLabel={compareMode ? 'Exit compare mode' : 'Compare properties'}
          >
            <Ionicons
              name="git-compare-outline"
              size={20}
              color={compareMode ? Colors.text.inverse : Colors.text.primary}
            />
          </TouchableOpacity>
        )}

        {favoriteProperties.length > 0 && (
          <TouchableOpacity onPress={handleClearAll} style={styles.iconButton} disabled={isClearing}>
            <Ionicons name="trash-outline" size={20} color={Colors.error[500]} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {renderHeader()}
        <LoadingSpinner text="Loading favorites…" />
      </SafeAreaView>
    );
  }

  if (favoriteProperties.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {renderHeader()}
        <View style={styles.centerContainer}>
          <Ionicons name="heart-outline" size={72} color={Colors.gray[300]} />
          <AppText variant="h4" weight="bold" align="center" style={styles.spacedTop}>
            No favorites yet
          </AppText>
          <AppText variant="bodySmall" color="muted" align="center" style={styles.spacedSmall}>
            Tap the heart on any listing to save it here.
          </AppText>
          <AppButton
            onPress={() => router.push('/')}
            style={styles.actionButton}
            leftIcon={<Ionicons name="search" size={16} color={Colors.text.inverse} />}
          >
            Start Exploring
          </AppButton>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {renderHeader()}

      <FlashList
        data={favoriteProperties}
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
        keyExtractor={item => `fav-${item.id}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      {compareMode && compareIds.length > 0 ? (
        <View style={styles.footer}>
          <View style={styles.buttonRow}>
            <AppText variant="bodySmall" weight="semibold" style={styles.compareCount}>
              {compareIds.length} of {MAX_COMPARE} selected
            </AppText>
            <AppButton
              variant="primary"
              style={styles.flexButton}
              isDisabled={compareIds.length < 2}
              onPress={() => router.push('/compare' as Href)}
            >
              Compare Now
            </AppButton>
          </View>
        </View>
      ) : (
        <View style={styles.footer}>
          <View style={styles.buttonRow}>
            <AppButton variant="outline" style={styles.flexButton} onPress={() => router.push('/')}>
              Browse More
            </AppButton>
            <AppButton
              variant="primary"
              style={styles.flexButton}
              onPress={handleShare}
              leftIcon={<Ionicons name="share-outline" size={16} color={Colors.text.inverse} />}
            >
              Share List
            </AppButton>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background.secondary },
  header: {
    backgroundColor: Colors.background.card,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  iconButton: { padding: 4 },
  iconButtonActive: { backgroundColor: Colors.primary[500], borderRadius: BorderRadius.md },
  headerTitleContainer: { flex: 1, gap: 2 },

  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.lg },
  spacedTop: { marginTop: Spacing.lg },
  spacedSmall: { marginTop: Spacing.xs },
  actionButton: { marginTop: Spacing.lg, minWidth: 200 },

  cardWrapper: { paddingHorizontal: Spacing.md, marginBottom: Spacing.md },
  listContent: { paddingTop: Spacing.md, paddingBottom: 100 },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  buttonRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  flexButton: { flex: 1 },
  compareCount: { flex: 1 },
});

export default FavoritesScreen;
