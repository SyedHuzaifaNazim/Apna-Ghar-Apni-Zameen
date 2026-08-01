import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { Href, useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppButton from '@/components/base/AppButton';
import AppText from '@/components/base/AppText';
import LoadingSpinner from '@/components/base/LoadingSpinner';
import PropertyCard from '@/components/ui/PropertyCard';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/Layout';
import { useAuth } from '@/context/AuthContext';
import { ApiError, apiService } from '@/services/apiService';
import type { Property } from '@/types/property';

const MyListingsScreen: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [myListings, setMyListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchMine = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await apiService.listMyProperties();
      setMyListings(data);
    } catch {
      setMyListings([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Refetch every time this screen regains focus, so a listing just
  // created/edited/deleted elsewhere shows up without a manual pull-to-refresh.
  useFocusEffect(
    useCallback(() => {
      fetchMine();
    }, [fetchMine])
  );

  const handleAddListing = () => {
    router.push('/post-listing' as Href);
  };

  const handleEdit = (id: number) => {
    router.push(`/post-listing?id=${id}` as Href);
  };

  const handleDelete = (property: Property) => {
    Alert.alert('Delete listing?', `"${property.title}" will be permanently removed.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setDeletingId(property.id);
          try {
            await apiService.deleteProperty(property.id);
            setMyListings(prev => prev.filter(p => p.id !== property.id));
          } catch (err) {
            Alert.alert('Failed', err instanceof ApiError ? err.message : 'Could not delete this listing.');
          } finally {
            setDeletingId(null);
          }
        },
      },
    ]);
  };

  const handleViewDetails = (id: number) => {
    router.push({ pathname: '/listing/[id]', params: { id: String(id) } });
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.flex1} edges={['top']}>
        <View style={styles.header}>
          {router.canGoBack() && (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityRole="button">
              <Ionicons name="arrow-back" size={22} color={Colors.primary[500]} />
            </TouchableOpacity>
          )}
          <AppText variant="h3" weight="bold">
            My Listings
          </AppText>
        </View>

        <View style={styles.guestContainer}>
          <Ionicons name="lock-closed-outline" size={56} color={Colors.gray[300]} />
          <AppText variant="h4" weight="bold" align="center" style={styles.guestTitle}>
            Sign in to manage listings
          </AppText>
          <AppText variant="bodySmall" color="muted" align="center" style={styles.guestSubtitle}>
            Posting and managing properties requires an account.
          </AppText>
          <AppButton onPress={() => router.push('/signin' as Href)} style={styles.guestButton}>
            Sign In
          </AppButton>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.flex1} edges={['top']}>
      <View style={styles.header}>
        {router.canGoBack() && (
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityRole="button">
            <Ionicons name="arrow-back" size={22} color={Colors.primary[500]} />
          </TouchableOpacity>
        )}
        <AppText variant="h3" weight="bold">
          My Listings
        </AppText>
      </View>

      <AppButton
        onPress={handleAddListing}
        leftIcon={<Ionicons name="add-circle" size={20} color={Colors.text.inverse} />}
        style={styles.addButton}
      >
        Post New Property
      </AppButton>

      {loading ? (
        <LoadingSpinner text="Loading your listings…" />
      ) : (
        <FlashList
          data={myListings}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <PropertyCard property={item} onPress={() => handleViewDetails(item.id)} />
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleEdit(item.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Edit ${item.title}`}
                >
                  <Ionicons name="create-outline" size={16} color={Colors.primary[600]} />
                  <AppText variant="bodySmall" weight="semibold" color="brand">
                    Edit
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDelete(item)}
                  disabled={deletingId === item.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Delete ${item.title}`}
                >
                  <Ionicons name="trash-outline" size={16} color={Colors.error[500]} />
                  <AppText variant="bodySmall" weight="semibold" color="error">
                    Delete
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="home-outline" size={64} color={Colors.text.disabled} />
              <AppText variant="h4" weight="semibold" style={styles.emptyTitle}>
                No active listings
              </AppText>
              <AppText variant="body" color="secondary" style={styles.emptyText}>
                Start posting your properties to reach thousands of buyers!
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
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    backgroundColor: Colors.background.card,
  },
  backButton: { padding: Spacing.xs, marginRight: Spacing.xs },

  guestContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  guestTitle: { marginTop: Spacing.lg },
  guestSubtitle: { marginTop: Spacing.xs, marginBottom: Spacing.xl },
  guestButton: { minWidth: 200 },

  addButton: { marginHorizontal: Spacing.md, marginTop: Spacing.sm, marginBottom: Spacing.md },
  cardWrapper: { marginHorizontal: Spacing.md, marginBottom: Spacing.md },
  actionRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary[50],
  },
  deleteButton: { backgroundColor: Colors.error[50] },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
  },
  emptyTitle: { marginTop: Spacing.md, textAlign: 'center' },
  emptyText: { marginTop: Spacing.sm, textAlign: 'center' },
  listContent: { paddingBottom: Spacing.xl },
});

export default MyListingsScreen;
