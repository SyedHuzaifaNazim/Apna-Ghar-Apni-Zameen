import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { Region } from 'react-native-maps';
import { analyticsService } from '../services/analyticsService';
import { LocationCoords, locationService } from '../services/locationService';
import { MapBounds, MapCluster, MapMarker, mapService } from '../services/mapService';

interface UseMapReturn {
  // Map state
  region: Region;
  markers: MapMarker[];
  clusters: MapCluster[];
  selectedMarker: MapMarker | null;
  
  // Map interactions
  zoom: number;
  isClustering: boolean;
  
  // Actions
  setRegion: (region: Region) => void;
  setZoom: (zoom: number) => void;
  setMarkers: Dispatch<SetStateAction<MapMarker[]>>;
  setIsClustering: Dispatch<SetStateAction<boolean>>;
  selectMarker: (marker: MapMarker | null) => void;
  fitToMarkers: (markers: MapMarker[]) => void;
  calculateRoute: (destination: LocationCoords) => Promise<any>;
  
  // Utilities
  createPropertyMarkers: (properties: any[]) => MapMarker[];
  getMarkerColor: (property: any) => string;
}

export const useMap = (initialRegion?: Region): UseMapReturn => {
  const [region, setRegion] = useState<Region>(initialRegion || {
    latitude: 24.8607, // Karachi
    longitude: 67.0011,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  });
  
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [clusters, setClusters] = useState<MapCluster[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [zoom, setZoom] = useState(12);
  const [isClustering, setIsClustering] = useState(true);

  const mapRef = useRef<any>(null);

  // Convert properties to map markers
  const createPropertyMarkers = useCallback((properties: any[]): MapMarker[] => {
    return properties.map(property => ({
      id: property.id,
      coordinate: {
        latitude: property.address.latitude,
        longitude: property.address.longitude,
      },
      title: property.title,
      description: `Rs ${property.price.toLocaleString()}`,
      type: 'property',
      propertyData: property,
      color: getMarkerColor(property),
    }));
  }, []);

  // Get marker color based on property attributes
  const getMarkerColor = useCallback((property: any): string => {
    if (property.isFeatured) return 'ff6b35'; // Orange for featured
    
    switch (property.listingType) {
      case 'For Sale':
        return '4CAF50'; // Green for sale
      case 'For Rent':
        return 'FF9800'; // Orange for rent
      default:
        return '2196F3'; // Blue default
    }
  }, []);

  // Cluster markers based on current region and zoom
  const updateClusters = useCallback(() => {
    if (!isClustering || markers.length === 0) {
      setClusters(markers.map(marker => ({
        id: `cluster_${marker.id}`,
        coordinate: marker.coordinate,
        count: 1,
        markers: [marker],
      })));
      return;
    }

    const bounds: MapBounds = {
      northEast: {
        latitude: region.latitude + region.latitudeDelta / 2,
        longitude: region.longitude + region.longitudeDelta / 2,
      },
      southWest: {
        latitude: region.latitude - region.latitudeDelta / 2,
        longitude: region.longitude - region.longitudeDelta / 2,
      },
    };

    const newClusters = mapService.clusterMarkers(markers, bounds, zoom);
    setClusters(newClusters);
  }, [markers, region, zoom, isClustering]);

  // Fit map to show all markers
  const fitToMarkers = useCallback((markerList: MapMarker[]) => {
    if (markerList.length === 0) return;

    const bounds = mapService.calculateBoundsForMarkers(markerList);
    
    const newRegion: Region = {
      latitude: (bounds.northEast.latitude + bounds.southWest.latitude) / 2,
      longitude: (bounds.northEast.longitude + bounds.southWest.longitude) / 2,
      latitudeDelta: Math.abs(bounds.northEast.latitude - bounds.southWest.latitude) * 1.1,
      longitudeDelta: Math.abs(bounds.northEast.longitude - bounds.southWest.longitude) * 1.1,
    };

    setRegion(newRegion);
    
    analyticsService.track('map_fit_to_markers', {
      marker_count: markerList.length,
    });
  }, []);

  // Select a marker
  const selectMarker = useCallback((marker: MapMarker | null) => {
    setSelectedMarker(marker);
    
    if (marker) {
      // Center map on selected marker
      setRegion(prev => ({
        ...prev,
        latitude: marker.coordinate.latitude,
        longitude: marker.coordinate.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }));

      analyticsService.track('map_marker_selected', {
        marker_id: marker.id,
        marker_type: marker.type,
      });
    }
  }, []);

  // Calculate route to destination
  const calculateRoute = useCallback(async (destination: LocationCoords): Promise<any> => {
    try {
      const userLocation = await locationService.getCurrentLocation();
      
      if (!userLocation) {
        throw new Error('Unable to get current location');
      }

      const route = await mapService.calculateRoute(userLocation.coords, destination);

      await analyticsService.track('route_calculated', {
        destination_lat: destination.latitude,
        destination_lng: destination.longitude,
        distance: route.distance,
        duration: route.duration,
      });

      return route;
    } catch (error) {
      await analyticsService.trackError(error as Error, {
        context: 'calculate_route',
        destination,
      });
      
      throw error;
    }
  }, []);

  // Update clusters when markers or region changes
  useEffect(() => {
    updateClusters();
  }, [markers, region, zoom, updateClusters]);

  // Estimate zoom level from region
  useEffect(() => {
    const estimatedZoom = Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2);
    setZoom(estimatedZoom);
  }, [region.longitudeDelta]);

  return {
    // Map state
    region,
    markers,
    clusters,
    selectedMarker,
    
    // Map interactions
    zoom,
    isClustering,
    
    // Actions
    setRegion,
    setZoom,
    selectMarker,
    fitToMarkers,
    calculateRoute,
    
    // Utilities
    createPropertyMarkers,
    getMarkerColor,
    setMarkers,
    setIsClustering,
  };
};

