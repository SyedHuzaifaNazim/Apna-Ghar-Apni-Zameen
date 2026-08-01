import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

export const MAX_COMPARE = 3;

interface CompareContextValue {
  compareIds: number[];
  isComparing: (propertyId: number) => boolean;
  toggleCompare: (propertyId: number) => void;
  removeFromCompare: (propertyId: number) => void;
  clearCompare: () => void;
  canAddMore: boolean;
}

const CompareContext = createContext<CompareContextValue | undefined>(undefined);

export const useCompare = (): CompareContextValue => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within a CompareProvider');
  return ctx;
};

// Comparison is a short-lived workflow (pick a few listings, look at them side
// by side), not something a user expects to persist across app restarts —
// so unlike Favorites/Saved Searches, this deliberately stays in-memory only.
export const CompareProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [compareIds, setCompareIds] = useState<number[]>([]);

  const isComparing = useCallback((id: number) => compareIds.includes(id), [compareIds]);

  const toggleCompare = useCallback((id: number) => {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(existing => existing !== id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, id];
    });
  }, []);

  const removeFromCompare = useCallback((id: number) => {
    setCompareIds(prev => prev.filter(existing => existing !== id));
  }, []);

  const clearCompare = useCallback(() => setCompareIds([]), []);

  const value = useMemo<CompareContextValue>(
    () => ({
      compareIds,
      isComparing,
      toggleCompare,
      removeFromCompare,
      clearCompare,
      canAddMore: compareIds.length < MAX_COMPARE,
    }),
    [compareIds, isComparing, toggleCompare, removeFromCompare, clearCompare]
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
};
