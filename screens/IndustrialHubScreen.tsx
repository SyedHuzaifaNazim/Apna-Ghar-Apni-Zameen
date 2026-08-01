import { Ionicons } from '@expo/vector-icons';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDrawer } from '@/app/_layout';
import AppButton from '@/components/base/AppButton';
import AppText from '@/components/base/AppText';
import LoadingSpinner from '@/components/base/LoadingSpinner';
import PropertyCard from '@/components/ui/PropertyCard';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Layout';
import { useFetchProperties } from '@/hooks/useFetchProperties';
import type { Property } from '@/types/property';

const INDUSTRIAL_CATEGORIES = ['Commercial', 'Industrial', 'Warehouse', 'Factory', 'Retail'];

const IndustrialHubScreen: React.FC = () => {
  const router = useRouter();
  const { openDrawer } = useDrawer();
  // Filters client-side to a specific category subset, so it needs the whole
  // pool rather than paginating (most pages would yield few/no matches).
  const { properties, loading, error, refetch } = useFetchProperties({ paginate: false });
  const [refreshing, setRefreshing] = useState(false);

  const industrialProperties = useMemo(
    () => properties.filter(p => INDUSTRIAL_CATEGORIES.some(category => p.propertyCategory.includes(category))),
    [properties]
  );

  const handlePropertyPress = useCallback(
    (id: number) => router.push({ pathname: '/listing/[id]', params: { id: String(id) } }),
    [router]
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const renderItem: ListRenderItem<Property> = useCallback(
    ({ item }) => (
      <View style={styles.cardWrapper}>
        <PropertyCard property={item} onPress={() => handlePropertyPress(item.id)} />
      </View>
    ),
    [handlePropertyPress]
  );

  return (
    <SafeAreaView style={styles.flex1} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer} style={styles.hamburgerButton} accessibilityRole="button">
          <Ionicons name="menu" size={26} color={Colors.primary[500]} />
        </TouchableOpacity>
        <AppText variant="h4" weight="bold" style={styles.headerTitle}>
          Industrial Hub
        </AppText>
        <TouchableOpacity onPress={() => router.push('/search')} style={styles.searchButton} accessibilityRole="button">
          <Ionicons name="search" size={22} color={Colors.primary[500]} />
        </TouchableOpacity>
      </View>

      {loading && properties.length === 0 ? (
        <LoadingSpinner text="Loading industrial listings…" />
      ) : error && properties.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="cloud-offline-outline" size={56} color={Colors.gray[300]} />
          <AppText variant="h4" weight="semibold" align="center" style={styles.errorTitle}>
            Couldn&apos;t load listings
          </AppText>
          <AppText variant="bodySmall" color="muted" align="center" style={styles.errorBody}>
            {error}
          </AppText>
          <AppButton onPress={refetch} leftIcon={<Ionicons name="reload" size={16} color={Colors.text.inverse} />}>
            Try Again
          </AppButton>
        </View>
      ) : (
        <FlashList
          data={industrialProperties}
          renderItem={renderItem}
          keyExtractor={(item: Property) => item.id.toString()}
          getItemType={() => 'Property'}
          showsVerticalScrollIndicator={false}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <AppText variant="bodySmall" color="secondary">
                Found {industrialProperties.length} commercial and industrial properties
              </AppText>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="business-outline" size={56} color={Colors.gray[300]} />
              <AppText variant="h4" weight="semibold" align="center" style={styles.emptyTitle}>
                No industrial properties available
              </AppText>
            </View>
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex1: { flex: 1, backgroundColor: Colors.background.secondary },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    backgroundColor: Colors.background.card,
  },
  hamburgerButton: { padding: Spacing.xs },
  headerTitle: { flex: 1, textAlign: 'center' },
  searchButton: { padding: Spacing.xs },
  listHeader: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  cardWrapper: { paddingHorizontal: Spacing.md, marginBottom: Spacing.md },
  listContent: { paddingBottom: Spacing.xl },
  emptyContainer: { alignItems: 'center', padding: Spacing.xxl },
  emptyTitle: { marginTop: Spacing.md },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.lg, gap: Spacing.sm },
  errorTitle: { marginTop: Spacing.md },
  errorBody: { marginBottom: Spacing.md },
});

export default IndustrialHubScreen;
