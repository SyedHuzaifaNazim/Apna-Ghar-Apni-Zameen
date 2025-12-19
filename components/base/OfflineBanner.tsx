import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/Colors';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

interface OfflineBannerProps {
  onPressSync?: () => void;
}

const OfflineBanner: React.FC<OfflineBannerProps> = ({ onPressSync }) => {
  const { isOnline, isOffline, syncStatus, pendingActions, refreshQueue } = useNetworkStatus();

  if (isOnline && pendingActions === 0 && syncStatus === 'idle') {
    return null;
  }

  // Determine colors based on status (Safe fallbacks included)
  const backgroundColor = isOffline 
    ? (Colors.warning?.[200] || '#FEF3C7') // Light warning color
    : (Colors.primary?.[100] || '#DBEAFE'); // Light primary color
    
  const textColor = isOffline 
    ? (Colors.warning?.[900] || '#78350F') // Dark warning text
    : (Colors.primary?.[900] || '#1E3A8A'); // Dark primary text

  const handleSyncPress = async () => {
    if (onPressSync) {
      await onPressSync();
      return;
    }

    await refreshQueue();
  };

  return (
    <Pressable onPress={handleSyncPress} style={[styles.container, { backgroundColor }]}>
      <View style={styles.content}>
        <Ionicons
          name={isOffline ? 'cloud-offline' : 'cloud-done'}
          size={18}
          color={textColor}
        />
        <Text style={[styles.text, { color: textColor }]}>
          {isOffline
            ? 'You are offline. Changes will sync when connection resumes.'
            : syncStatus === 'syncing'
            ? `Syncing ${pendingActions} pending action${pendingActions === 1 ? '' : 's'}...`
            : 'Pending actions ready to sync.'}
        </Text>
        {syncStatus === 'syncing' ? (
          <ActivityIndicator size="small" color={textColor} />
        ) : (
          <Ionicons name="refresh" size={18} color={textColor} />
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  text: {
    flex: 1,
    fontWeight: '500',
    fontSize: 14,
  },
});

export default OfflineBanner;