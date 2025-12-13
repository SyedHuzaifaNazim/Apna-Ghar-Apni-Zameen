import LoginScreen from '@/features/auth/LoginScreen';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';

export default function LoginRoute() {
  const router = useRouter();
  // Mock isAuthenticated state (Replace with your actual hook access, e.g., const { isAuthenticated } = useAuth();)
  const isAuthenticated = false; 

  // AUTH REDIRECTION LOGIC
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)'); 
    }
  }, [isAuthenticated, router]);

  return <LoginScreen />;
}