import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Property } from '../../api/apiMock';
import AppButton from '../../components/base/AppButton';
import AppText from '../../components/base/AppText';
import { useMap } from '../../hooks/useMap';

interface DirectionsProps {
  property: Property;
}

const Directions: React.FC<DirectionsProps> = ({ property }) => {
  const { calculateRoute } = useMap();
  const [routeInfo, setRouteInfo] = useState<{ distance: number; duration: number } | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const handleDirections = async () => {
    setLoading(true);
    try {
      const route = await calculateRoute({
        latitude: property.address.latitude,
        longitude: property.address.longitude,
      });
      setRouteInfo({
        distance: route.distance,
        duration: route.duration,
      });
    } catch (error) {
      setRouteInfo(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText variant="h4" weight="bold">
          Get Directions
        </AppText>
        <AppText variant="body" color="secondary" style={styles.subtext}>
          Calculate the best route to {property.address.line1}, {property.address.city}
        </AppText>
      </View>

      <AppButton 
        onPress={handleDirections} 
        isLoading={loading} 
        variant="primary"
        style={styles.button}
      >
        Calculate Route
      </AppButton>

      {routeInfo && (
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <AppText variant="small" color="secondary">
              Distance
            </AppText>
            <AppText variant="body" weight="medium">
              {routeInfo.distance.toFixed(1)} km
            </AppText>
          </View>
          
          <View style={[styles.infoItem, styles.infoItemRight]}>
            <AppText variant="small" color="secondary">
              Duration
            </AppText>
            <AppText variant="body" weight="medium">
              {Math.round(routeInfo.duration)} mins
            </AppText>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  header: {
    gap: 4,
  },
  subtext: {
    lineHeight: 20,
  },
  button: {
    width: '100%',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB', // gray.50
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB', // gray.200
  },
  infoItem: {
    flex: 1,
  },
  infoItemRight: {
    alignItems: 'flex-end',
  },
});

export default Directions;