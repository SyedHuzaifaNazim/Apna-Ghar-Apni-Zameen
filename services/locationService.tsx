export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface LocationAddress {
  city?: string;
  country?: string;
  line1?: string;
  postalCode?: string;
  region?: string;
  isoCountryCode?: string;
  street?: string;
  name?: string;
}

export interface LocationData {
  coords: LocationCoords;
  timestamp: number;
  address?: LocationAddress;
}

// For backward compatibility if UserLocation was used elsewhere
export type UserLocation = LocationData; 

class LocationService {
  // Mock permission check
  async checkPermissions(): Promise<{ granted: boolean }> {
    // In a real app, use: await Location.getForegroundPermissionsAsync();
    return { granted: true };
  }

  // Mock permission request
  async requestPermissions(): Promise<{ granted: boolean }> {
    // In a real app, use: await Location.requestForegroundPermissionsAsync();
    return { granted: true };
  }

  async getLastKnownLocation(): Promise<LocationData | null> {
    // In a real app, use: await Location.getLastKnownPositionAsync();
    return this.getCurrentLocation();
  }

  async getCurrentLocation(): Promise<LocationData | null> {
    try {
      // Mock data - Replace with expo-location in production
      return {
        coords: { latitude: 24.8607, longitude: 67.0011 },
        timestamp: Date.now(),
        address: {
          city: 'Karachi',
          line1: 'Clifton',
          country: 'Pakistan',
          region: 'Sindh'
        }
      };
    } catch (error) {
      console.warn('Unable to fetch location', error);
      return null;
    }
  }

  watchPosition(callback: (location: LocationData) => void): () => void {
    // Mock watch - just returns current location immediately
    this.getCurrentLocation().then(loc => {
      if (loc) callback(loc);
    });
    
    // Return cleanup function
    return () => {
      // console.log('Stopped watching position');
    };
  }

  // Haversine formula to calculate distance
  calculateDistance(
    start: LocationCoords, 
    end: LocationCoords, 
    unit: 'km' | 'miles' = 'km'
  ): number {
    const R = unit === 'km' ? 6371 : 3959; // Radius of the earth
    const dLat = this.deg2rad(end.latitude - start.latitude);
    const dLon = this.deg2rad(end.longitude - start.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(start.latitude)) * Math.cos(this.deg2rad(end.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in specified unit
    return d;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  async detectCurrentCity(): Promise<string | null> {
    const loc = await this.getCurrentLocation();
    return loc?.address?.city || null;
  }

  async calculatePropertyDistance(
    propertyCoords: LocationCoords, 
    userCoords: LocationCoords
  ): Promise<number | null> {
    return this.calculateDistance(userCoords, propertyCoords);
  }
}

export const locationService = new LocationService();