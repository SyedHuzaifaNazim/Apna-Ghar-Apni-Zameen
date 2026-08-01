import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { memo, useCallback } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import AppText from '@/components/base/AppText';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Shadows, Spacing } from '@/constants/Layout';
import { useFavorites } from '@/context/FavoritesContext';
import { formatArea, formatBedBath, formatPriceWithPeriod, formatRelativeDate } from '@/lib/format';
import type { Property } from '@/types/property';

export type PropertyCardVariant = 'default' | 'featured' | 'compact';

interface PropertyCardProps {
  property: Property;
  onPress?: (property: Property) => void;
  variant?: PropertyCardVariant;
  /** When set, tapping the card toggles compare-selection instead of navigating. */
  compareMode?: boolean;
  isCompareSelected?: boolean;
  onToggleCompare?: (property: Property) => void;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800';

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onPress,
  variant = 'default',
  compareMode = false,
  isCompareSelected = false,
  onToggleCompare,
}) => {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();

  const saved = isFavorite(property.id);
  const isCompact = variant === 'compact';

  const handlePress = useCallback(() => {
    if (compareMode) {
      onToggleCompare?.(property);
      return;
    }
    if (onPress) {
      onPress(property);
      return;
    }
    router.push({ pathname: '/listing/[id]', params: { id: String(property.id) } });
  }, [compareMode, onToggleCompare, onPress, property, router]);

  const handleToggleFavorite = useCallback(() => {
    toggleFavorite(property.id);
  }, [toggleFavorite, property.id]);

  const isRental = property.listingType === 'For Rent' || property.listingType === 'Short Term Rent';
  const bedBath = formatBedBath(property.bedrooms, property.bathrooms);

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`${property.title}, ${formatPriceWithPeriod(property.price, property.listingType)}`}
      style={({ pressed }) => [styles.card, isCompact && styles.cardCompact, pressed && styles.pressed]}
    >
      <View style={[styles.imageWrap, isCompact && styles.imageWrapCompact]}>
        <Image
          source={{ uri: property.images?.[0] || FALLBACK_IMAGE }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Listing type — the single most scannable attribute */}
        <View style={[styles.typeBadge, { backgroundColor: isRental ? Colors.status.forRent : Colors.status.forSale }]}>
          <AppText variant="caption" weight="bold" color="inverse">
            {property.listingType.toUpperCase()}
          </AppText>
        </View>

        {property.isFeatured && (
          <View style={styles.featuredBadge}>
            <Ionicons name="star" size={11} color={Colors.text.inverse} />
            <AppText variant="caption" weight="bold" color="inverse">
              FEATURED
            </AppText>
          </View>
        )}

        {compareMode ? (
          <View style={[styles.compareCheck, isCompareSelected && styles.compareCheckSelected]}>
            <Ionicons
              name={isCompareSelected ? 'checkmark-circle' : 'ellipse-outline'}
              size={24}
              color={isCompareSelected ? Colors.primary[500] : Colors.text.inverse}
            />
          </View>
        ) : (
          <Pressable
            onPress={handleToggleFavorite}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel={saved ? 'Remove from favourites' : 'Save to favourites'}
            style={({ pressed }) => [styles.favoriteButton, pressed && styles.favoritePressed]}
          >
            <Ionicons
              name={saved ? 'heart' : 'heart-outline'}
              size={20}
              color={saved ? Colors.error[500] : Colors.gray[700]}
            />
          </Pressable>
        )}
      </View>

      <View style={styles.body}>
        <AppText variant="h4" weight="bold" color="brand">
          {formatPriceWithPeriod(property.price, property.listingType)}
        </AppText>

        <AppText variant="bodySmall" weight="medium" numberOfLines={isCompact ? 1 : 2} style={styles.title}>
          {property.title}
        </AppText>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={13} color={Colors.gray[500]} />
          <AppText variant="caption" color="muted" numberOfLines={1} style={styles.flex}>
            {property.address.area}, {property.address.city}
          </AppText>
        </View>

        {!isCompact && (
          <View style={styles.metaRow}>
            <View style={styles.metaGroup}>
              {!!bedBath && (
                <AppText variant="caption" color="secondary" weight="medium">
                  {bedBath}
                </AppText>
              )}
              {!!bedBath && <View style={styles.dot} />}
              <AppText variant="caption" color="secondary" weight="medium">
                {formatArea(property.areaSize, property.areaUnit)}
              </AppText>
            </View>

            <AppText variant="caption" color="disabled">
              {formatRelativeDate(property.datePosted)}
            </AppText>
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border.light,
    ...Shadows.sm,
  },
  cardCompact: { flexDirection: 'row' },
  pressed: { opacity: 0.9, transform: [{ scale: 0.995 }] },

  imageWrap: { position: 'relative', width: '100%', height: 190, backgroundColor: Colors.gray[100] },
  imageWrapCompact: { width: 120, height: 'auto' },
  image: { width: '100%', height: '100%' },

  typeBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  featuredBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm + 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.status.featured,
  },
  favoriteButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.94)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  favoritePressed: { transform: [{ scale: 0.88 }] },
  compareCheck: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compareCheckSelected: { backgroundColor: 'rgba(255,255,255,0.94)' },

  body: { flex: 1, padding: Spacing.md, gap: 5 },
  title: { color: Colors.text.primary },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  flex: { flex: 1 },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  metaGroup: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: Colors.gray[400] },
});

export default memo(PropertyCard);
