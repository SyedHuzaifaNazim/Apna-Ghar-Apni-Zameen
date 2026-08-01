import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { apiService, ApiError, AuthUser, USER_KEY } from '@/services/apiService';

/**
 * Roles are finalized in Task 3 (backend-enforced). Kept as a widened string
 * union so existing sessions with unknown roles don't break the app.
 */
export type UserRole = 'buyer' | 'agent' | 'admin' | (string & {});

export interface User extends AuthUser {
  role: UserRole;
}

interface AuthContextValue {
  user: User | null;
  /** True only while restoring a persisted session at cold start. */
  isRestoring: boolean;
  /** True during an in-flight sign-in / sign-up / update. */
  isSubmitting: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (input: SignUpInput) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

export interface SignUpInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Restore a persisted session on cold start.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [storedUser, token] = await Promise.all([
          AsyncStorage.getItem(USER_KEY),
          apiService.getToken(),
        ]);

        // Both are required: a user blob without a token can't authenticate.
        if (!cancelled && storedUser && token) {
          setUser(JSON.parse(storedUser) as User);
        } else if (!cancelled && (storedUser || token)) {
          // Half-written session -> clear it rather than leave a broken state.
          await apiService.clearSession();
        }
      } catch {
        await apiService.clearSession().catch(() => undefined);
      } finally {
        if (!cancelled) setIsRestoring(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const persistUser = useCallback(async (next: User) => {
    setUser(next);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(next));
  }, []);

  /**
   * Throws ApiError on failure so the calling screen can render an inline
   * message. (Previously this raised a native Alert from inside the context,
   * which made good form UX impossible.)
   */
  const signIn = useCallback(
    async (email: string, password: string): Promise<User> => {
      setIsSubmitting(true);
      try {
        const { user: authUser } = await apiService.login(email, password);
        const next: User = { ...authUser, role: authUser.role ?? 'buyer' };
        await persistUser(next);
        return next;
      } finally {
        setIsSubmitting(false);
      }
    },
    [persistUser]
  );

  const signUp = useCallback(async (input: SignUpInput): Promise<void> => {
    setIsSubmitting(true);
    try {
      await apiService.register(input);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    setIsSubmitting(true);
    try {
      setUser(null);
      await apiService.logout();
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const updateProfile = useCallback(
    async (updates: Partial<User>): Promise<void> => {
      if (!user) throw new ApiError('You must be signed in to update your profile.', 401, 'UNAUTHORIZED');

      setIsSubmitting(true);
      try {
        const { name, phone } = updates;
        const saved = await apiService.updateProfile({ name, phone });
        await persistUser({ ...user, ...saved, role: saved.role ?? user.role });
      } finally {
        setIsSubmitting(false);
      }
    },
    [user, persistUser]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isRestoring,
      isSubmitting,
      isAuthenticated: !!user,
      signIn,
      signUp,
      signOut,
      updateProfile,
    }),
    [user, isRestoring, isSubmitting, signIn, signUp, signOut, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
