import { authApi } from '@/services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

// ------------------------------------------------------------------
// INTERFACES
// ------------------------------------------------------------------
interface User {
  id: string | number;
  username: string;
  email: string;
  name: string;
  phone?: string;
  role: 'buyer' | 'seller' | 'agent' | 'admin';
  avatar?: string;
  token?: string;
}

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: any) => Promise<void>;
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
        const token = await AsyncStorage.getItem('auth_token');
        
        if (userJson && token) {
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
      const response = await authApi.login(email, password);
      
      const { token, user_email, user_nicename, user_display_name } = response.data;

      const userPayload: User = {
        id: response.data.id || 0,
        username: user_nicename,
        email: user_email,
        name: user_display_name,
        role: 'buyer', 
        token: token,
      };

      setUser(userPayload);
      await AsyncStorage.setItem('user_session', JSON.stringify(userPayload));
      
    } catch (error: any) {
      console.error('Sign-in error:', error);
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 3. SIGN UP
  const signUp = async (userData: any) => {
    setIsLoading(true);
    try {
      await authApi.register(userData);
      Alert.alert('Success', 'Account created! Please log in.');
    } catch (error: any) {
      console.error('Sign-up error:', error);
      Alert.alert('Registration Failed', error.message);
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
      await AsyncStorage.multiRemove(['user_session', 'auth_token']);
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

    try {
      // Optimistic update
      const updatedUserPayload: User = { ...user, ...updates };
      setUser(updatedUserPayload);
      await AsyncStorage.setItem('user_session', JSON.stringify(updatedUserPayload));
      Alert.alert("Success", "Profile updated successfully!");
      
    } catch (error: any) {
      console.error('Profile update error:', error);
      Alert.alert('Error', error.message || "Could not update profile");
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