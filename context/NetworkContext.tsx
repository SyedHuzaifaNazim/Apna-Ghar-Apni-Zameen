import NetInfo, { NetInfoState, NetInfoStateType } from '@react-native-community/netinfo';
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import { offlineQueueService } from '@/services/offlineQueueService';
import '@/services/offlineSyncService';

type SyncStatus = 'idle' | 'syncing' | 'error';

interface NetworkContextValue {
  isOnline: boolean;
  isInternetReachable: boolean;
  connectionType: NetInfoState['type'];
  lastOnlineAt: number | null;
  syncStatus: SyncStatus;
  pendingActions: number;
  setSyncStatus: (status: SyncStatus) => void;
  refreshQueue: () => Promise<void>;
}

const defaultState: NetworkContextValue = {
  isOnline: true,
  isInternetReachable: true,
  // Fix: Use NetInfoStateType enum instead of string literal
  connectionType: NetInfoStateType.unknown, 
  lastOnlineAt: Date.now(),
  syncStatus: 'idle',
  pendingActions: 0,
  setSyncStatus: () => undefined,
  refreshQueue: async () => undefined,
};

export const NetworkContext = createContext<NetworkContextValue>(defaultState);

export const NetworkProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [networkInfo, setNetworkInfo] = useState<Omit<NetworkContextValue, 'pendingActions' | 'setSyncStatus' | 'refreshQueue'>>({
    isOnline: defaultState.isOnline,
    isInternetReachable: defaultState.isInternetReachable,
    connectionType: defaultState.connectionType,
    lastOnlineAt: defaultState.lastOnlineAt,
    syncStatus: 'idle',
  });
  const [pendingActions, setPendingActions] = useState(defaultState.pendingActions);

  const handleQueueUpdate = useCallback(async () => {
    const queue = await offlineQueueService.getQueue();
    setPendingActions(queue.length);
  }, []);

  useEffect(() => {
    const unsubscribeNetInfo = NetInfo.addEventListener(state => {
      setNetworkInfo(prev => ({
        ...prev,
        isOnline: state.isConnected ?? true,
        isInternetReachable: state.isInternetReachable ?? true,
        connectionType: state.type,
        lastOnlineAt: state.isConnected ? Date.now() : prev.lastOnlineAt,
      }));
    });

    handleQueueUpdate();
    const unsubscribeQueue = offlineQueueService.subscribe(queue => {
      setPendingActions(queue.length);
    });

    return () => {
      unsubscribeNetInfo();
      unsubscribeQueue();
    };
  }, [handleQueueUpdate]);

  useEffect(() => {
    if (networkInfo.isOnline) {
      setNetworkInfo(prev => ({ ...prev, syncStatus: pendingActions > 0 ? 'syncing' : 'idle' }));

      offlineQueueService
        .processQueue()
        .then(() => {
          setNetworkInfo(prev => ({ ...prev, syncStatus: 'idle', lastOnlineAt: Date.now() }));
        })
        .catch(() => {
          setNetworkInfo(prev => ({ ...prev, syncStatus: 'error' }));
        });
    }
  }, [networkInfo.isOnline, pendingActions]);

  const setSyncStatus = useCallback((status: SyncStatus) => {
    setNetworkInfo(prev => ({ ...prev, syncStatus: status }));
  }, []);

  const refreshQueue = useCallback(async () => {
    setSyncStatus('syncing');
    try {
      await offlineQueueService.processQueue();
      setSyncStatus('idle');
    } catch {
      setSyncStatus('error');
    }
  }, [setSyncStatus]);

  const value = useMemo<NetworkContextValue>(
    () => ({
      ...networkInfo,
      pendingActions,
      setSyncStatus,
      refreshQueue,
    }),
    [networkInfo, pendingActions, refreshQueue, setSyncStatus]
  );

  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>;
};