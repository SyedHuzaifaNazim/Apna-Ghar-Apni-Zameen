import { useCallback, useEffect, useState } from 'react';

import { STORAGE_KEYS, storageService } from '@/services/storageService';
import type { FilterOptions } from './useFilterProperties';

const MAX_SAVED_SEARCHES = 20;

export interface SavedSearch {
  id: string;
  label: string;
  query: string;
  filters: FilterOptions;
  createdAt: string;
}

export const useSavedSearches = () => {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const saved = await storageService.getItem<SavedSearch[]>(STORAGE_KEYS.SAVED_SEARCHES);
      setSavedSearches(saved ?? []);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saveSearch = useCallback(async (label: string, query: string, filters: FilterOptions) => {
    const entry: SavedSearch = {
      id: `${Date.now()}`,
      label: label.trim(),
      query,
      filters,
      createdAt: new Date().toISOString(),
    };

    setSavedSearches(prev => {
      const next = [entry, ...prev].slice(0, MAX_SAVED_SEARCHES);
      storageService.setItem(STORAGE_KEYS.SAVED_SEARCHES, next).catch(() => undefined);
      return next;
    });
  }, []);

  const removeSavedSearch = useCallback(async (id: string) => {
    setSavedSearches(prev => {
      const next = prev.filter(s => s.id !== id);
      storageService.setItem(STORAGE_KEYS.SAVED_SEARCHES, next).catch(() => undefined);
      return next;
    });
  }, []);

  return { savedSearches, isLoading, saveSearch, removeSavedSearch, refetch: load };
};
