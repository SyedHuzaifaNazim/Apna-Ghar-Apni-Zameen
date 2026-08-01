import AnimatedSplash from '@/components/AnimatedSplash';
import SideDrawer from '@/components/ui/SideDrawer';
import { Colors } from '@/constants/Colors';
import { AuthProvider } from '@/context/AuthContext';
import { CompareProvider } from '@/context/CompareContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { NetworkProvider } from '@/context/NetworkContext';
import { STORAGE_KEYS, storageService } from '@/services/storageService';
import { DarkTheme, DefaultTheme, Href, Stack, ThemeProvider, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Animated, Easing, Modal, StyleSheet, TouchableWithoutFeedback, useColorScheme, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Keep the native splash up until our JS AnimatedSplash has mounted and taken
// over — both use the same brand-green background, so the handoff is seamless.
SplashScreen.preventAutoHideAsync().catch(() => undefined);

// --- Drawer Context ---
const DrawerContext = createContext<{
    isDrawerOpen: boolean;
    openDrawer: () => void;
    closeDrawer: () => void;
}>({
    isDrawerOpen: false,
    openDrawer: () => {},
    closeDrawer: () => {},
});

export const useDrawer = () => useContext(DrawerContext);

const DrawerProvider = ({ children }: { children: React.ReactNode }) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [slideAnim] = useState(() => new Animated.Value(0));

    const openDrawer = () => {
        setIsDrawerOpen(true);
        Animated.timing(slideAnim, {
            toValue: 1,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();
    };
    
    const closeDrawer = () => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
        }).start(() => setIsDrawerOpen(false));
    };

    return (
        <DrawerContext.Provider value={{ isDrawerOpen, openDrawer, closeDrawer }}>
            {children}
            <DrawerRenderer isDrawerOpen={isDrawerOpen} slideAnim={slideAnim} closeDrawer={closeDrawer} />
        </DrawerContext.Provider>
    );
};

// Fixed DrawerRenderer
const DrawerRenderer = ({ isDrawerOpen, slideAnim, closeDrawer }: { isDrawerOpen: boolean, slideAnim: Animated.Value, closeDrawer: () => void }) => {
    const drawerWidth = 300; 

    const animatedStyle = {
        transform: [{
            translateX: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-drawerWidth, 0], 
            }),
        }],
    };
    
    const overlayStyle = {
        opacity: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
        }),
        pointerEvents: isDrawerOpen ? 'auto' : 'none',
    } as any;

    return (
        <Modal 
            visible={isDrawerOpen} 
            transparent={true} 
            animationType="none" 
            onRequestClose={closeDrawer}
        >
            <Animated.View style={[drawerStyles.modalOverlay, overlayStyle]}>
                <TouchableWithoutFeedback onPress={closeDrawer}>
                    <View style={drawerStyles.touchableOverlay}>
                        <TouchableWithoutFeedback> 
                            <Animated.View style={[drawerStyles.drawerContainer, { width: drawerWidth }, animatedStyle]}>
                                {/* SideDrawer now manages its own auth state via Context */}
                                <SideDrawer onClose={closeDrawer} />
                            </Animated.View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Animated.View>
        </Modal>
    );
}

const drawerStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  touchableOverlay: {
      flex: 1,
      flexDirection: 'row',
  },
  drawerContainer: {
    height: '100%',
    backgroundColor: 'white',
  }
});

// --- Theme Configurations ---
const CustomDefaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary[500],
    background: Colors.background.primary,
    card: Colors.background.card,
    text: Colors.text.primary,
    border: Colors.border.light,
    notification: Colors.status.featured,
  },
};

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.primary[500],
    background: '#000000',
    card: '#1c1c1c',
    text: '#ffffff',
    border: '#333333',
    notification: Colors.status.featured,
  },
};

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? CustomDarkTheme : CustomDefaultTheme;
  const router = useRouter();

  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // Hand off from the native splash to the JS AnimatedSplash as soon as we've
  // mounted — they share the same background color, so nothing flashes.
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => undefined);
  }, []);

  // One-time first-launch redirect. The AnimatedSplash overlay stays up until
  // this resolves, so there's no longer a frame of Home visible before the
  // redirect to onboarding happens on a device's very first launch.
  useEffect(() => {
    storageService
      .getItem<boolean>(STORAGE_KEYS.HAS_SEEN_ONBOARDING)
      .then(hasSeen => {
        if (!hasSeen) router.replace('/onboarding' as Href);
      })
      .catch(() => undefined)
      .finally(() => setOnboardingChecked(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaProvider>
      {showSplash && (
        <AnimatedSplash ready={onboardingChecked} onFinished={() => setShowSplash(false)} />
      )}
      {/* ⚠️ CRITICAL FIX: AuthProvider MUST be at the top level */}
      <AuthProvider>
        <NetworkProvider>
          <FavoritesProvider>
          <CompareProvider>
            <ThemeProvider value={theme}>
              <DrawerProvider> 
                <Stack 
                  screenOptions={{
                    headerShown: false, 
                    animation: 'slide_from_right', 
                    gestureEnabled: true, 
                    headerStyle: { backgroundColor: theme.colors.card },
                    headerTintColor: theme.colors.text,
                    headerTitleStyle: { fontWeight: '600' },
                    headerBackTitle: '', 
                  }}
                >
                  <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
                  <Stack.Screen name="signin" options={{ animation: 'fade', presentation: 'modal', headerShown: true, title: 'Sign In' }} />
                  <Stack.Screen name="signup" options={{ animation: 'slide_from_right', headerShown: true, title: 'Create Account' }} />
                  <Stack.Screen name="(auth)/forgot-password" options={{ animation: 'slide_from_right', headerShown: true, title: 'Forgot Password' }} />
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="map" options={{ headerShown: true, title: 'Map View' }} />
                  <Stack.Screen name="notifications" options={{ headerShown: true, title: 'Notifications' }} />
                  <Stack.Screen name="settings" options={{ headerShown: true, title: 'Settings' }} />
                  <Stack.Screen name="edit-profile" options={{ headerShown: true, title: 'Edit Profile' }} />
                  <Stack.Screen name="my-listings" options={{ headerShown: true, title: 'My Listings' }} />
                  <Stack.Screen name="help" options={{ headerShown: true, title: 'Help & Support' }} />
                  <Stack.Screen name="industrial-hub" options={{ headerShown: true, title: 'Industrial Hub' }} />
                  <Stack.Screen name="saved-searches" options={{ headerShown: false }} />
                  <Stack.Screen name="compare" options={{ headerShown: false }} />
                  <Stack.Screen name="agent/[id]" options={{ headerShown: false }} />
                  <Stack.Screen name="post-listing" options={{ headerShown: false }} />
                  <Stack.Screen name="listing/[id]" options={{ animation: 'slide_from_right', headerShown: true, title: '', headerTransparent: true, headerTintColor: Colors.text.inverse }} />
                </Stack>
              </DrawerProvider>
            </ThemeProvider>
          </CompareProvider>
          </FavoritesProvider>
        </NetworkProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}