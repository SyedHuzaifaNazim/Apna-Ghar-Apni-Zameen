import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  USER_PREFERENCES: 'user_preferences',
  FAVORITES: 'favorites',
  SEARCH_HISTORY: 'search_history',
  VIEWED_PROPERTIES: 'viewed_properties',
  APP_SETTINGS: 'app_settings',
  CACHE: 'cache_',
} as const;

// Types
export interface StorageService {
  getItem<T = any>(key: string): Promise<T | null>;
  setItem<T = any>(key: string, value: T): Promise<void>;
  removeItem(key: string): Promise<void>;
  multiRemove(keys: string[]): Promise<void>;
  clear(): Promise<void>;
  getAllKeys(): Promise<string[]>;
  multiGet<T = any>(keys: string[]): Promise<[string, T | null][]>;
}

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  prefix?: string;
}

class StorageServiceImpl implements StorageService {
  private prefix: string;

  constructor(prefix: string = '@ApnaGhar:') {
    this.prefix = prefix;
  }

  private getPrefixedKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  async getItem<T = any>(key: string): Promise<T | null> {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      const value = await AsyncStorage.getItem(prefixedKey);
      
      if (value === null) {
        return null;
      }

      // Check if it's cached data with TTL
      const parsed = JSON.parse(value);
      
      if (parsed && typeof parsed === 'object' && '__cachedAt' in parsed) {
        const { data, __cachedAt, __ttl } = parsed;
        
        if (__ttl && Date.now() - __cachedAt > __ttl) {
          // Cache expired, remove it
          await this.removeItem(key);
          return null;
        }
        
        return data as T;
      }

      return parsed as T;
    } catch (error) {
      console.error('StorageService getItem error:', error);
      return null;
    }
  }

  async setItem<T = any>(key: string, value: T, options?: CacheOptions): Promise<void> {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      
      let dataToStore = value;
      
      if (options?.ttl) {
        dataToStore = {
          data: value,
          __cachedAt: Date.now(),
          __ttl: options.ttl,
        };
      }

      const stringValue = JSON.stringify(dataToStore);
      await AsyncStorage.setItem(prefixedKey, stringValue);
    } catch (error) {
      console.error('StorageService setItem error:', error);
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      await AsyncStorage.removeItem(prefixedKey);
    } catch (error) {
      console.error('StorageService removeItem error:', error);
      throw error;
    }
  }

  async multiRemove(keys: string[]): Promise<void> {
    try {
      const prefixedKeys = keys.map(key => this.getPrefixedKey(key));
      await AsyncStorage.multiRemove(prefixedKeys);
    } catch (error) {
      console.error('StorageService multiRemove error:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const appKeys = allKeys.filter(key => key.startsWith(this.prefix));
      await AsyncStorage.multiRemove(appKeys);
    } catch (error) {
      console.error('StorageService clear error:', error);
      throw error;
    }
  }

  async getAllKeys(): Promise<string[]> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      return allKeys
        .filter(key => key.startsWith(this.prefix))
        .map(key => key.replace(this.prefix, ''));
    } catch (error) {
      console.error('StorageService getAllKeys error:', error);
      return [];
    }
  }

  async multiGet<T = any>(keys: string[]): Promise<[string, T | null][]> {
    try {
      const prefixedKeys = keys.map(key => this.getPrefixedKey(key));
      const results = await AsyncStorage.multiGet(prefixedKeys);
      
      return results.map(([prefixedKey, value]) => {
        const key = prefixedKey.replace(this.prefix, '');
        let parsedValue: T | null = null;
        
        if (value !== null) {
          try {
            parsedValue = JSON.parse(value);
            
            // Handle cached data with TTL
            if (parsedValue && typeof parsedValue === 'object' && '__cachedAt' in parsedValue) {
              const { data, __cachedAt, __ttl } = parsedValue as any;
              
              if (__ttl && Date.now() - __cachedAt > __ttl) {
                // Cache expired
                this.removeItem(key);
                return [key, null];
              }
              
              parsedValue = data;
            }
          } catch (parseError) {
            console.error('StorageService multiGet parse error:', parseError);
            parsedValue = value as any;
          }
        }
        
        return [key, parsedValue];
      });
    } catch (error) {
      console.error('StorageService multiGet error:', error);
      return keys.map(key => [key, null]);
    }
  }

  // Cache-specific methods
  async setCache<T = any>(key: string, value: T, ttl: number = 5 * 60 * 1000): Promise<void> {
    const cacheKey = `${STORAGE_KEYS.CACHE}${key}`;
    return this.setItem(cacheKey, value, { ttl });
  }

  async getCache<T = any>(key: string): Promise<T | null> {
    const cacheKey = `${STORAGE_KEYS.CACHE}${key}`;
    return this.getItem<T>(cacheKey);
  }

  async clearCache(pattern?: string): Promise<void> {
    try {
      const allKeys = await this.getAllKeys();
      const cacheKeys = allKeys.filter(key => 
        key.startsWith(STORAGE_KEYS.CACHE) && 
        (!pattern || key.includes(pattern))
      );
      await this.multiRemove(cacheKeys);
    } catch (error) {
      console.error('StorageService clearCache error:', error);
      throw error;
    }
  }

  async clearExpiredCache(): Promise<void> {
    try {
      const allKeys = await this.getAllKeys();
      const cacheKeys = allKeys.filter(key => key.startsWith(STORAGE_KEYS.CACHE));
      
      // This will automatically remove expired cache when trying to get them
      await this.multiGet(cacheKeys);
    } catch (error) {
      console.error('StorageService clearExpiredCache error:', error);
    }
  }

  // Specific data management methods
  async getFavorites(): Promise<number[]> {
    const favorites = await this.getItem<number[]>(STORAGE_KEYS.FAVORITES);
    return favorites || [];
  }

  async setFavorites(favorites: number[]): Promise<void> {
    await this.setItem(STORAGE_KEYS.FAVORITES, favorites);
  }

  async addToFavorites(propertyId: number): Promise<void> {
    const favorites = await this.getFavorites();
    if (!favorites.includes(propertyId)) {
      favorites.push(propertyId);
      await this.setFavorites(favorites);
    }
  }

  async removeFromFavorites(propertyId: number): Promise<void> {
    const favorites = await this.getFavorites();
    const updatedFavorites = favorites.filter(id => id !== propertyId);
    await this.setFavorites(updatedFavorites);
  }

  async getSearchHistory(): Promise<string[]> {
    const history = await this.getItem<string[]>(STORAGE_KEYS.SEARCH_HISTORY);
    return history || [];
  }

  async addToSearchHistory(query: string): Promise<void> {
    const history = await this.getSearchHistory();
    const updatedHistory = [query, ...history.filter(q => q !== query)].slice(0, 10); // Keep last 10
    await this.setItem(STORAGE_KEYS.SEARCH_HISTORY, updatedHistory);
  }

  async clearSearchHistory(): Promise<void> {
    await this.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
  }

  async getViewedProperties(): Promise<number[]> {
    const viewed = await this.getItem<number[]>(STORAGE_KEYS.VIEWED_PROPERTIES);
    return viewed || [];
  }

  async addToViewedProperties(propertyId: number): Promise<void> {
    const viewed = await this.getViewedProperties();
    if (!viewed.includes(propertyId)) {
      const updatedViewed = [propertyId, ...viewed].slice(0, 50); // Keep last 50
      await this.setItem(STORAGE_KEYS.VIEWED_PROPERTIES, updatedViewed);
    }
  }

  // Migration helper
  async migrateData(oldKey: string, newKey: string): Promise<boolean> {
    try {
      const data = await this.getItem(oldKey);
      if (data !== null) {
        await this.setItem(newKey, data);
        await this.removeItem(oldKey);
        return true;
      }
      return false;
    } catch (error) {
      console.error('StorageService migrateData error:', error);
      return false;
    }
  }

  // Storage info
  async getStorageInfo(): Promise<{
    totalKeys: number;
    totalSize: number;
    keysByType: Record<string, number>;
  }> {
    try {
      const allKeys = await this.getAllKeys();
      const multiGetResult = await AsyncStorage.multiGet(
        allKeys.map(key => this.getPrefixedKey(key))
      );

      let totalSize = 0;
      const keysByType: Record<string, number> = {};

      multiGetResult.forEach(([key, value]) => {
        const cleanKey = key.replace(this.prefix, '');
        const keyType = cleanKey.split('_')[0];
        
        keysByType[keyType] = (keysByType[keyType] || 0) + 1;
        totalSize += value ? value.length : 0;
      });

      return {
        totalKeys: allKeys.length,
        totalSize,
        keysByType,
      };
    } catch (error) {
      console.error('StorageService getStorageInfo error:', error);
      return {
        totalKeys: 0,
        totalSize: 0,
        keysByType: {},
      };
    }
  }
}

// Create singleton instance
export const storageService = new StorageServiceImpl();

// Export type for dependency injection
export type { StorageServiceImpl as StorageService };
