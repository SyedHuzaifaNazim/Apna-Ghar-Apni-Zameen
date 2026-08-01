import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppButton from '@/components/base/AppButton';
import AppText from '@/components/base/AppText';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Shadows, Spacing } from '@/constants/Layout';
import { useAuth } from '@/context/AuthContext';

const LOGO = require('@/assets/images/transparent-logo1.png');

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} accessibilityRole="button">
    <View style={styles.menuIconBox}>
      <Ionicons name={icon} size={20} color={Colors.gray[600]} />
    </View>
    <AppText variant="body" weight="medium" style={styles.flex}>
      {label}
    </AppText>
    <Ionicons name="chevron-forward" size={18} color={Colors.gray[400]} />
  </TouchableOpacity>
);

const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/(tabs)/' as Href);
        },
      },
    ]);
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.guestContainer}>
          <Image source={LOGO} style={styles.guestLogo} resizeMode="contain" />
          <AppText variant="h3" weight="bold" align="center" style={styles.spacedTop}>
            Welcome to Farsh e Zameen
          </AppText>
          <AppText variant="bodySmall" color="muted" align="center" style={styles.guestSubtitle}>
            Sign in to manage your listings, save favorites, and contact agents.
          </AppText>

          <View style={styles.guestButtonContainer}>
            <AppButton onPress={() => router.push('/signin' as Href)}>Sign In</AppButton>
            <AppButton variant="outline" onPress={() => router.push('/signup' as Href)}>
              Create Account
            </AppButton>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <AppText variant="h2" weight="bold" color="inverse">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </AppText>
          </View>
          <View style={styles.flex}>
            <AppText variant="h4" weight="bold">
              {user.name}
            </AppText>
            <AppText variant="bodySmall" color="muted">
              {user.email}
            </AppText>
            <View style={styles.roleBadge}>
              <AppText variant="caption" weight="bold" color="brand">
                {user.role ? user.role.toUpperCase() : 'BUYER'}
              </AppText>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/edit-profile' as Href)}
            style={styles.editButton}
            accessibilityRole="button"
            accessibilityLabel="Edit profile"
          >
            <Ionicons name="pencil" size={18} color={Colors.gray[600]} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <TouchableOpacity style={styles.statCard} onPress={() => router.push('/my-listings' as Href)}>
            <Ionicons name="home" size={22} color={Colors.primary[500]} />
            <AppText variant="caption" weight="semibold" style={styles.statLabel}>
              My Listings
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statCard} onPress={() => router.push('/favorites' as Href)}>
            <Ionicons name="heart" size={22} color={Colors.status.featured} />
            <AppText variant="caption" weight="semibold" style={styles.statLabel}>
              Favorites
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statCard} onPress={() => router.push('/notifications' as Href)}>
            <Ionicons name="notifications" size={22} color={Colors.warning[500]} />
            <AppText variant="caption" weight="semibold" style={styles.statLabel}>
              Alerts
            </AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <AppText variant="caption" weight="bold" color="muted" style={styles.sectionTitle}>
            ACCOUNT
          </AppText>
          <MenuItem icon="person-outline" label="Personal Details" onPress={() => router.push('/edit-profile' as Href)} />
          <MenuItem icon="settings-outline" label="Settings" onPress={() => router.push('/settings' as Href)} />
          <MenuItem
            icon="bookmarks-outline"
            label="Saved Searches"
            onPress={() => router.push('/saved-searches' as Href)}
          />
          <MenuItem
            icon="business-outline"
            label="Industrial Hub"
            onPress={() => router.push('/industrial-hub' as Href)}
          />
        </View>

        <View style={styles.section}>
          <AppText variant="caption" weight="bold" color="muted" style={styles.sectionTitle}>
            SUPPORT
          </AppText>
          <MenuItem icon="help-circle-outline" label="Help & FAQ" onPress={() => router.push('/help' as Href)} />
          <MenuItem
            icon="information-circle-outline"
            label="About Us"
            onPress={() => Alert.alert('About', 'Farsh e Zameen v1.0.0')}
          />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} accessibilityRole="button">
          <Ionicons name="log-out-outline" size={18} color={Colors.error[500]} />
          <AppText variant="body" weight="bold" color="error" style={styles.logoutText}>
            Log Out
          </AppText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.secondary },
  flex: { flex: 1 },
  scrollContent: { paddingBottom: Spacing.xxl },

  guestContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  guestLogo: { width: 120, height: 60 },
  spacedTop: { marginTop: Spacing.lg },
  guestSubtitle: { marginTop: Spacing.sm, marginBottom: Spacing.xl, lineHeight: 22 },
  guestButtonContainer: { width: '100%', gap: Spacing.sm },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.background.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    gap: Spacing.md,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleBadge: {
    marginTop: 6,
    backgroundColor: Colors.primary[50],
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  editButton: { padding: Spacing.xs },

  statsContainer: { flexDirection: 'row', gap: Spacing.sm, padding: Spacing.md },
  statCard: {
    flex: 1,
    backgroundColor: Colors.background.card,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    gap: 6,
    ...Shadows.sm,
  },
  statLabel: { color: Colors.text.secondary },

  section: { marginTop: Spacing.sm, paddingHorizontal: Spacing.md },
  sectionTitle: { marginBottom: Spacing.sm, marginLeft: Spacing.xs, letterSpacing: 0.5 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.card,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  menuIconBox: { width: 32, alignItems: 'center' },

  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginHorizontal: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.error[50],
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.error[100],
  },
  logoutText: { marginLeft: Spacing.sm },
});

export default ProfileScreen;
