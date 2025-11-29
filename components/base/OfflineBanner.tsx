import { Box, HStack, Icon, Pressable, Spinner, Text } from 'native-base';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

import { useNetworkStatus } from '@/hooks/useNetworkStatus';

interface OfflineBannerProps {
  onPressSync?: () => void;
}

const OfflineBanner: React.FC<OfflineBannerProps> = ({ onPressSync }) => {
  const { isOnline, isOffline, syncStatus, pendingActions, refreshQueue } = useNetworkStatus();

  if (isOnline && pendingActions === 0 && syncStatus === 'idle') {
    return null;
  }

  const bannerBg = isOffline ? 'warning.200' : 'primary.100';
  const textColor = isOffline ? 'warning.900' : 'primary.900';

  const handleSyncPress = async () => {
    if (onPressSync) {
      await onPressSync();
      return;
    }

    await refreshQueue();
  };

  return (
    <Pressable onPress={handleSyncPress}>
      <Box bg={bannerBg} px={4} py={2}>
        <HStack alignItems="center" space={2}>
          <Icon
            as={Ionicons}
            name={isOffline ? 'cloud-offline' : 'cloud-done'}
            size="sm"
            color={textColor}
          />
          <Text color={textColor} flex={1} fontWeight="medium">
            {isOffline
              ? 'You are offline. Changes will sync when connection resumes.'
              : syncStatus === 'syncing'
              ? `Syncing ${pendingActions} pending action${pendingActions === 1 ? '' : 's'}...`
              : 'Pending actions ready to sync.'}
          </Text>
          {syncStatus === 'syncing' ? (
            <Spinner size="sm" color={textColor} />
          ) : (
            <Icon as={Ionicons} name="refresh" size="sm" color={textColor} />
          )}
        </HStack>
      </Box>
    </Pressable>
  );
};

export default OfflineBanner;

