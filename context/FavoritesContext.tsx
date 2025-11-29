import React, { createContext, ReactNode, useContext, useState } from 'react';

interface FavoritesContextType {
  favorites: number[];
  addToFavorites: (propertyId: number) => void;
  removeFromFavorites: (propertyId: number) => void;
  isFavorite: (propertyId: number) => boolean;
  toggleFavorite: (propertyId: number) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<number[]>([]);

  const addToFavorites = (propertyId: number) => {
    setFavorites(prev => [...prev, propertyId]);
  };

  const removeFromFavorites = (propertyId: number) => {
    setFavorites(prev => prev.filter(id => id !== propertyId));
  };

  const isFavorite = (propertyId: number) => {
    return favorites.includes(propertyId);
  };

  const toggleFavorite = (propertyId: number) => {
    if (isFavorite(propertyId)) {
      removeFromFavorites(propertyId);
    } else {
      addToFavorites(propertyId);
    }
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      toggleFavorite
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};