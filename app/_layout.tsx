import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { createContext, useContext, useRef, useState } from 'react';
import { Animated, BackHandler, Easing, Modal, StyleSheet, TouchableWithoutFeedback, useColorScheme, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context'; // <--- NEW IMPORT

import SideDrawer from '@/components/ui/SideDrawer';
import Colors from '@/constants/Colors';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { NetworkProvider } from '@/context/NetworkContext';

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
    const slideAnim = useRef(new Animated.Value(0)).current;

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

// Defined properly before usage
const DrawerRenderer = ({ isDrawerOpen, slideAnim, closeDrawer }: { isDrawerOpen: boolean, slideAnim: Animated.Value, closeDrawer: () => void }) => {
    // Mock isAuthenticated: Replace with actual hook access (e.g., const { isAuthenticated } = useAuth();)
    const isAuthenticated = true; 
    const drawerWidth = 300; 

    const animatedStyle = {
        transform: [{
            translateX: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-drawerWidth, 0], // Slide from off-screen left
            }),
        }],
    };
    
    const overlayStyle = {
        opacity: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
        }),
        // Ensure the overlay fades out quickly but the visibility stays until the animation is complete
        pointerEvents: isDrawerOpen ? 'auto' : 'none',
    } as any;

    if (!isDrawerOpen && (slideAnim as any)._value === 0) return null;

    return (
        <Modal 
            visible={isDrawerOpen} 
            transparent={true} 
            animationType="none" 
            onRequestClose={closeDrawer}
        >
            {/* Overlay Area (Closes drawer on press) */}
            <Animated.View style={[drawerStyles.modalOverlay, overlayStyle]}>
                <TouchableWithoutFeedback onPress={closeDrawer}>
                    <View style={drawerStyles.touchableOverlay}>
                        <TouchableWithoutFeedback> 
                            {/* Drawer Content Container */}
                            <Animated.View style={[drawerStyles.drawerContainer, { width: drawerWidth }, animatedStyle]}>
                                <SideDrawer onClose={closeDrawer} isAuthenticated={isAuthenticated} />
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
// --- END Drawer Context and Renderer ---

// Define custom themes...
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

if (BackHandler && typeof (BackHandler as any).removeEventListener === 'undefined') { /* ... */ }

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? CustomDarkTheme : CustomDefaultTheme;

  return (
    <SafeAreaProvider> 
      <DrawerProvider>
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
                },
                headerTintColor: theme.colors.text,
                headerTitleStyle: {
                  fontWeight: '600', 
                },
                headerBackTitleVisible: false,
              }}
            >
              
              {/* Auth Screens */}
              <Stack.Screen name="login" options={{ animation: 'fade', presentation: 'modal', headerShown: true, title: 'Sign In' }} />
              <Stack.Screen name="register" options={{ animation: 'slide_from_right', headerShown: true, title: 'Create Account' }} />
              <Stack.Screen name="forgot-password" options={{ animation: 'slide_from_right', headerShown: true, title: 'Forgot Password' }} />
              
              {/* Main App with Tabs */}
              <Stack.Screen name="(tabs)" />
              
              {/* Profile/Navigation Links */}
              <Stack.Screen name="favorites" options={{ headerShown: true, title: 'My Favorites' }} />
              <Stack.Screen name="search" options={{ headerShown: true, title: 'Search' }} />
              <Stack.Screen name="map" options={{ headerShown: true, title: 'Map View' }} />
              <Stack.Screen name="profile" options={{ headerShown: true, title: 'User Profile' }} />
              <Stack.Screen name="notifications" options={{ headerShown: true, title: 'Notifications' }} />
              <Stack.Screen name="settings" options={{ headerShown: true, title: 'Settings' }} />
              <Stack.Screen name="edit-profile" options={{ headerShown: true, title: 'Edit Profile' }} />
              <Stack.Screen name="my-listings" options={{ headerShown: true, title: 'My Listings' }} />
              <Stack.Screen name="help" options={{ headerShown: true, title: 'Help & Support' }} />
              <Stack.Screen name="industrial-hub" options={{ headerShown: true, title: 'Industrial Hub' }} /> 
              
              {/* Modals and Detail Screen */}
              <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: true, title: 'Filters & Options', headerTitleAlign: 'center', headerTintColor: Colors.primary[500] }} />
              <Stack.Screen name="listing/[id]" options={{ animation: 'slide_from_right', headerShown: true, title: '', headerTransparent: true, headerTintColor: Colors.text.inverse }} />
            </Stack>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          </ThemeProvider>
        </FavoritesProvider>
      </NetworkProvider>
      </DrawerProvider>
    </SafeAreaProvider>
  );
}