import { useContext } from 'react';

import { NetworkContext } from '@/context/NetworkContext';

export const useNetworkStatus = () => {
  const context = useContext(NetworkContext);

  if (!context) {
    throw new Error('useNetworkStatus must be used within a NetworkProvider');
  }

  const { isOnline } = context;

  return {
    ...context,
    isOffline: !isOnline,
  };
};

export default useNetworkStatus;

