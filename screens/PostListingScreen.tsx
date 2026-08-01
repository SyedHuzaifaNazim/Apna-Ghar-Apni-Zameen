import { Ionicons } from '@expo/vector-icons';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppButton from '@/components/base/AppButton';
import AppText from '@/components/base/AppText';
import LoadingSpinner from '@/components/base/LoadingSpinner';
import MapView from '@/components/ui/MapView';
import type { MapPropertyMarker, Region } from '@/components/ui/mapTypes';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Shadows, Spacing } from '@/constants/Layout';
import { useAuth } from '@/context/AuthContext';
import { useFetchProperty } from '@/hooks/useFetchProperties';
import { pickListingImages } from '@/lib/imagePicker';
import { ApiError, apiService } from '@/services/apiService';
import type {
  AreaUnit,
  ElectricityBackup,
  FurnishingType,
  ListingType,
  PropertyCategory,
  PropertyCondition,
  PropertyDraft,
  WaterSupply,
} from '@/types/property';

const LISTING_TYPES: ListingType[] = ['For Sale', 'For Rent', 'Auction', 'Short Term Rent'];
const PROPERTY_CATEGORIES: PropertyCategory[] = [
  'Residential Flat',
  'Residential House',
  'Commercial Shop',
  'Commercial Office',
  'Industrial Plot',
  'Farm House',
  'Warehouse',
  'Penthouse',
  'Studio',
  'Retail Outlet',
  'Showroom',
  'Corporate Tower',
  'Factory',
];
const AREA_UNITS: AreaUnit[] = ['sqft', 'sq-yard', 'acre', 'kanal', 'marla'];
const FURNISHING_TYPES: FurnishingType[] = ['Furnished', 'Semi-Furnished', 'Unfurnished'];
const CONDITIONS: PropertyCondition[] = ['New', 'Renovated', 'Well-Maintained', 'Old'];
const WATER_SUPPLY: WaterSupply[] = ['Available', 'Not Available'];
const ELECTRICITY_BACKUP: ElectricityBackup[] = ['None', 'Partial', 'Full'];
// Matches PropertyInfo.tsx's icon map and mockPropertyGenerator.js's pools exactly,
// so user-posted listings render identically to the mock demo data.
const AMENITY_OPTIONS = [
  'Swimming Pool', 'Gym', 'Security', 'Parking', 'Garden', 'Lift',
  'Power Backup', 'Solar Panels', 'CCTV', 'Gated Community', 'Fire Safety System', 'Reception Lobby',
];
const FEATURE_OPTIONS = [
  'Open Kitchen', 'Walk-in Closet', 'Balcony', 'Servant Quarter', 'Store Room',
  'Study Room', 'Home Theater', 'Private Garden', 'Rooftop Access', 'Smart Home System',
];

const DEFAULT_REGION: Region = { latitude: 30.3753, longitude: 69.3451, latitudeDelta: 8, longitudeDelta: 8 };
const MAX_IMAGES = 6;

const emptyDraft = (): PropertyDraft => ({
  title: '',
  listingType: 'For Sale',
  propertyCategory: 'Residential House',
  price: 0,
  currency: 'PKR',
  areaSize: 0,
  areaUnit: 'sqft',
  address: { city: '', area: '', line1: '', postalCode: '', latitude: 0, longitude: 0 },
  bedrooms: 0,
  bathrooms: 0,
  floorLevel: null,
  furnishing: 'Unfurnished',
  yearBuilt: new Date().getFullYear(),
  propertyCondition: 'Well-Maintained',
  amenities: [],
  features: [],
  parkingSpaces: 0,
  waterSupply: 'Available',
  electricityBackup: 'None',
  description: '',
  images: [],
  contactPhone: '',
  agencyName: undefined,
});

const Pill: React.FC<{ label: string; active: boolean; onPress: () => void }> = ({ label, active, onPress }) => (
  <TouchableOpacity style={[styles.pill, active && styles.pillActive]} onPress={onPress}>
    <AppText variant="bodySmall" weight="medium" color={active ? 'inverse' : 'primary'}>
      {label}
    </AppText>
  </TouchableOpacity>
);

