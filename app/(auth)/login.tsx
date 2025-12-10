import LoginScreen from '@/features/auth/LoginScreen';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';

export default function LoginRoute() {
  const router = useRouter();
  // Assuming a context or hook provides the user state
  // const { isAuthenticated } = useAuth(); 

  // Mock isAuthenticated state for logic demonstration
  const isAuthenticated = false; 

  // AUTH REDIRECTION LOGIC
  useEffect(() => {
    // Replace with your actual authentication check
    if (isAuthenticated) {
      // Replaces the auth stack with the main app stack (tabs)
      router.replace('/(tabs)'); 
    }
  }, [isAuthenticated, router]);

  return <LoginScreen />;
}