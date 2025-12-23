// components/ui/SideDrawer.tsx
import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Dimensions, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import AppButton from '@/components/base/AppButton';
import AppText from '@/components/base/AppText';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext'; // <--- 1. Import Context

const { height: screenHeight } = Dimensions.get('window');

interface SideDrawerProps {
  onClose: () => void;
}

const SIDEBAR_LINKS = [
    { title: "Home", icon: "home-outline", route: "/(tabs)/index" },
    { title: "Industrial Hub", icon: "business-outline", route: "/industrial-hub" },
    { title: "Map View", icon: "map-outline", route: "/map" },
    { title: "My Favorites", icon: "heart-outline", route: "/favorites", requiresAuth: true },
    { title: "My Listings", icon: "home-outline", route: "/my-listings", requiresAuth: true },
];

const LEGAL_LINKS = [
    { title: "My Profile", icon: "person-outline", route: "/profile", requiresAuth: true },
    { title: "Settings", icon: "settings-outline", route: "/settings" },
    { title: "Help & Support", icon: "help-circle-outline", route: "/help" },
];

const SideDrawer: React.FC<SideDrawerProps> = ({ onClose }) => {
  const router = useRouter();
  const { user, signOut } = useAuth(); // <--- 2. Get real user state
  
  const isAuthenticated = !!user; // Check if user exists

  const handleLogout = async () => {
      onClose();
      await signOut(); // <--- 3. Call real sign out
      router.replace('/signin' as Href);
      Alert.alert("Logged Out", "You have been logged out successfully.");
  };

  const handleNavigation = (route: string, requiresAuth: boolean = false) => {
      onClose();
      if (requiresAuth && !isAuthenticated) {
          router.push('/signin' as Href); // <--- 4. Correct route to 'signin'
          Alert.alert("Sign In Required", "Please sign in to access this feature.");
      } else {
          router.push(route as Href);
      }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.flex1}>
        <View style={styles.header}>
            <AppText variant="h2" weight="bold" style={styles.headerTitle}>Menu</AppText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close-circle" size={30} color={Colors.text.secondary} />
            </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContent}>
            {/* User Info / Auth Status */}
            <View style={styles.authSection}>
                {isAuthenticated ? (
                    <View style={styles.authInfo}>
                        <Ionicons name="person-circle" size={60} color={Colors.primary[500]} />
                        {/* 5. Display Real User Data */}
                        <AppText variant="body" weight="semibold">
                            {user?.name || "User"}
                        </AppText>
                        <AppText variant="small" color="secondary">
                            {user?.email || ""}
                        </AppText>
                    </View>
                ) : (
                    <AppButton
                        onPress={() => handleNavigation('/signin')} // <--- Correct route
                        style={styles.authButton}
                        leftIcon={<Ionicons name="log-in" size={18} color="white" />}
                    >
                        Sign In / Register
                    </AppButton>
                )}
            </View>

            {/* Main Navigation Links */}
            <View style={styles.linkGroup}>
                {SIDEBAR_LINKS.map(link => (
                    <TouchableOpacity
                        key={link.title}
                        style={styles.linkItem}
                        onPress={() => handleNavigation(link.route, link.requiresAuth)}
                        activeOpacity={0.7}
                    >
                        <Ionicons name={link.icon as any} size={24} color={Colors.primary[500]} />
                        <AppText variant="body" style={styles.linkText}>{link.title}</AppText>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Legal Links */}
            <View style={styles.linkGroup}>
                {LEGAL_LINKS.map(link => (
                    <TouchableOpacity
                        key={link.title}
                        style={styles.linkItem}
                        onPress={() => handleNavigation(link.route, link.requiresAuth)}
                        activeOpacity={0.7}
                    >
                        <Ionicons name={link.icon as any} size={24} color={Colors.gray[500]} />
                        <AppText variant="body" style={styles.linkText}>{link.title}</AppText>
                    </TouchableOpacity>
                ))}
            </View>
            
            {isAuthenticated && (
                <TouchableOpacity
                    style={[styles.linkItem, styles.logoutButton]}
                    onPress={handleLogout}
                    activeOpacity={0.7}
                >
                    <Ionicons name="log-out-outline" size={24} color={Colors.error[500]} />
                    <AppText variant="body" style={[styles.linkText, { color: Colors.error[500] }]}>Log Out</AppText>
                </TouchableOpacity>
            )}
            <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  container: {
    width: 300, 
    height: screenHeight,
    backgroundColor: Colors.background.card,
    shadowColor: Colors.shadow.dark,
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  headerTitle: {
      color: Colors.text.primary,
  },
  closeButton: {
      padding: 4,
  },
  scrollContent: {
    padding: 16,
  },
  // Auth Section
  authSection: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    marginBottom: 16,
  },
  authInfo: {
    alignItems: 'center',
    gap: 4,
  },
  authButton: {
      width: '100%',
  },
  // Links
  linkGroup: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    marginBottom: 16,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 16,
  },
  linkText: {
    color: Colors.text.primary,
    fontSize: 16,
  },
  logoutButton: {
      marginTop: 10,
      marginBottom: 20,
      backgroundColor: Colors.error[50],
      borderRadius: 12,
  }
});

export default SideDrawer;