import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppButton from '@/components/base/AppButton';
import AppText from '@/components/base/AppText';
import LoadingSpinner from '@/components/base/LoadingSpinner';
import PropertyCard from '@/components/ui/PropertyCard';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Shadows, Spacing } from '@/constants/Layout';
import { useFetchProperties } from '@/hooks/useFetchProperties';
import { openEmail, openPhoneDialer, openWhatsApp } from '@/lib/contactLinks';
import { formatPrice } from '@/lib/format';
import type { Property } from '@/types/property';

const AgentProfileScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // No dedicated agent endpoint exists yet — the mock pool fits in one
  // request (BULK_PAGE_SIZE === TOTAL_MOCK_PROPERTIES), so filtering
  // client-side is simpler than adding a backend route for this alone.
  const { properties, loading } = useFetchProperties({ paginate: false });

  const listings = useMemo(
    () => properties.filter(p => p.ownerDetails.agentId === id),
    [properties, id]
  );

  const agent = listings[0]?.ownerDetails;

  const stats = useMemo(() => {
    const forSale = listings.filter(p => p.listingType === 'For Sale').length;
    const forRent = listings.filter(p => p.listingType === 'For Rent' || p.listingType === 'Short Term Rent').length;
    const prices = listings.map(p => p.price).filter(p => p > 0);
    const avgPrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
    return { total: listings.length, forSale, forRent, avgPrice };
  }, [listings]);

  const handleOpenProperty = (propertyId: number) => {
    router.push({ pathname: '/listing/[id]', params: { id: String(propertyId) } });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <LoadingSpinner text="Loading agent profile…" />
      </SafeAreaView>
    );
  }

  if (!agent) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          {router.canGoBack() && (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityRole="button">
              <Ionicons name="arrow-back" size={22} color={Colors.primary[600]} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="person-circle-outline" size={64} color={Colors.gray[300]} />
          <AppText variant="h4" weight="semibold" align="center" style={styles.emptyTitle}>
            Agent not found
          </AppText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        {router.canGoBack() && (
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityRole="button">
            <Ionicons name="arrow-back" size={22} color={Colors.primary[600]} />
          </TouchableOpacity>
        )}
        <AppText variant="h3" weight="bold">
          Agent Profile
        </AppText>
      </View>

      <FlashList
        data={listings}
        keyExtractor={item => `agent-listing-${item.id}`}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }: { item: Property }) => (
          <View style={styles.cardWrapper}>
            <PropertyCard property={item} onPress={p => handleOpenProperty(p.id)} />
          </View>
        )}
        ListHeaderComponent={
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <AppText variant="h2" weight="bold" color="inverse">
                  {agent.name.charAt(0).toUpperCase()}
                </AppText>
              </View>
              <View style={styles.flex}>
                <AppText variant="h4" weight="bold">
                  {agent.name}
                </AppText>
                <AppText variant="bodySmall" color="muted">
                  {agent.agencyName || 'Independent Owner'}
                </AppText>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <AppText variant="h4" weight="bold" color="brand">
                  {stats.total}
                </AppText>
                <AppText variant="caption" color="muted">
                  Listings
                </AppText>
              </View>
              <View style={styles.statBox}>
                <AppText variant="h4" weight="bold" color="brand">
                  {stats.forSale}
                </AppText>
                <AppText variant="caption" color="muted">
                  For Sale
                </AppText>
              </View>
              <View style={styles.statBox}>
                <AppText variant="h4" weight="bold" color="brand">
                  {stats.forRent}
                </AppText>
                <AppText variant="caption" color="muted">
                  For Rent
                </AppText>
              </View>
              <View style={styles.statBox}>
                <AppText variant="bodySmall" weight="bold" color="brand" numberOfLines={1}>
                  {formatPrice(stats.avgPrice)}
                </AppText>
                <AppText variant="caption" color="muted">
                  Avg. Price
                </AppText>
              </View>
            </View>

            <View style={styles.contactRow}>
              <AppButton
                variant="outline"
                style={styles.contactButton}
                onPress={() => openPhoneDialer(agent.phone)}
                leftIcon={<Ionicons name="call" size={16} color={Colors.primary[500]} />}
              >
                Call
              </AppButton>
              <AppButton
                variant="outline"
                style={[styles.contactButton, { borderColor: Colors.social?.whatsapp || '#25D366' }]}
                textStyle={{ color: Colors.social?.whatsapp || '#25D366' }}
                onPress={() => openWhatsApp(agent.phone, `Hi ${agent.name}, I'd like to know more about your listings.`)}
                leftIcon={<Ionicons name="logo-whatsapp" size={16} color={Colors.social?.whatsapp || '#25D366'} />}
              >
                WhatsApp
              </AppButton>
              <AppButton
                variant="outline"
                style={styles.contactButton}
                onPress={() => openEmail(agent.email, `Inquiry via Farsh e Zameen`, `Hi ${agent.name},\n\nI'd like to know more about your listings.`)}
                leftIcon={<Ionicons name="mail" size={16} color={Colors.primary[500]} />}
              >
                Email
              </AppButton>
            </View>

            <AppText variant="body" weight="semibold" style={styles.listingsHeading}>
              {stats.total} {stats.total === 1 ? 'Listing' : 'Listings'}
            </AppText>
          </View>
        }
      />
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

  listContent: { paddingBottom: Spacing.xxl },
  cardWrapper: { paddingHorizontal: Spacing.md, marginBottom: Spacing.md },

  profileCard: {
    backgroundColor: Colors.background.card,
    margin: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.lg },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border.light,
    marginBottom: Spacing.md,
  },
  statBox: { alignItems: 'center', gap: 2, flex: 1 },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  contactButton: { minWidth: '30%', flexGrow: 1, borderColor: Colors.primary[500], borderWidth: 1 },
  listingsHeading: { marginTop: Spacing.lg },
});

export default AgentProfileScreen;
