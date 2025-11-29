import { useToast } from 'native-base';
import { useCallback, useEffect, useState } from 'react';
import { analyticsService } from '../services/analyticsService';
import { notificationService } from '../services/notificationService';
import { storageService } from '../services/storageService';
import { offlineQueueService } from '../services/offlineQueueService';
import { useNetworkStatus } from './useNetworkStatus';

const STORAGE_KEYS = {
  FAVORITES: 'user_favorites',
};

interface UseFavoritesReturn {
  favorites: number[];
  isFavorite: (propertyId: number) => boolean;
  addToFavorites: (propertyId: number, propertyData?: any) => Promise<void>;
  removeFromFavorites: (propertyId: number, propertyData?: any) => Promise<void>;
  toggleFavorite: (propertyId: number, propertyData?: any) => Promise<void>;
  clearFavorites: () => Promise<void>;
  isLoading: boolean;
}

export const useFavorites = (): UseFavoritesReturn => {
  const toast = useToast();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isOnline } = useNetworkStatus();

  // Load favorites from storage
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const savedFavorites = await storageService.getItem<number[]>(STORAGE_KEYS.FAVORITES);
        setFavorites(savedFavorites || []);
      } catch (error) {
        console.error('Failed to load favorites:', error);
        setFavorites([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const saveFavorites = useCallback(async (newFavorites: number[]) => {
    try {
      await storageService.setItem(STORAGE_KEYS.FAVORITES, newFavorites);
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Failed to save favorites:', error);
      throw error;
    }
  }, []);

  const isFavorite = useCallback((propertyId: number): boolean => {
    return favorites.includes(propertyId);
  }, [favorites]);

  const addToFavorites = useCallback(async (propertyId: number, propertyData?: any): Promise<void> => {
    try {
      if (isFavorite(propertyId)) return;

      const newFavorites = [...favorites, propertyId];
      await saveFavorites(newFavorites);

      const analyticsPayload = {
        property_id: propertyId,
        property_type: propertyData?.propertyCategory,
        price: propertyData?.price,
        location: propertyData?.address?.city,
        total_favorites: newFavorites.length,
      };

      if (!isOnline) {
        await offlineQueueService.enqueue('favorites:add', {
          propertyId,
          propertyData,
          analytics: analyticsPayload,
        });

        toast.show({
          title: 'Saved offline',
          description: 'We will sync this favorite when you are online.',
          duration: 2000,
        });
        return;
      }

      await analyticsService.track('property_favorited', analyticsPayload);

      if (propertyData) {
        await notificationService.schedulePriceDropAlert(
          propertyId,
          propertyData.title,
          propertyData.price,
          propertyData.price * 0.9,
          new Date(Date.now() + 24 * 60 * 60 * 1000)
        );
      }

      toast.show({
        title: 'Added to favorites',
        description: 'Property added to your favorites list',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      await analyticsService.trackError(error as Error, {
        context: 'add_to_favorites',
        property_id: propertyId,
      });

      toast.show({
        title: 'Error',
        description: 'Failed to add to favorites',
        status: 'error',
      });

      throw error;
    }
  }, [favorites, isFavorite, saveFavorites, toast, isOnline]);

  const removeFromFavorites = useCallback(async (propertyId: number, propertyData?: any): Promise<void> => {
    try {
      if (!isFavorite(propertyId)) return;

      const newFavorites = favorites.filter(id => id !== propertyId);
      await saveFavorites(newFavorites);

      const analyticsPayload = {
        property_id: propertyId,
        property_type: propertyData?.propertyCategory,
        total_favorites: newFavorites.length,
      };

      if (!isOnline) {
        await offlineQueueService.enqueue('favorites:remove', {
          propertyId,
          analytics: analyticsPayload,
        });
      } else {
        await analyticsService.track('property_unfavorited', analyticsPayload);
        await notificationService.cancelNotification(`price_drop_${propertyId}`);
      }

      toast.show({
        title: 'Removed from favorites',
        description: 'Property removed from your favorites list',
        status: 'info',
        duration: 2000,
      });
    } catch (error) {
      await analyticsService.trackError(error as Error, {
        context: 'remove_from_favorites',
        property_id: propertyId,
      });

      toast.show({
        title: 'Error',
        description: 'Failed to remove from favorites',
        status: 'error',
      });

      throw error;
    }
  }, [favorites, isFavorite, saveFavorites, toast, isOnline]);

  const toggleFavorite = useCallback(async (propertyId: number, propertyData?: any): Promise<void> => {
    if (isFavorite(propertyId)) {
      await removeFromFavorites(propertyId, propertyData);
    } else {
      await addToFavorites(propertyId, propertyData);
    }
  }, [isFavorite, addToFavorites, removeFromFavorites]);

  const clearFavorites = useCallback(async (): Promise<void> => {
    try {
      const previousCount = favorites.length;
      await saveFavorites([]);

      // Track analytics
      await analyticsService.track('favorites_cleared', {
        previous_count: previousCount,
      });

      // Cancel all price drop notifications
      const notifications = await notificationService.getScheduledNotifications();
      const priceDropNotifications = notifications.filter(n => 
        n.content.data?.type === 'price_drop'
      );
      
      for (const notification of priceDropNotifications) {
        await notificationService.cancelNotification(notification.identifier);
      }

      toast.show({
        title: 'Favorites cleared',
        description: 'All properties removed from favorites',
        status: 'info',
      });
    } catch (error) {
      await analyticsService.trackError(error as Error, {
        context: 'clear_favorites',
      });

      toast.show({
        title: 'Error',
        description: 'Failed to clear favorites',
        status: 'error',
      });

      throw error;
    }
  }, [favorites.length, saveFavorites, toast]);

  return {
    favorites,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    clearFavorites,
    isLoading,
  };
};

// Hook for favorite properties with data
export const useFavoriteProperties = (allProperties: any[]) => {
  const { favorites, ...favoriteActions } = useFavorites();

  const favoriteProperties = allProperties.filter(property => 
    favorites.includes(property.id)
  );

  const hasFavorites = favoriteProperties.length > 0;

  return {
    favoriteProperties,
    favorites,
    hasFavorites,
    ...favoriteActions,
  };
};

export default useFavorites;