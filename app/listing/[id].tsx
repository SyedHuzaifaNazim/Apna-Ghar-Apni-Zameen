import { Ionicons } from '@expo/vector-icons';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppText from '@/components/base/AppText';
import LoadingSpinner from '@/components/base/LoadingSpinner';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/Layout';
import { useAuth } from '@/context/AuthContext';
import ContactAgent from '@/features/listings/ListingDetail/ContactAgent';
import ImageGallery from '@/features/listings/ListingDetail/ImageGallery';
import PropertyInfo from '@/features/listings/ListingDetail/PropertyInfo';
import SimilarListings from '@/features/listings/ListingDetail/SimilarListings';
import { useFetchProperty } from '@/hooks/useFetchProperties';
import { ApiError, apiService } from '@/services/apiService';

export default function ListingDetailScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const propertyId = parseInt(id || '0', 10);
  const { property, loading } = useFetchProperty(propertyId);

  const isOwner = !!property && !!user && property.ownerUserId === user.id;

  const handleEdit = () => {
    router.push(`/post-listing?id=${propertyId}` as Href);
  };

  const handleDelete = () => {
    Alert.alert('Delete listing?', 'This will permanently remove your listing.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await apiService.deleteProperty(propertyId);
            router.back();
          } catch (err) {
            Alert.alert('Failed', err instanceof ApiError ? err.message : 'Could not delete this listing.');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.flex1, styles.centerView]} edges={['top']}>
        <LoadingSpinner text="Loading property…" />
      </SafeAreaView>
    );
  }

  if (!property) {
    return (
      <SafeAreaView style={[styles.flex1, styles.centerView]} edges={['top']}>
        <AppText variant="h3" weight="semibold" color="error">
          Property not found
        </AppText>
        <AppText variant="body" color="secondary" style={styles.notFoundBody}>
          The property you&apos;re looking for doesn&apos;t exist.
        </AppText>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.flex1}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageGallery images={property.images} height={300} showThumbnails />
        {isOwner && (
          <View style={styles.ownerRow}>
            <TouchableOpacity style={styles.ownerButton} onPress={handleEdit} accessibilityRole="button">
              <Ionicons name="create-outline" size={16} color={Colors.primary[600]} />
              <AppText variant="bodySmall" weight="semibold" color="brand">
                Edit Listing
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.ownerButton, styles.ownerDeleteButton]}
              onPress={handleDelete}
              accessibilityRole="button"
            >
              <Ionicons name="trash-outline" size={16} color={Colors.error[500]} />
              <AppText variant="bodySmall" weight="semibold" color="error">
                Delete
              </AppText>
            </TouchableOpacity>
          </View>
        )}
        <PropertyInfo property={property} />
        <ContactAgent property={property} />
        <SimilarListings currentProperty={property} count={4} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1, backgroundColor: Colors.background.secondary },
  centerView: { justifyContent: 'center', alignItems: 'center', padding: Spacing.lg },
  notFoundBody: { marginTop: Spacing.xs },
  ownerRow: { flexDirection: 'row', gap: Spacing.sm, padding: Spacing.md },
  ownerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary[50],
  },
  ownerDeleteButton: { backgroundColor: Colors.error[50] },
});
