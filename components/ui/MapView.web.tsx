import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import L, { Map as LeafletMap } from 'leaflet';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';

import { Colors } from '@/constants/Colors';
import type { FitToCoordinatesOptions, MapPropertyMarker, MapViewHandle, Region } from './mapTypes';

export type { FitToCoordinatesOptions, MapPropertyMarker, MapViewHandle, Region };

/**
 * Web map via react-leaflet + OpenStreetMap tiles — no API key required.
 * Replaces the old "interactive web maps aren't available" placeholder now
 * that OSM covers all three platforms with one free tile source.
 */

interface MapViewProps {
  style?: StyleProp<ViewStyle>;
  initialRegion: Region;
  showsUserLocation?: boolean;
  showsMyLocationButton?: boolean;
  onPress?: (coords?: { latitude: number; longitude: number }) => void;
  markers: MapPropertyMarker[];
  selectedMarkerId?: number | null;
  onMarkerPress?: (id: number) => void;
}

const LEAFLET_CSS_ID = 'leaflet-css-cdn';

const ensureLeafletCss = () => {
  if (typeof document === 'undefined' || document.getElementById(LEAFLET_CSS_ID)) return;
  const link = document.createElement('link');
  link.id = LEAFLET_CSS_ID;
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  document.head.appendChild(link);
};

const buildMarkerIcon = (marker: MapPropertyMarker, isSelected: boolean) =>
  L.divIcon({
    className: '',
    html: `<div style="
      background:${marker.color};
      color:#fff;
      border-radius:14px;
      padding:4px 8px;
      font-size:11px;
      font-weight:700;
      white-space:nowrap;
      box-shadow:0 1px 4px rgba(0,0,0,0.35);
      border:2px solid #fff;
      transform:translate(-50%, -100%) scale(${isSelected ? 1.2 : 1});
      ${marker.isFeatured ? 'outline:2px solid #FBBF24;' : ''}
      font-family:-apple-system, Roboto, sans-serif;
    ">${marker.label}</div>`,
    iconSize: [0, 0],
  });

const userDotIcon = L.divIcon({
  className: '',
  html: `<div style="width:14px;height:14px;border-radius:7px;background:#4285F4;border:2px solid #fff;box-shadow:0 0 4px rgba(0,0,0,0.4);"></div>`,
  iconSize: [14, 14],
});

const ClickHandler: React.FC<{ onPress?: (coords?: { latitude: number; longitude: number }) => void }> = ({
  onPress,
}) => {
  useMapEvents({ click: e => onPress?.({ latitude: e.latlng.lat, longitude: e.latlng.lng }) });
  return null;
};

const MapViewWeb = forwardRef<MapViewHandle, MapViewProps>(
  ({ style, initialRegion, showsUserLocation, showsMyLocationButton, onPress, markers, selectedMarkerId, onMarkerPress }, ref) => {
    const mapRef = useRef<LeafletMap | null>(null);
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

    useEffect(ensureLeafletCss, []);

    useImperativeHandle(
      ref,
      () => ({
        fitToCoordinates: (coordinates, options: FitToCoordinatesOptions = {}) => {
          if (!mapRef.current || coordinates.length === 0) return;
          const bounds = L.latLngBounds(coordinates.map(c => [c.latitude, c.longitude]));
          const padding = options.edgePadding ?? { top: 0, right: 0, bottom: 0, left: 0 };
          mapRef.current.fitBounds(bounds, {
            paddingTopLeft: [padding.left, padding.top],
            paddingBottomRight: [padding.right, padding.bottom],
            animate: options.animated ?? true,
          });
        },
        animateToRegion: region => {
          mapRef.current?.setView([region.latitude, region.longitude]);
        },
      }),
      []
    );

    const handleLocateMe = useCallback(async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status !== 'granted') return;
        const position = await Location.getCurrentPositionAsync({});
        const coords = { latitude: position.coords.latitude, longitude: position.coords.longitude };
        setUserLocation(coords);
        mapRef.current?.panTo([coords.latitude, coords.longitude]);
      } catch {
        // Location unavailable — no-op.
      }
    }, []);

    useEffect(() => {
      if (!showsUserLocation) return;
      let cancelled = false;

      (async () => {
        try {
          const { status } = await Location.getForegroundPermissionsAsync();
          if (cancelled || status !== 'granted') return;
          const position = await Location.getCurrentPositionAsync({});
          if (cancelled) return;
          const coords = { latitude: position.coords.latitude, longitude: position.coords.longitude };
          setUserLocation(coords);
          mapRef.current?.panTo([coords.latitude, coords.longitude]);
        } catch {
          // Location unavailable — no-op.
        }
      })();

      return () => {
        cancelled = true;
      };
    }, [showsUserLocation]);

    const zoom = Math.max(2, Math.min(19, Math.round(Math.log2(360 / initialRegion.longitudeDelta))));

    return (
      <View style={[styles.container, style]}>
        <MapContainer
          ref={mapRef}
          center={[initialRegion.latitude, initialRegion.longitude]}
          zoom={zoom}
          zoomControl={false}
          attributionControl={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={19} />
          <ClickHandler onPress={onPress} />

          {markers.map(marker => (
            <Marker
              key={marker.id}
              position={[marker.latitude, marker.longitude]}
              icon={buildMarkerIcon(marker, String(marker.id) === String(selectedMarkerId))}
              eventHandlers={{ click: () => onMarkerPress?.(marker.id) }}
            />
          ))}

          {userLocation && <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userDotIcon} />}
        </MapContainer>

        {showsMyLocationButton && (
          <TouchableOpacity
            style={styles.locateButton}
            onPress={handleLocateMe}
            accessibilityRole="button"
            accessibilityLabel="Center on my location"
          >
            <Ionicons name="locate" size={20} color={Colors.primary[600]} />
          </TouchableOpacity>
        )}
      </View>
    );
  }
);

MapViewWeb.displayName = 'MapViewWeb';

const styles = StyleSheet.create({
  container: { flex: 1 },
  locateButton: {
    position: 'absolute',
    right: 12,
    bottom: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
});

export default MapViewWeb;
