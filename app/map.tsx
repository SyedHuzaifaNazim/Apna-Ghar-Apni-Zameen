import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FilterModal from '@/components/ui/FilterModal';
import { getMarkerColor } from '@/components/ui/MapMarker';
import MapView from '@/components/ui/MapView';
import type { MapPropertyMarker, MapViewHandle, Region } from '@/components/ui/mapTypes';
import PropertyCard from '@/components/ui/PropertyCard';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Shadows, Spacing } from '@/constants/Layout';
import { useFetchProperties } from '@/hooks/useFetchProperties';
import { useFilterProperties } from '@/hooks/useFilterProperties';
import { formatPrice } from '@/lib/format';
import type { Property } from '@/types/property';

const DEFAULT_REGION: Region = {
  latitude: 24.8607,
  longitude: 67.0011,
  latitudeDelta: 0.2,
  longitudeDelta: 0.2,
};

const MapScreen = () => {
  // Map pins want the whole pool at once, not one infinite-scroll page at a time.
  const { properties } = useFetchProperties({ paginate: false });
  const router = useRouter();
  const mapRef = useRef<MapViewHandle>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);

  // Declaring the permission in app.config.js only lists it for install-time
  // review — it still has to be requested at runtime before the "my location"
  // blue dot / button will do anything.
  useEffect(() => {
    Location.requestForegroundPermissionsAsync()
      .then(({ status }) => setLocationGranted(status === 'granted'))
      .catch(() => setLocationGranted(false));
  }, []);

  const { filteredProperties: filterResults, activeFilters, filterCount, updateFilters } =
    useFilterProperties(properties);

  const searched = useMemo(() => {
    if (!searchQuery) return filterResults;
    const query = searchQuery.toLowerCase();
    return filterResults.filter(
      property =>
        property.title.toLowerCase().includes(query) ||
        property.address.city.toLowerCase().includes(query) ||
        property.address.line1.toLowerCase().includes(query) ||
        property.address.area.toLowerCase().includes(query)
    );
  }, [filterResults, searchQuery]);

  const initialRegion: Region = useMemo(() => {
    if (properties.length === 0) return DEFAULT_REGION;

    const latitudes = properties.map(p => p.address.latitude);
    const longitudes = properties.map(p => p.address.longitude);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max((maxLat - minLat) * 1.5, 0.05),
      longitudeDelta: Math.max((maxLng - minLng) * 1.5, 0.05),
    };
  }, [properties]);

  useEffect(() => {
    if (searched.length > 0 && mapRef.current?.fitToCoordinates) {
      const coordinates = searched.map(p => ({
        latitude: p.address.latitude,
        longitude: p.address.longitude,
      }));

      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 100, right: 50, bottom: 200, left: 50 },
        animated: true,
      });
    }
  }, [searched]);

  const markers = useMemo<MapPropertyMarker[]>(
    () =>
      searched.map(property => ({
        id: property.id,
        latitude: property.address.latitude,
        longitude: property.address.longitude,
        label: formatPrice(property.price),
        color: getMarkerColor(property.listingType),
        isFeatured: property.isFeatured,
      })),
    [searched]
  );

  const handleMarkerPress = (id: number) => {
    const property = searched.find(p => p.id === id);
    if (property) setSelectedProperty(property);
  };

  return (
    <SafeAreaView style={styles.flex1} edges={[]}>
      <View style={styles.searchBar}>
        <View style={styles.searchBarRow}>
          <View style={styles.inputContainer}>
            <Ionicons name="search" size={20} color={Colors.gray[500]} style={styles.inputIcon} />
            <TextInput
              placeholder="Search city, area, or property..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.input}
              placeholderTextColor={Colors.gray[500]}
            />
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Open filters"
          >
            <Ionicons name="options-outline" size={22} color={Colors.text.inverse} />
            {filterCount > 0 && <View style={styles.filterDot} />}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.flex1}>
        <MapView
          ref={mapRef}
          style={styles.flex1}
          initialRegion={initialRegion}
          showsUserLocation={locationGranted}
          showsMyLocationButton={locationGranted}
          onPress={() => setSelectedProperty(null)}
          markers={markers}
          selectedMarkerId={selectedProperty?.id ?? null}
          onMarkerPress={handleMarkerPress}
        />
      </View>

      {selectedProperty && (
        <View style={styles.cardContainer}>
          <View style={styles.closeButtonContainer}>
            <TouchableOpacity
              onPress={() => setSelectedProperty(null)}
              style={styles.closeButton}
              activeOpacity={0.9}
              accessibilityRole="button"
              accessibilityLabel="Close property preview"
            >
              <Ionicons name="close" size={20} color={Colors.gray[600]} />
            </TouchableOpacity>
          </View>

          <PropertyCard
            property={selectedProperty}
            variant="default"
            onPress={p => router.push({ pathname: '/listing/[id]', params: { id: String(p.id) } })}
          />
        </View>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex1: { flex: 1, backgroundColor: Colors.background.card },
  searchBar: { position: 'absolute', top: Spacing.md, left: 0, right: 0, paddingHorizontal: Spacing.md, zIndex: 10 },
  searchBarRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.lg,
    height: 50,
    ...Shadows.md,
  },
  inputIcon: { marginLeft: Spacing.md },
  input: { flex: 1, height: '100%', fontSize: 16, paddingHorizontal: Spacing.sm, color: Colors.text.primary },
  filterButton: {
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.lg,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.md,
  },
  filterDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error[500],
  },
  cardContainer: { position: 'absolute', bottom: Spacing.xl, left: 0, right: 0, zIndex: 100 },
  closeButtonContainer: { alignItems: 'flex-end', paddingHorizontal: Spacing.lg, marginBottom: -15, zIndex: 101 },
  closeButton: {
    backgroundColor: Colors.background.card,
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
});

export default MapScreen;
