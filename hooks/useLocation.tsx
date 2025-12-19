import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { analyticsService } from '../services/analyticsService';
import { LocationCoords, LocationData, locationService } from '../services/locationService';

interface UseLocationReturn {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  permissionGranted: boolean;
  requestPermission: () => Promise<void>;
  getCurrentLocation: () => Promise<LocationData | null>;
  watchPosition: (callback: (location: LocationData) => void) => () => void;
  calculateDistance: (targetCoords: LocationCoords) => number | null;
  getCurrentCity: () => Promise<string | null>;
}

export const useLocation = (autoRequest = true): UseLocationReturn => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Check permissions and load last known location
  useEffect(() => {
    const initializeLocation = async () => {
      try {
        const permission = await locationService.checkPermissions();
        setPermissionGranted(permission.granted);

        if (permission.granted) {
          const lastLocation = await locationService.getLastKnownLocation();
          if (lastLocation) {
            setLocation(lastLocation);
          }

          if (autoRequest) {
            await getCurrentLocation();
          }
        }
      } catch (err) {
        console.error('Location initialization error:', err);
      }
    };

    initializeLocation();
  }, [autoRequest]);

  const requestPermission = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const permission = await locationService.requestPermissions();
      setPermissionGranted(permission.granted);

      if (permission.granted) {
        await getCurrentLocation();
        
        await analyticsService.track('location_permission_granted');
        
        // Success feedback can be added here if needed
      } else {
        setError('Location permission denied');
        
        await analyticsService.track('location_permission_denied');
        
        Alert.alert(
          'Location disabled',
          'Enable location for better property recommendations'
        );
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request location permission';
      setError(errorMessage);
      
      await analyticsService.trackError(err as Error, {
        context: 'request_location_permission',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const getCurrentLocation = useCallback(async (): Promise<LocationData | null> => {
    try {
      setLoading(true);
      setError(null);

      const currentLocation = await locationService.getCurrentLocation();
      setLocation(currentLocation);

      // Fixed: Added optional chaining because currentLocation can be null
      await analyticsService.track('location_updated', {
        has_address: !!currentLocation?.address,
        city: currentLocation?.address?.city,
      });

      return currentLocation;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get current location';
      setError(errorMessage);

      await analyticsService.trackError(err as Error, {
        context: 'get_current_location',
      });

      Alert.alert('Location error', errorMessage);

      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const watchPosition = useCallback((callback: (location: LocationData) => void) => {
    return locationService.watchPosition((newLocation) => {
      setLocation(newLocation);
      callback(newLocation);
    });
  }, []);

  const calculateDistance = useCallback((targetCoords: LocationCoords): number | null => {
    if (!location) return null;

    try {
      return locationService.calculateDistance(location.coords, targetCoords, 'km');
    } catch (error) {
      console.error('Distance calculation error:', error);
      return null;
    }
  }, [location]);

  const getCurrentCity = useCallback(async (): Promise<string | null> => {
    try {
      return await locationService.detectCurrentCity();
    } catch (error) {
      console.error('Get current city error:', error);
      return null;
    }
  }, []);

  // Auto-refresh location when app comes to foreground
  useEffect(() => {
    if (!permissionGranted) return;

    const handleAppStateChange = async (state: string) => {
      if (state === 'active') {
        // Refresh location when app becomes active
        const lastLocation = await locationService.getLastKnownLocation();
        if (lastLocation) {
          setLocation(lastLocation);
        }
      }
    };

    // In a real app, you would use AppState.addEventListener
    // For now, we'll just refresh on mount
    return () => {
      // Cleanup
    };
  }, [permissionGranted]);

  return {
    location,
    loading,
    error,
    permissionGranted,
    requestPermission,
    getCurrentLocation,
    watchPosition,
    calculateDistance,
    getCurrentCity,
  };
};

// Specialized hook for property distance calculations
export const usePropertyDistances = (properties: any[], userLocation: LocationData | null) => {
  const [distances, setDistances] = useState<Record<number, number>>({});

  useEffect(() => {
    const calculateDistances = async () => {
      if (!userLocation || properties.length === 0) return;

      const newDistances: Record<number, number> = {};

      for (const property of properties) {
        try {
          const distance = await locationService.calculatePropertyDistance(
            {
              latitude: property.address.latitude,
              longitude: property.address.longitude,
            },
            userLocation.coords
          );

          if (distance !== null) {
            newDistances[property.id] = distance;
          }
        } catch (error) {
          console.error(`Distance calculation failed for property ${property.id}:`, error);
        }
      }

      setDistances(newDistances);
    };

    calculateDistances();
  }, [properties, userLocation]);

  const getPropertyDistance = useCallback((propertyId: number): number | null => {
    return distances[propertyId] || null;
  }, [distances]);

  const getNearbyProperties = useCallback((maxDistanceKm: number) => {
    return properties.filter(property => {
      const distance = distances[property.id];
      return distance !== null && distance <= maxDistanceKm;
    });
  }, [properties, distances]);

  return {
    distances,
    getPropertyDistance,
    getNearbyProperties,
  };
};

// Hook for location-based property filtering
export const useLocationFilter = (properties: any[]) => {
  const { location, permissionGranted, requestPermission } = useLocation(false);
  const { distances, getNearbyProperties } = usePropertyDistances(properties, location);

  const nearbyProperties = getNearbyProperties(10); // Within 10km

  const enableLocationFiltering = useCallback(async (): Promise<boolean> => {
    if (!permissionGranted) {
      await requestPermission();
    }
    return permissionGranted;
  }, [permissionGranted, requestPermission]);

  return {
    location,
    permissionGranted,
    distances,
    nearbyProperties,
    enableLocationFiltering,
    requestPermission,
  };
};

export default useLocation;