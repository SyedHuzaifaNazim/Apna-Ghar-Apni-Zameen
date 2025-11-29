export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface UserLocation {
  coords: LocationCoords;
  timestamp: number;
}

class LocationService {
  async getCurrentLocation(): Promise<UserLocation | null> {
    try {
      // Replace with expo-location in production
      return {
        coords: { latitude: 24.8607, longitude: 67.0011 },
        timestamp: Date.now(),
      };
    } catch (error) {
      console.warn('Unable to fetch location', error);
      return null;
    }
  }
}

export const locationService = new LocationService();
