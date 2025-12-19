import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

import { analyticsService } from '../services/analyticsService';
import { storageService } from '../services/storageService';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  token: string;
  phone?: string;
}

interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (payload: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<void>;
}

const USER_STORAGE_KEY = 'auth_user';

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);

  const persistUser = useCallback(async (next: AuthUser | null) => {
    if (next) {
      await storageService.setItem(USER_STORAGE_KEY, next);
    } else {
      await storageService.removeItem(USER_STORAGE_KEY);
    }
    setUser(next);
  }, []);

  const login = useCallback(async ({ email }: { email: string; password: string }) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockUser: AuthUser = {
        id: 'auth-user-1',
        email: email,
        name: 'Demo User',
        token: 'mock-token',
      };
      await persistUser(mockUser);
      await analyticsService.track('user_login', { method: 'email', user_id: mockUser.id });
      
      // Replaced toast with Alert
      Alert.alert('Welcome back!', 'Signed in successfully');
    } catch (error) {
      await analyticsService.trackError(error as Error, { context: 'auth_login', email });
      Alert.alert('Login failed', 'Please try again');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [persistUser]);

  const register = useCallback(async ({ name, email, phone }: { name: string; email: string; password: string; phone?: string }) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      const mockUser: AuthUser = {
        id: 'auth-user-2',
        email,
        name,
        phone,
        token: 'mock-token',
      };
      await persistUser(mockUser);
      await analyticsService.track('user_register', { method: 'email', user_id: mockUser.id });
      
      // Replaced toast with Alert
      Alert.alert('Account created', 'You are now signed in');
    } catch (error) {
      await analyticsService.trackError(error as Error, { context: 'auth_register', email });
      Alert.alert('Registration failed', 'Please try again');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [persistUser]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      await persistUser(null);
      await analyticsService.track('user_logout', {});
    } finally {
      setLoading(false);
    }
  }, [persistUser]);

  const updateProfile = useCallback(async (updates: Partial<AuthUser>) => {
    if (!user) return;
    const next = { ...user, ...updates };
    await persistUser(next);
    await analyticsService.track('user_profile_updated', { user_id: next.id });
  }, [user, persistUser]);

  return {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
  };
};

export default useAuth;