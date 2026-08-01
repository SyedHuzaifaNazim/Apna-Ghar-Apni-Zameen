import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppButton from '@/components/base/AppButton';
import AppText from '@/components/base/AppText';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/Layout';
import { useAuth } from '@/context/AuthContext';

interface SideDrawerProps {
  onClose: () => void;
}

interface DrawerLink {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: Href;
  requiresAuth?: boolean;
}

const SIDEBAR_LINKS: DrawerLink[] = [
  { title: 'Home', icon: 'home-outline', route: '/' },
  { title: 'Industrial Hub', icon: 'business-outline', route: '/industrial-hub' },
  { title: 'Map View', icon: 'map-outline', route: '/map' },
  // Favorites are device-local, not account-tied (see FavoritesScreen) — guests
  // can use them too, so this must not gate behind sign-in.
  { title: 'My Favorites', icon: 'heart-outline', route: '/favorites' },
  { title: 'My Listings', icon: 'briefcase-outline', route: '/my-listings', requiresAuth: true },
];

const LEGAL_LINKS: DrawerLink[] = [
  { title: 'My Profile', icon: 'person-outline', route: '/profile', requiresAuth: true },
  { title: 'Settings', icon: 'settings-outline', route: '/settings' },
  { title: 'Help & Support', icon: 'help-circle-outline', route: '/help' },
];

const SideDrawer: React.FC<SideDrawerProps> = ({ onClose }) => {
  const router = useRouter();
  const { height: screenHeight } = useWindowDimensions();
  const { user, signOut } = useAuth();

  const isAuthenticated = !!user;

  const handleLogout = async () => {
    onClose();
    await signOut();
    router.replace('/(tabs)/' as Href);
  };

  const handleNavigation = (route: Href, requiresAuth: boolean = false) => {
    onClose();
    if (requiresAuth && !isAuthenticated) {
      router.push('/signin' as Href);
      Alert.alert('Sign In Required', 'Please sign in to access this feature.');
    } else {
      router.push(route);
    }
  };

  return (
    <View style={[styles.container, { height: screenHeight }]}>
      <SafeAreaView style={styles.flex1} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <AppText variant="h3" weight="bold">
            Menu
          </AppText>
          <TouchableOpacity onPress={onClose} style={styles.closeButton} accessibilityRole="button">
            <Ionicons name="close-circle" size={28} color={Colors.text.secondary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.authSection}>
            {isAuthenticated ? (
              <View style={styles.authInfo}>
                <Ionicons name="person-circle" size={56} color={Colors.primary[500]} />
                <AppText variant="body" weight="semibold">
                  {user?.name || 'User'}
                </AppText>
                <AppText variant="bodySmall" color="secondary">
                  {user?.email || ''}
                </AppText>
              </View>
            ) : (
              <AppButton
                onPress={() => handleNavigation('/signin' as Href)}
                style={styles.authButton}
                leftIcon={<Ionicons name="log-in" size={18} color={Colors.text.inverse} />}
              >
                Sign In / Register
              </AppButton>
            )}
          </View>

          <View style={styles.linkGroup}>
            {SIDEBAR_LINKS.map(link => (
              <TouchableOpacity
                key={link.title}
                style={styles.linkItem}
                onPress={() => handleNavigation(link.route, link.requiresAuth)}
                activeOpacity={0.7}
                accessibilityRole="button"
              >
                <Ionicons name={link.icon} size={22} color={Colors.primary[500]} />
                <AppText variant="body" style={styles.linkText}>
                  {link.title}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.linkGroup}>
            {LEGAL_LINKS.map(link => (
              <TouchableOpacity
                key={link.title}
                style={styles.linkItem}
                onPress={() => handleNavigation(link.route, link.requiresAuth)}
                activeOpacity={0.7}
                accessibilityRole="button"
              >
                <Ionicons name={link.icon} size={22} color={Colors.gray[500]} />
                <AppText variant="body" style={styles.linkText}>
                  {link.title}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>

          {isAuthenticated && (
            <TouchableOpacity
              style={[styles.linkItem, styles.logoutButton]}
              onPress={handleLogout}
              activeOpacity={0.7}
              accessibilityRole="button"
            >
              <Ionicons name="log-out-outline" size={22} color={Colors.error[500]} />
              <AppText variant="body" weight="medium" color="error" style={styles.linkText}>
                Log Out
              </AppText>
            </TouchableOpacity>
          )}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  container: {
    width: 300,
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
    padding: Spacing.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  closeButton: { padding: Spacing.xs },
  scrollContent: { padding: Spacing.md },

  authSection: {
    paddingVertical: Spacing.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    marginBottom: Spacing.md,
  },
  authInfo: { alignItems: 'center', gap: 4 },
  authButton: { width: '100%' },

  linkGroup: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    marginBottom: Spacing.md,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.xs,
    gap: Spacing.md,
  },
  linkText: { color: Colors.text.primary, fontSize: 16 },
  logoutButton: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
    backgroundColor: Colors.error[50],
    borderRadius: BorderRadius.lg,
  },
  bottomSpacer: { height: Spacing.xl },
});

export default SideDrawer;