// Hook for property map with clustering
export const usePropertyMap = (properties: any[], initialRegion?: Region) => {
  const {
    region,
    markers,
    clusters,
    selectedMarker,
    zoom,
    isClustering,
    setRegion,
    setZoom,
    setMarkers,
    setIsClustering,
    selectMarker,
    fitToMarkers,
    calculateRoute,
    createPropertyMarkers,
    getMarkerColor,
  } = useMap(initialRegion);

  // Convert properties to markers when properties change
  useEffect(() => {
    const propertyMarkers = createPropertyMarkers(properties);
    setMarkers(propertyMarkers);
  }, [properties, createPropertyMarkers]);

  // Auto-fit to markers when properties load
  useEffect(() => {
    if (properties.length > 0 && markers.length > 0) {
      fitToMarkers(markers);
    }
  }, [properties.length, markers, fitToMarkers]);

  // Filter markers by criteria
  const filterMarkers = useCallback((criteria: any) => {
    const filteredProperties = properties.filter(property => {
      if (criteria.listingType && property.listingType !== criteria.listingType) return false;
      if (criteria.propertyType && property.propertyCategory !== criteria.propertyType) return false;
      if (criteria.maxPrice && property.price > criteria.maxPrice) return false;
      if (criteria.minPrice && property.price < criteria.minPrice) return false;
      return true;
    });

    const filteredMarkers = createPropertyMarkers(filteredProperties);
    setMarkers(filteredMarkers);

    analyticsService.track('map_markers_filtered', {
      filter_criteria: Object.keys(criteria),
      original_count: properties.length,
      filtered_count: filteredProperties.length,
    });
  }, [properties, createPropertyMarkers]);

  // Get properties in current viewport
  const getPropertiesInViewport = useCallback((): any[] => {
    const bounds: MapBounds = {
      northEast: {
        latitude: region.latitude + region.latitudeDelta / 2,
        longitude: region.longitude + region.longitudeDelta / 2,
      },
      southWest: {
        latitude: region.latitude - region.latitudeDelta / 2,
        longitude: region.longitude - region.longitudeDelta / 2,
      },
    };

    return properties.filter(property => 
      mapService.isLocationInArea(
        {
          latitude: property.address.latitude,
          longitude: property.address.longitude,
        },
        bounds
      )
    );
  }, [properties, region]);

  // Toggle clustering
  const toggleClustering = useCallback(() => {
    setIsClustering(prev => !prev);
    
    analyticsService.track('map_clustering_toggled', {
      clustering_enabled: !isClustering,
    });
  }, [isClustering]);

  return {
    // Inherited from useMap
    region,
    markers,
    clusters,
    selectedMarker,
    zoom,
    isClustering,
    setRegion,
    setZoom,
    selectMarker,
    fitToMarkers,
    calculateRoute,
    getMarkerColor,
    
    // Property-specific
    propertiesInViewport: getPropertiesInViewport(),
    filterMarkers,
    toggleClustering,
    totalProperties: properties.length,
    visibleProperties: getPropertiesInViewport().length,
  };
};

// Hook for map search and filtering
export const useMapSearch = (allProperties: any[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mapFilters, setMapFilters] = useState<any>({});
  const [filteredProperties, setFilteredProperties] = useState<any[]>(allProperties);

  // Filter properties based on search and filters
  useEffect(() => {
    let filtered = allProperties;

    // Apply search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(property => {
        const searchableText = `
          ${property.title?.toLowerCase() || ''}
          ${property.address?.line1?.toLowerCase() || ''}
          ${property.address?.city?.toLowerCase() || ''}
          ${property.propertyCategory?.toLowerCase() || ''}
        `;
        return searchableText.includes(searchQuery.toLowerCase());
      });
    }

    // Apply map filters
    if (mapFilters.listingType) {
      filtered = filtered.filter(property => property.listingType === mapFilters.listingType);
    }
    if (mapFilters.propertyType) {
      filtered = filtered.filter(property => property.propertyCategory === mapFilters.propertyType);
    }
    if (mapFilters.minPrice) {
      filtered = filtered.filter(property => property.price >= mapFilters.minPrice);
    }
    if (mapFilters.maxPrice) {
      filtered = filtered.filter(property => property.price <= mapFilters.maxPrice);
    }

    setFilteredProperties(filtered);

    analyticsService.track('map_search_performed', {
      query: searchQuery,
      filter_count: Object.keys(mapFilters).length,
      result_count: filtered.length,
    });
  }, [allProperties, searchQuery, mapFilters]);

  const updateSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const updateMapFilters = useCallback((filters: any) => {
    setMapFilters(filters);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setMapFilters({});
    
    analyticsService.track('map_search_cleared');
  }, []);

  return {
    searchQuery,
    mapFilters,
    filteredProperties,
    updateSearchQuery,
    updateMapFilters,
    clearSearch,
  };
};

export default useMap;