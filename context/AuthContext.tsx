import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Define the shape of a user for this real-estate app
interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'agent' | 'admin';
  avatar?: string;
}

// Define what the AuthContext will expose
interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: Omit<User, 'id'> & { password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Helper hook to consume the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, check for persisted user (e.g., from SecureStore or AsyncStorage)
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        // Replace with actual storage retrieval logic
        const storedUser = await fakeGetPersistedUser();
        if (storedUser) setUser(storedUser);
      } catch (error) {
        console.error('Failed to restore user session:', error);
      } finally {
        setIsLoading(false);
      }
    };
    bootstrapAsync();
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const authenticatedUser = await fakeSignInRequest(email, password);
      setUser(authenticatedUser);
      await fakePersistUser(authenticatedUser);
    } catch (error) {
      console.error('Sign-in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (userData: Omit<User, 'id'> & { password: string }) => {
    setIsLoading(true);
    try {
      const newUser = await fakeSignUpRequest(userData);
      setUser(newUser);
      await fakePersistUser(newUser);
    } catch (error) {
      console.error('Sign-up error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await fakeSignOutRequest();
      setUser(null);
      await fakeClearPersistedUser();
    } catch (error) {
      console.error('Sign-out error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      await fakePersistUser(updatedUser);
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextProps = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ------------------------------------------------------------------
// Fake helpers – replace these with real API/storage calls as needed
// ------------------------------------------------------------------
async function fakeGetPersistedUser(): Promise<User | null> {
  return null; // TODO: AsyncStorage or SecureStore retrieval
}

async function fakePersistUser(user: User): Promise<void> {
  // TODO: AsyncStorage or SecureStore save
}

async function fakeClearPersistedUser(): Promise<void> {
  // TODO: AsyncStorage or SecureStore clear
}

async function fakeSignInRequest(email: string, password: string): Promise<User> {
  // TODO: Replace with actual backend call
  return {
    id: '123',
    name: 'John Doe',
    email,
    role: 'buyer',
  };
}

async function fakeSignUpRequest(userData: Omit<User, 'id'> & { password: string }): Promise<User> {
  // TODO: Replace with actual backend call
  return {
    id: '456',
    name: userData.name,
    email: userData.email,
    role: userData.role,
  };
}

async function fakeSignOutRequest(): Promise<void> {
  // TODO: Replace with actual backend call
}
