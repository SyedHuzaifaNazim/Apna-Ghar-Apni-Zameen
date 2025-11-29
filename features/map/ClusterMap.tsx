import { Box, Pressable } from 'native-base';
import React from 'react';
import MapView, { Marker } from 'react-native-maps';

import { Property } from '../../api/apiMock';
import AppText from '../../components/base/AppText';
import { usePropertyMap } from '../../hooks/useMap';
import PropertyPopup from './PropertyPopup';

interface ClusterMapProps {
  properties: Property[];
  height?: number;
}

const ClusterMap: React.FC<ClusterMapProps> = ({ properties, height = 320 }) => {
  const {
    region,
    clusters,
    selectMarker,
    selectedMarker,
    toggleClustering,
    setRegion,
  } = usePropertyMap(properties);

  return (
    <Box borderRadius="2xl" overflow="hidden">
      <MapView
        style={{ height }}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {clusters.map(cluster => {
          if (cluster.count === 1) {
            const marker = cluster.markers[0];
            return (
              <Marker
                key={marker.id}
                coordinate={marker.coordinate}
                pinColor={marker.color}
                onPress={() => selectMarker(marker)}
              />
            );
          }

          return (
            <Marker
              key={cluster.id}
              coordinate={cluster.coordinate}
              onPress={() => toggleClustering()}
            >
              <Pressable>
                <Box
                  bg="primary.500"
                  borderRadius="full"
                  px={3}
                  py={1}
                  minW={10}
                  alignItems="center"
                >
                  <AppText variant="small" color="inverse">
                    {cluster.count}
                  </AppText>
                </Box>
              </Pressable>
            </Marker>
          );
        })}
      </MapView>
      {selectedMarker?.propertyData && (
        <Box position="absolute" bottom={4} left={4} right={4}>
          <PropertyPopup property={selectedMarker.propertyData as Property} />
        </Box>
      )}
    </Box>
  );
};

export default ClusterMap;
