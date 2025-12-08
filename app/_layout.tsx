import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider } from 'native-base'; // RE-INTRODUCED
import { BackHandler, useColorScheme } from 'react-native';
import 'react-native-reanimated';

import Colors from '@/constants/Colors';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { NetworkProvider } from '@/context/NetworkContext';

// Define custom themes using the imported Colors
const CustomDefaultTheme: typeof DefaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary[500],
    background: Colors.background.primary,
    card: Colors.background.card,
    text: Colors.text.primary,
    border: Colors.border.light,
    notification: Colors.error[500],
  },
};

const CustomDarkTheme: typeof DarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.primary[500],
    background: Colors.gray[900],
    card: Colors.gray[800],
    text: Colors.text.inverse,
    border: Colors.gray[700],
    notification: Colors.error[500],
  },
};


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
  const theme = colorScheme === 'dark' ? CustomDarkTheme : DefaultTheme;

  return (
    <NativeBaseProvider> {/* WRAPS THE ENTIRE APPLICATION */}
      <NetworkProvider>
        <FavoritesProvider>
          <ThemeProvider value={theme}>
            <Stack 
              screenOptions={{
                headerShown: false, 
                animation: 'slide_from_right', 
                gestureEnabled: true, 
                headerStyle: {
                  backgroundColor: theme.colors.card,
                  shadowColor: 'transparent', 
                  elevation: 0,
                },
                headerTintColor: theme.colors.text,
                headerTitleStyle: {
                  fontWeight: '600', 
                },
                headerBackTitleVisible: false,
              }}
            >
              
              {/* Auth Screens */}
              <Stack.Screen 
                name="login" 
                options={{ 
                  animation: 'fade',
                  presentation: 'modal',
                  headerShown: true, 
                  title: 'Sign In',
                }} 
              />
              <Stack.Screen 
                name="register" 
                options={{ 
                  animation: 'slide_from_right',
                  headerShown: true,
                  title: 'Create Account',
                }} 
              />
              <Stack.Screen 
                name="forgot-password" 
                options={{ 
                  animation: 'slide_from_right',
                  headerShown: true,
                  title: 'Forgot Password',
                }} 
              />
              
              {/* Main App with Tabs */}
              <Stack.Screen name="(tabs)" />
              
              {/* Modal Screens - FilterModal uses this route */}
              <Stack.Screen
                name="modal"
                options={{ 
                  presentation: 'modal', 
                  headerShown: true, 
                  title: 'Filters & Options', 
                  headerTitleAlign: 'center', 
                  headerTintColor: Colors.primary[500], 
                }}
              />
              
              {/* Other Screens */}
              <Stack.Screen name="favorites" options={{ headerShown: true, title: 'My Favorites' }} />
              <Stack.Screen name="search" options={{ headerShown: true, title: 'Search' }} />
              <Stack.Screen name="map" options={{ headerShown: true, title: 'Map View' }} />
              <Stack.Screen name="profile" options={{ headerShown: true, title: 'User Profile' }} />
              <Stack.Screen name="notifications" options={{ headerShown: true, title: 'Notifications' }} />
              <Stack.Screen name="settings" options={{ headerShown: true, title: 'Settings' }} />
              
              {/* Dynamic Listing Screen */}
              <Stack.Screen 
                name="listing/[id]" 
                options={{ 
                  animation: 'slide_from_right',
                  headerShown: true,
                  title: '', 
                  headerTransparent: true, 
                  headerTintColor: Colors.text.inverse, 
                }} 
              />
            </Stack>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          </ThemeProvider>
        </FavoritesProvider>
      </NetworkProvider>
    </NativeBaseProvider>
  );
}