const FieldLabel: React.FC<{ children: string }> = ({ children }) => (
  <AppText variant="bodySmall" weight="semibold" style={styles.fieldLabel}>
    {children}
  </AppText>
);

const PostListingScreen: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const editId = id ? parseInt(id, 10) : undefined;
  const isEdit = editId !== undefined;

  const { property: existing, loading: loadingExisting } = useFetchProperty(editId ?? NaN);

  const [draft, setDraft] = useState<PropertyDraft>(emptyDraft());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(!isEdit);

  const patch = (updates: Partial<PropertyDraft>) => setDraft(prev => ({ ...prev, ...updates }));
  const patchAddress = (updates: Partial<PropertyDraft['address']>) =>
    setDraft(prev => ({ ...prev, address: { ...prev.address, ...updates } }));

  // Prefill from the existing listing once it loads, guarding ownership —
  // this screen must never let someone edit a listing that isn't theirs.
  useEffect(() => {
    if (!isEdit || hydrated || loadingExisting) return;
    if (!existing) return;

    if (existing.ownerUserId !== user?.id) {
      Alert.alert('Not allowed', 'You can only edit your own listings.');
      router.back();
      return;
    }

    setDraft({
      title: existing.title,
      listingType: existing.listingType,
      propertyCategory: existing.propertyCategory,
      price: existing.price,
      currency: existing.currency,
      areaSize: existing.areaSize,
      areaUnit: existing.areaUnit,
      address: { ...existing.address },
      bedrooms: existing.bedrooms,
      bathrooms: existing.bathrooms,
      floorLevel: existing.floorLevel,
      furnishing: existing.furnishing,
      yearBuilt: existing.yearBuilt,
      propertyCondition: existing.propertyCondition,
      amenities: existing.amenities,
      features: existing.features,
      parkingSpaces: existing.parkingSpaces,
      waterSupply: existing.waterSupply,
      electricityBackup: existing.electricityBackup,
      description: existing.description,
      images: existing.images,
      contactPhone: existing.ownerDetails.phone,
      agencyName: existing.ownerDetails.agencyName,
    });
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, hydrated, loadingExisting, existing]);

  // Prefill contact phone for a brand-new listing from the user's profile.
  useEffect(() => {
    if (!isEdit && user?.phone) patch({ contactPhone: user.phone });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, user?.phone]);

  const hasLocation = draft.address.latitude !== 0 || draft.address.longitude !== 0;
  const mapRegion: Region = useMemo(
    () => (hasLocation ? { ...DEFAULT_REGION, latitude: draft.address.latitude, longitude: draft.address.longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 } : DEFAULT_REGION),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hydrated]
  );
  const mapMarkers = useMemo<MapPropertyMarker[]>(
    () => (hasLocation ? [{ id: -1, latitude: draft.address.latitude, longitude: draft.address.longitude, label: '📍', color: Colors.primary[500] }] : []),
    [hasLocation, draft.address.latitude, draft.address.longitude]
  );

  const handleMapPress = (coords?: { latitude: number; longitude: number }) => {
    if (coords) patchAddress({ latitude: coords.latitude, longitude: coords.longitude });
  };

  const handleAddImages = async () => {
    const remaining = MAX_IMAGES - draft.images.length;
    if (remaining <= 0) return;
    const picked = await pickListingImages(remaining);
    if (picked.length > 0) patch({ images: [...draft.images, ...picked] });
  };

  const handleRemoveImage = (index: number) => {
    patch({ images: draft.images.filter((_, i) => i !== index) });
  };

  const toggleInList = (list: string[], value: string) =>
    list.includes(value) ? list.filter(v => v !== value) : [...list, value];

  const validate = (): string | null => {
    if (!draft.title.trim()) return 'Please enter a title.';
    if (!draft.address.city.trim() || !draft.address.area.trim() || !draft.address.line1.trim()) {
      return 'Please fill in city, area, and address.';
    }
    if (!hasLocation) return 'Please tap the map to set the property location.';
    if (draft.price <= 0) return 'Please enter a valid price.';
    if (draft.areaSize <= 0) return 'Please enter a valid area size.';
    if (draft.images.length === 0) return 'Please add at least one photo.';
    if (!draft.contactPhone.trim()) return 'Please enter a contact phone number.';
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setSubmitting(true);

    try {
      if (isEdit && editId !== undefined) {
        await apiService.updateProperty(editId, draft);
        Alert.alert('Updated', 'Your listing has been updated.');
      } else {
        const created = await apiService.createProperty(draft);
        Alert.alert('Posted', 'Your listing is now live.');
        router.replace({ pathname: '/listing/[id]', params: { id: String(created.id) } } as Href);
        return;
      }
      router.back();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save listing.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isEdit && (loadingExisting || !hydrated)) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <LoadingSpinner text="Loading listing…" />
      </SafeAreaView>
    );
  }

  // Guests can reach this screen only via a direct deep link (every in-app
  // button that opens it already checks auth first) — guard it anyway so a
  // guest doesn't fill out the whole form before hitting a 401 at submit.
  if (!user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          {router.canGoBack() && (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityRole="button">
              <Ionicons name="arrow-back" size={22} color={Colors.primary[600]} />
            </TouchableOpacity>
          )}
          <AppText variant="h3" weight="bold">
            Post New Property
          </AppText>
        </View>
        <View style={styles.guestContainer}>
          <Ionicons name="lock-closed-outline" size={56} color={Colors.gray[300]} />
          <AppText variant="h4" weight="bold" align="center" style={styles.guestTitle}>
            Sign in to post a listing
          </AppText>
          <AppButton onPress={() => router.push('/signin' as Href)} style={styles.guestButton}>
            Sign In
          </AppButton>
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
          {isEdit ? 'Edit Listing' : 'Post New Property'}
        </AppText>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <FieldLabel>Photos</FieldLabel>
        <View style={styles.imageRow}>
          {draft.images.map((uri, index) => (
            <View key={`${uri.slice(0, 24)}-${index}`} style={styles.imageThumbWrap}>
              <Image source={{ uri }} style={styles.imageThumb} />
              <TouchableOpacity style={styles.removeImageButton} onPress={() => handleRemoveImage(index)}>
                <Ionicons name="close" size={14} color={Colors.text.inverse} />
              </TouchableOpacity>
            </View>
          ))}
          {draft.images.length < MAX_IMAGES && (
            <TouchableOpacity style={styles.addImageButton} onPress={handleAddImages}>
              <Ionicons name="camera-outline" size={22} color={Colors.primary[500]} />
              <AppText variant="caption" color="brand">
                Add
              </AppText>
            </TouchableOpacity>
          )}
        </View>

        <FieldLabel>Title</FieldLabel>
        <TextInput
          value={draft.title}
          onChangeText={t => patch({ title: t })}
          placeholder="e.g. Spacious 3 Bed Flat in DHA Phase 6"
          placeholderTextColor={Colors.gray[500]}
          style={styles.input}
        />

        <FieldLabel>Listing Type</FieldLabel>
        <View style={styles.pillRow}>
          {LISTING_TYPES.map(type => (
            <Pill key={type} label={type} active={draft.listingType === type} onPress={() => patch({ listingType: type })} />
          ))}
        </View>

        <FieldLabel>Property Category</FieldLabel>
        <View style={styles.pillRow}>
          {PROPERTY_CATEGORIES.map(cat => (
            <Pill key={cat} label={cat} active={draft.propertyCategory === cat} onPress={() => patch({ propertyCategory: cat })} />
          ))}
        </View>

        <View style={styles.rowSplit}>
          <View style={styles.flex1}>
            <FieldLabel>Price (PKR)</FieldLabel>
            <TextInput
              value={draft.price ? String(draft.price) : ''}
              onChangeText={t => patch({ price: parseInt(t, 10) || 0 })}
              keyboardType="numeric"
              placeholder="5000000"
              placeholderTextColor={Colors.gray[500]}
              style={styles.input}
            />
          </View>
          <View style={styles.flex1}>
            <FieldLabel>Area Size</FieldLabel>
            <TextInput
              value={draft.areaSize ? String(draft.areaSize) : ''}
              onChangeText={t => patch({ areaSize: parseInt(t, 10) || 0 })}
              keyboardType="numeric"
              placeholder="500"
              placeholderTextColor={Colors.gray[500]}
              style={styles.input}
            />
          </View>
        </View>

        <FieldLabel>Area Unit</FieldLabel>
        <View style={styles.pillRow}>
          {AREA_UNITS.map(unit => (
            <Pill key={unit} label={unit} active={draft.areaUnit === unit} onPress={() => patch({ areaUnit: unit })} />
          ))}
        </View>

        <FieldLabel>City</FieldLabel>
        <TextInput
          value={draft.address.city}
          onChangeText={t => patchAddress({ city: t })}
          placeholder="Karachi"
          placeholderTextColor={Colors.gray[500]}
          style={styles.input}
        />

        <FieldLabel>Area / Neighborhood</FieldLabel>
        <TextInput
          value={draft.address.area}
          onChangeText={t => patchAddress({ area: t })}
          placeholder="DHA Phase 6"
          placeholderTextColor={Colors.gray[500]}
          style={styles.input}
        />

        <FieldLabel>Street Address</FieldLabel>
        <TextInput
          value={draft.address.line1}
          onChangeText={t => patchAddress({ line1: t })}
          placeholder="Street 5, House 12"
          placeholderTextColor={Colors.gray[500]}
          style={styles.input}
        />

        <FieldLabel>Postal Code (optional)</FieldLabel>
        <TextInput
          value={draft.address.postalCode}
          onChangeText={t => patchAddress({ postalCode: t })}
          placeholder="75500"
          placeholderTextColor={Colors.gray[500]}
          style={styles.input}
          keyboardType="numeric"
        />

        <FieldLabel>Location on Map</FieldLabel>
        <AppText variant="caption" color="muted" style={styles.mapHint}>
          Tap the map to drop a pin at the property's exact location.
        </AppText>
        <View style={styles.mapWrap}>
          <MapView
            style={styles.flex1}
            initialRegion={mapRegion}
            markers={mapMarkers}
            onPress={handleMapPress}
          />
        </View>
        {hasLocation && (
          <AppText variant="caption" color="secondary" style={styles.coordsText}>
            {draft.address.latitude.toFixed(5)}, {draft.address.longitude.toFixed(5)}
          </AppText>
        )}

        <View style={styles.rowSplit}>
          <View style={styles.flex1}>
            <FieldLabel>Bedrooms</FieldLabel>
            <TextInput
              value={String(draft.bedrooms)}
              onChangeText={t => patch({ bedrooms: parseInt(t, 10) || 0 })}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
          <View style={styles.flex1}>
            <FieldLabel>Bathrooms</FieldLabel>
            <TextInput
              value={String(draft.bathrooms)}
              onChangeText={t => patch({ bathrooms: parseInt(t, 10) || 0 })}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.rowSplit}>
          <View style={styles.flex1}>
            <FieldLabel>Floor Level (optional)</FieldLabel>
            <TextInput
              value={draft.floorLevel !== null ? String(draft.floorLevel) : ''}
              onChangeText={t => patch({ floorLevel: t ? parseInt(t, 10) || 0 : null })}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
          <View style={styles.flex1}>
            <FieldLabel>Year Built</FieldLabel>
            <TextInput
              value={String(draft.yearBuilt)}
              onChangeText={t => patch({ yearBuilt: parseInt(t, 10) || new Date().getFullYear() })}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
        </View>

        <FieldLabel>Furnishing</FieldLabel>
        <View style={styles.pillRow}>
          {FURNISHING_TYPES.map(f => (
            <Pill key={f} label={f} active={draft.furnishing === f} onPress={() => patch({ furnishing: f })} />
          ))}
        </View>

        <FieldLabel>Condition</FieldLabel>
        <View style={styles.pillRow}>
          {CONDITIONS.map(c => (
            <Pill key={c} label={c} active={draft.propertyCondition === c} onPress={() => patch({ propertyCondition: c })} />
          ))}
        </View>

        <FieldLabel>Parking Spaces</FieldLabel>
        <TextInput
          value={String(draft.parkingSpaces)}
          onChangeText={t => patch({ parkingSpaces: parseInt(t, 10) || 0 })}
          keyboardType="numeric"
          style={styles.input}
        />

        <FieldLabel>Water Supply</FieldLabel>
        <View style={styles.pillRow}>
          {WATER_SUPPLY.map(w => (
            <Pill key={w} label={w} active={draft.waterSupply === w} onPress={() => patch({ waterSupply: w })} />
          ))}
        </View>

        <FieldLabel>Electricity Backup</FieldLabel>
        <View style={styles.pillRow}>
          {ELECTRICITY_BACKUP.map(e => (
            <Pill key={e} label={e} active={draft.electricityBackup === e} onPress={() => patch({ electricityBackup: e })} />
          ))}
        </View>

        <FieldLabel>Amenities</FieldLabel>
        <View style={styles.pillRow}>
          {AMENITY_OPTIONS.map(a => (
            <Pill key={a} label={a} active={draft.amenities.includes(a)} onPress={() => patch({ amenities: toggleInList(draft.amenities, a) })} />
          ))}
        </View>

        <FieldLabel>Features</FieldLabel>
        <View style={styles.pillRow}>
          {FEATURE_OPTIONS.map(f => (
            <Pill key={f} label={f} active={draft.features.includes(f)} onPress={() => patch({ features: toggleInList(draft.features, f) })} />
          ))}
        </View>

        <FieldLabel>Description</FieldLabel>
        <TextInput
          value={draft.description}
          onChangeText={t => patch({ description: t })}
          placeholder="Describe the property…"
          placeholderTextColor={Colors.gray[500]}
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={5}
        />

        <FieldLabel>Contact Phone</FieldLabel>
        <TextInput
          value={draft.contactPhone}
          onChangeText={t => patch({ contactPhone: t })}
          placeholder="+923001234567"
          placeholderTextColor={Colors.gray[500]}
          style={styles.input}
          keyboardType="phone-pad"
        />

        {user?.role === 'agent' && (
          <>
            <FieldLabel>Agency Name (optional)</FieldLabel>
            <TextInput
              value={draft.agencyName ?? ''}
              onChangeText={t => patch({ agencyName: t || undefined })}
              placeholder="Prime Estates"
              placeholderTextColor={Colors.gray[500]}
              style={styles.input}
            />
          </>
        )}

        {error && (
          <AppText variant="bodySmall" color="error" style={styles.errorText}>
            {error}
          </AppText>
        )}

        <AppButton onPress={handleSubmit} style={styles.submitButton} isDisabled={submitting}>
          {submitting ? <ActivityIndicator color={Colors.text.inverse} /> : isEdit ? 'Save Changes' : 'Post Listing'}
        </AppButton>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.secondary },
  flex1: { flex: 1 },
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
  scrollContent: { padding: Spacing.md, paddingBottom: Spacing.xxl },

  guestContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  guestTitle: { marginTop: Spacing.lg, marginBottom: Spacing.lg },
  guestButton: { minWidth: 200 },

  fieldLabel: { marginTop: Spacing.md, marginBottom: Spacing.xs },
  input: {
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    fontSize: 15,
    color: Colors.text.primary,
    backgroundColor: Colors.background.card,
  },
  textArea: { minHeight: 100, textAlignVertical: 'top' },

  rowSplit: { flexDirection: 'row', gap: Spacing.sm },

  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.background.card,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  pillActive: { backgroundColor: Colors.primary[500], borderColor: Colors.primary[500] },

  imageRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  imageThumbWrap: { position: 'relative', width: 80, height: 80 },
  imageThumb: { width: 80, height: 80, borderRadius: BorderRadius.md, backgroundColor: Colors.gray[100] },
  removeImageButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.error[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.primary[300],
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },

  mapHint: { marginBottom: Spacing.xs },
  mapWrap: { height: 220, borderRadius: BorderRadius.md, overflow: 'hidden', ...Shadows.sm },
  coordsText: { marginTop: Spacing.xs },

  errorText: { marginTop: Spacing.md, textAlign: 'center' },
  submitButton: { marginTop: Spacing.xl },
});

export default PostListingScreen;
