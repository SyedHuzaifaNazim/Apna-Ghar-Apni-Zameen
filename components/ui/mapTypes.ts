/**
 * Shared between the native (WebView + Leaflet) and web (react-leaflet)
 * MapView implementations — both render OpenStreetMap tiles, no API key
 * required. See MapView.tsx for how to swap back to react-native-maps +
 * Google Maps once a Maps API key is available.
 */
export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface MapPropertyMarker {
  id: number;
  latitude: number;
  longitude: number;
  /** Pre-formatted via lib/format.ts so both map implementations render identical labels. */
  label: string;
  /** Pre-resolved from Colors by listing type — keeps color logic in one place (MapMarker.tsx). */
  color: string;
  isFeatured?: boolean;
}

export interface FitToCoordinatesOptions {
  edgePadding?: { top: number; right: number; bottom: number; left: number };
  animated?: boolean;
}

export interface MapViewHandle {
  fitToCoordinates: (coordinates: { latitude: number; longitude: number }[], options?: FitToCoordinatesOptions) => void;
  animateToRegion: (region: Region) => void;
}
