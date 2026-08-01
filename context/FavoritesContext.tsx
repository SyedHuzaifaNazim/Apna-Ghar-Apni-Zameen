import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { storageService } from '@/services/storageService';

const FAVORITES_KEY = 'favorites';

interface FavoritesContextValue {
  favorites: number[];
  /** True while the persisted list is being read at startup. */
  isLoading: boolean;
  isFavorite: (propertyId: number) => boolean;
  addToFavorites: (propertyId: number) => void;
  removeFromFavorites: (propertyId: number) => void;
  toggleFavorite: (propertyId: number) => void;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export const useFavorites = (): FavoritesContextValue => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within a FavoritesProvider');
  return ctx;
};

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted favorites once at startup.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const saved = await storageService.getItem<number[]>(FAVORITES_KEY);
        if (!cancelled && Array.isArray(saved)) {
          setFavorites(saved.filter(id => typeof id === 'number'));
        }
      } catch {
        // A corrupt entry shouldn't block the app — start empty.
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setHydrated(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Persist on every change, but never before the initial read completes —
  // otherwise the empty default would overwrite the saved list.
  useEffect(() => {
    if (!hydrated) return;
    storageService.setItem(FAVORITES_KEY, favorites).catch(() => undefined);
  }, [favorites, hydrated]);

  const isFavorite = useCallback((id: number) => favorites.includes(id), [favorites]);

  const addToFavorites = useCallback((id: number) => {
    setFavorites(prev => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const removeFromFavorites = useCallback((id: number) => {
    setFavorites(prev => prev.filter(existing => existing !== id));
  }, []);

  const toggleFavorite = useCallback((id: number) => {
    setFavorites(prev => (prev.includes(id) ? prev.filter(existing => existing !== id) : [...prev, id]));
  }, []);

  const clearFavorites = useCallback(() => setFavorites([]), []);

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favorites,
      isLoading,
      isFavorite,
      addToFavorites,
      removeFromFavorites,
      toggleFavorite,
      clearFavorites,
    }),
    [favorites, isLoading, isFavorite, addToFavorites, removeFromFavorites, toggleFavorite, clearFavorites]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};
