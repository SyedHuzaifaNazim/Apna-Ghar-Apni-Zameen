import { LocationCoords } from './locationService';

export interface MapMarker {
  id: number | string;
  coordinate: LocationCoords;
  title: string;
  description?: string;
  type?: string;
  propertyData?: any;
  color?: string;
}

export interface MapCluster {
  id: string;
  coordinate: LocationCoords;
  count: number;
  markers: MapMarker[];
}

export interface MapBounds {
  northEast: LocationCoords;
  southWest: LocationCoords;
}

class MapService {
  clusterMarkers(markers: MapMarker[], bounds: MapBounds, zoom: number): MapCluster[] {
    if (zoom > 14) {
      return markers.map(marker => ({
        id: `cluster_${marker.id}`,
        coordinate: marker.coordinate,
        count: 1,
        markers: [marker],
      }));
    }

    // Very lightweight clustering: group by rounded coordinates
    const clusterMap: Record<string, MapCluster> = {};
    markers.forEach(marker => {
      const latBucket = marker.coordinate.latitude.toFixed(2);
      const lngBucket = marker.coordinate.longitude.toFixed(2);
      const key = `${latBucket}_${lngBucket}`;

      if (!clusterMap[key]) {
        clusterMap[key] = {
          id: key,
          coordinate: marker.coordinate,
          count: 0,
          markers: [],
        };
      }

      clusterMap[key].markers.push(marker);
      clusterMap[key].count += 1;
    });

    return Object.values(clusterMap);
  }

  calculateBoundsForMarkers(markers: MapMarker[]): MapBounds {
    const lats = markers.map(marker => marker.coordinate.latitude);
    const lngs = markers.map(marker => marker.coordinate.longitude);

    return {
      northEast: { latitude: Math.max(...lats), longitude: Math.max(...lngs) },
      southWest: { latitude: Math.min(...lats), longitude: Math.min(...lngs) },
    };
  }

  async calculateRoute(origin: LocationCoords, destination: LocationCoords) {
    const distance =
      Math.sqrt(
        (origin.latitude - destination.latitude) ** 2 +
          (origin.longitude - destination.longitude) ** 2
      ) * 111; // rough km conversion

    return {
      distance,
      duration: distance / 40 * 60, // minutes at ~40km/h
    };
  }

  isLocationInArea(coords: LocationCoords, bounds: MapBounds) {
    return (
      coords.latitude <= bounds.northEast.latitude &&
      coords.latitude >= bounds.southWest.latitude &&
      coords.longitude <= bounds.northEast.longitude &&
      coords.longitude >= bounds.southWest.longitude
    );
  }
}

export const mapService = new MapService();
