import { Button, HStack, VStack } from 'native-base';
import React, { useState } from 'react';

import { Property } from '../../api/apiMock';
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
    <VStack space={3}>
      <AppText variant="h4" weight="bold">
        Get Directions
      </AppText>
      <AppText variant="body" color="secondary">
        Calculate the best route to {property.address.line1}, {property.address.city}
      </AppText>
      <Button onPress={handleDirections} isLoading={loading} colorScheme="primary">
        Calculate Route
      </Button>
      {routeInfo && (
        <HStack justifyContent="space-between">
          <VStack>
            <AppText variant="small" color="secondary">
              Distance
            </AppText>
            <AppText variant="body">{routeInfo.distance.toFixed(1)} km</AppText>
          </VStack>
          <VStack>
            <AppText variant="small" color="secondary">
              Duration
            </AppText>
            <AppText variant="body">{Math.round(routeInfo.duration)} mins</AppText>
          </VStack>
        </HStack>
      )}
    </VStack>
  );
};

export default Directions;
