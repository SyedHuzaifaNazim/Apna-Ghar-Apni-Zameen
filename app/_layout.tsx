import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider } from 'native-base';
import { BackHandler, useColorScheme } from 'react-native';
import 'react-native-reanimated';

import { FavoritesProvider } from '@/context/FavoritesContext';
import { NetworkProvider } from '@/context/NetworkContext';

// Polyfill for NativeBase compatibility with React Native 0.81+
if (BackHandler && typeof (BackHandler as any).removeEventListener === 'undefined') {
  const subscriptions = new Map<() => boolean, { remove: () => void }>();
  
  (BackHandler as any).removeEventListener = function(
    eventType: 'hardwareBackPress',
    handler: () => boolean
  ) {
    const subscription = subscriptions.get(handler);
    if (subscription) {
      subscription.remove();
      subscriptions.delete(handler);
    }
  };
  
  const originalAddEventListener = BackHandler.addEventListener.bind(BackHandler);
  BackHandler.addEventListener = function(
    eventType: 'hardwareBackPress',
    handler: () => boolean
  ) {
    const subscription = originalAddEventListener(eventType, handler);
    subscriptions.set(handler, subscription);
    return subscription;
  };
}

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <NativeBaseProvider>
      <NetworkProvider>
        <FavoritesProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }}>
              {/* Auth Screens - No tabs, full screens */}
              <Stack.Screen 
                name="login" 
                options={{ 
                  animation: 'fade',
                  presentation: 'modal'
                }} 
              />
              <Stack.Screen 
                name="register" 
                options={{ 
                  animation: 'slide_from_right'
                }} 
              />
              <Stack.Screen 
                name="forgot-password" 
                options={{ 
                  animation: 'slide_from_right'
                }} 
              />
              
              {/* Main App with Tabs */}
              <Stack.Screen name="(tabs)" />
              
              {/* Modal Screens */}
              <Stack.Screen
                name="modal"
                options={{ 
                  presentation: 'modal', 
                  headerShown: true, 
                  title: 'Modal' 
                }}
              />
              
              {/* Other Screens */}
              <Stack.Screen name="favorites" />
              <Stack.Screen name="search" />
              <Stack.Screen name="map" />
              <Stack.Screen name="profile" />
              <Stack.Screen name="notifications" />
              <Stack.Screen name="settings" />
              
              {/* Dynamic Listing Screen */}
              <Stack.Screen 
                name="listing/[id]" 
                options={{ 
                  animation: 'slide_from_right'
                }} 
              />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </FavoritesProvider>
      </NetworkProvider>
    </NativeBaseProvider>
  );
}