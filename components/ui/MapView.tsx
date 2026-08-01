import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

import { Colors } from '@/constants/Colors';
import type { FitToCoordinatesOptions, MapPropertyMarker, MapViewHandle, Region } from './mapTypes';

export type { FitToCoordinatesOptions, MapPropertyMarker, MapViewHandle, Region };

/**
 * Native map rendered via a WebView + Leaflet.js, tiled by OpenStreetMap —
 * no API key required. Chosen as a stopgap because a Google Maps API key
 * wasn't available yet.
 *
 * To swap back to native Google Maps once a key exists: replace this file's
 * contents with `export { default, Marker, PROVIDER_GOOGLE, Region } from
 * 'react-native-maps';` and restore the <Marker><MapMarker .../></Marker>
 * children pattern in app/map.tsx (MapMarker.tsx was kept for exactly this).
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

const regionToZoom = (region: Region): number => {
  const zoom = Math.log2(360 / region.longitudeDelta);
  return Math.max(2, Math.min(19, Math.round(zoom)));
};

const buildHtml = (region: Region) => `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<style>
  html, body, #map { height: 100%; margin: 0; padding: 0; background: #E6F4FE; }
  .price-marker { color: #fff; border-radius: 14px; padding: 4px 8px; font-size: 11px; font-weight: 700; white-space: nowrap; box-shadow: 0 1px 4px rgba(0,0,0,0.35); border: 2px solid #fff; transform: translate(-50%, -100%); font-family: -apple-system, Roboto, sans-serif; }
  .price-marker.featured { outline: 2px solid #FBBF24; }
  .user-dot { width: 14px; height: 14px; border-radius: 7px; background: #4285F4; border: 2px solid #fff; box-shadow: 0 0 4px rgba(0,0,0,0.4); }
</style>
</head>
<body>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  const map = L.map('map', { zoomControl: false, attributionControl: false })
    .setView([${region.latitude}, ${region.longitude}], ${regionToZoom(region)});
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

  let markerLayer = L.layerGroup().addTo(map);
  let userMarker = null;

  function post(msg) {
    window.ReactNativeWebView.postMessage(JSON.stringify(msg));
  }

  map.on('click', (e) => post({ type: 'mapPress', latitude: e.latlng.lat, longitude: e.latlng.lng }));

  function renderMarkers(markers, selectedId) {
    markerLayer.clearLayers();
    markers.forEach(function (m) {
      const selected = String(m.id) === String(selectedId);
      const html = '<div class="price-marker' + (m.isFeatured ? ' featured' : '') + '" style="background:' + m.color + ';' +
        (selected ? 'transform:translate(-50%,-100%) scale(1.2);' : '') + '">' + m.label + '</div>';
      const icon = L.divIcon({ className: '', html: html, iconSize: [0, 0] });
      const marker = L.marker([m.latitude, m.longitude], { icon: icon }).addTo(markerLayer);
      marker.on('click', function (e) {
        L.DomEvent.stopPropagation(e);
        post({ type: 'markerPress', id: m.id });
      });
    });
  }

  function fitBounds(coords, padding) {
    if (!coords.length) return;
    const bounds = L.latLngBounds(coords.map(function (c) { return [c.latitude, c.longitude]; }));
    map.fitBounds(bounds, {
      paddingTopLeft: [padding.left, padding.top],
      paddingBottomRight: [padding.right, padding.bottom],
      animate: true,
    });
  }

  function setUserLocation(lat, lng) {
    if (userMarker) map.removeLayer(userMarker);
    userMarker = L.marker([lat, lng], { icon: L.divIcon({ className: '', html: '<div class="user-dot"></div>', iconSize: [14, 14] }) }).addTo(map);
  }

  function panTo(lat, lng) {
    map.panTo([lat, lng]);
  }

  post({ type: 'ready' });
</script>
</body>
</html>`;

const MapViewImpl = forwardRef<MapViewHandle, MapViewProps>(
  ({ style, initialRegion, showsUserLocation, showsMyLocationButton, onPress, markers, selectedMarkerId, onMarkerPress }, ref) => {
    const webViewRef = useRef<WebView>(null);
    const [isReady, setIsReady] = useState(false);
    const html = useRef(buildHtml(initialRegion)).current;

    const runJs = useCallback((js: string) => {
      webViewRef.current?.injectJavaScript(`${js}; true;`);
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        fitToCoordinates: (coordinates, options) => {
          const padding = options?.edgePadding ?? { top: 0, right: 0, bottom: 0, left: 0 };
          runJs(`fitBounds(${JSON.stringify(coordinates)}, ${JSON.stringify(padding)})`);
        },
        animateToRegion: region => {
          runJs(`map.setView([${region.latitude}, ${region.longitude}], ${regionToZoom(region)})`);
        },
      }),
      [runJs]
    );

    useEffect(() => {
      if (!isReady) return;
      runJs(`renderMarkers(${JSON.stringify(markers)}, ${JSON.stringify(selectedMarkerId ?? null)})`);
    }, [isReady, markers, selectedMarkerId, runJs]);

    const handleMessage = useCallback(
      (event: WebViewMessageEvent) => {
        try {
          const msg = JSON.parse(event.nativeEvent.data);
          if (msg.type === 'ready') setIsReady(true);
          else if (msg.type === 'mapPress') onPress?.({ latitude: msg.latitude, longitude: msg.longitude });
          else if (msg.type === 'markerPress') onMarkerPress?.(msg.id);
        } catch {
          // Ignore malformed bridge messages.
        }
      },
      [onPress, onMarkerPress]
    );

    const handleLocateMe = useCallback(async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status !== 'granted') return;
        const position = await Location.getCurrentPositionAsync({});
        runJs(`setUserLocation(${position.coords.latitude}, ${position.coords.longitude})`);
        runJs(`panTo(${position.coords.latitude}, ${position.coords.longitude})`);
      } catch {
        // Location unavailable — silently no-op, matches native maps' behavior.
      }
    }, [runJs]);

    // Plot the user's location once the map is ready, if permission is already granted.
    useEffect(() => {
      if (!isReady || !showsUserLocation) return;
      let cancelled = false;
      (async () => {
        if (!cancelled) await handleLocateMe();
      })();
      return () => {
        cancelled = true;
      };
    }, [isReady, showsUserLocation, handleLocateMe]);

    return (
      <View style={style}>
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html }}
          style={styles.flex1}
          onMessage={handleMessage}
          javaScriptEnabled
          domStorageEnabled
        />
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

MapViewImpl.displayName = 'MapView';

const styles = StyleSheet.create({
  flex1: { flex: 1 },
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default MapViewImpl;
