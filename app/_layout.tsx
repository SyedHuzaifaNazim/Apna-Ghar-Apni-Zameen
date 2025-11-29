import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider } from 'native-base';
import { BackHandler, useColorScheme } from 'react-native';
import 'react-native-reanimated';

import { FavoritesProvider } from '@/context/FavoritesContext';
import { NetworkProvider } from '@/context/NetworkContext';

// Polyfill for NativeBase compatibility with React Native 0.81+
// BackHandler.removeEventListener was removed, replaced with subscription-based API
// This creates a compatibility layer for NativeBase v3.4.28
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
  
  // Override addEventListener to track subscriptions
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
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="modal"
                options={{ presentation: 'modal', headerShown: true, title: 'Modal' }}
              />
              <Stack.Screen name="favorites" />
              <Stack.Screen name="search" />
              <Stack.Screen name="map" />
              <Stack.Screen name="profile" />
              <Stack.Screen name="notifications" />
              <Stack.Screen name="settings" />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </FavoritesProvider>
      </NetworkProvider>
    </NativeBaseProvider>
  );
}
