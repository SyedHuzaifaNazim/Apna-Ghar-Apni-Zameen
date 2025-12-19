import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { Property } from '../../api/apiMock';
import AppText from '../../components/base/AppText';
import { Colors } from '../../constants/Colors';
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
    <View style={styles.container}>
      <MapView
        style={{ height }}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {clusters.map(cluster => {
          // Single Marker
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

          // Cluster Marker
          return (
            <Marker
              key={cluster.id}
              coordinate={cluster.coordinate}
              onPress={() => toggleClustering()}
            >
              <Pressable>
                <View style={styles.clusterBadge}>
                  <AppText variant="small" style={styles.clusterText}>
                    {cluster.count}
                  </AppText>
                </View>
              </Pressable>
            </Marker>
          );
        })}
      </MapView>
      
      {selectedMarker?.propertyData && (
        <View style={styles.popupContainer}>
          <PropertyPopup property={selectedMarker.propertyData as Property} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0', // Placeholder bg
  },
  clusterBadge: {
    backgroundColor: Colors.primary[500],
    borderRadius: 999, // Full circle
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  clusterText: {
    color: 'white', // inverse color
    fontWeight: 'bold',
  },
  popupContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
});

export default ClusterMap;