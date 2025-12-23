import AsyncStorage from '@react-native-async-storage/async-storage'; // <--- INSTALL THIS IF NEEDED
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

// ------------------------------------------------------------------
// CONFIGURATION
// ------------------------------------------------------------------
// ANDROID EMULATOR: Use 'http://10.0.2.2:5000'
// PHYSICAL DEVICE: Use your computer's IP, e.g., 'http://192.168.1.5:5000'
// IOS SIMULATOR: Use 'http://localhost:5000'
// const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';
const API_URL = 'http://192.168.1.46:5000';

// ------------------------------------------------------------------
// INTERFACES
// ------------------------------------------------------------------
interface User {
  phone: string;
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'agent' | 'admin';
  avatar?: string;
}

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: Omit<User, 'id'> & { password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

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

// ------------------------------------------------------------------
// PROVIDER
// ------------------------------------------------------------------
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. CHECK LOGIN STATUS ON APP START
  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const userJson = await AsyncStorage.getItem('user_session');
        if (userJson) {
          setUser(JSON.parse(userJson));
        }
      } catch (error) {
        console.error('Failed to restore user session:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserFromStorage();
  }, []);

  // 2. SIGN IN
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.status === 'ok') {
        // Map MongoDB _id to your app's id
        const userPayload: User = {
          id: data.user._id,
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
          role: 'buyer', // Default role since backend doesn't have it yet
        };

        setUser(userPayload);
        await AsyncStorage.setItem('user_session', JSON.stringify(userPayload));
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Sign-in error:', error);
      Alert.alert('Login Failed', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 3. SIGN UP
  const signUp = async (userData: Omit<User, 'id'> & { password: string }) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.status === 'ok') {
        // Auto-login after signup? Or require manual login? 
        // For now, let's just return and let the UI redirect to SignIn
        Alert.alert('Success', 'Account created! Please log in.');
      } else {
        throw new Error(data.error || 'Signup failed');
      }
    } catch (error: any) {
      console.error('Sign-up error:', error);
      Alert.alert('Error', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 4. SIGN OUT
  const signOut = async () => {
    setIsLoading(true);
    try {
      setUser(null);
      await AsyncStorage.removeItem('user_session');
    } catch (error) {
      console.error('Sign-out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 5. UPDATE PROFILE
  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    setIsLoading(true);
    // TODO: Add backend endpoint for updates later
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    await AsyncStorage.setItem('user_session', JSON.stringify(updatedUser));
    setIsLoading(false);
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