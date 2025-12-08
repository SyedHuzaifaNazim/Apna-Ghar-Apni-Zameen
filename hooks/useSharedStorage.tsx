import AsyncStorage from '@react-native-async-storage/async-storage';

export const sharedStorage = {
  getItem: async <T = any>(key: string): Promise<T | null> => {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },
  setItem: async <T = any>(key: string, value: T): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to set item "${key}":`, error);
      throw error;
    }
  },
};
