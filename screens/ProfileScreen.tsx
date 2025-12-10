import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import AppText from '@/components/base/AppText';
import { Colors } from '@/constants/Colors';

// --- Helper Components ---

interface ProfileLinkProps {
  icon: string;
  title: string;
  description: string;
  route: string;
  color?: string;
  isDanger?: boolean;
}

const ProfileLink: React.FC<ProfileLinkProps> = ({
  icon,
  title,
  description,
  route,
  color = Colors.primary[500],
  isDanger = false,
}) => {
  const router = useRouter();
  return (
    <TouchableOpacity 
      style={styles.linkContainer}
      onPress={() => router.push(route)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconWrapper, { backgroundColor: isDanger ? Colors.error[50] : Colors.primary[50] }]}>
        <Ionicons name={icon as any} size={24} color={isDanger ? Colors.error[500] : color} />
      </View>
      <View style={styles.textContainer}>
        <AppText variant="body" weight="semibold" style={isDanger ? styles.dangerText : styles.defaultText}>
          {title}
        </AppText>
        <AppText variant="small" color="secondary">
          {description}
        </AppText>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.gray[400]} />
    </TouchableOpacity>
  );
};


const ProfileScreen: React.FC = () => {
  const router = useRouter();
  
  // Mock User Data
  const user = {
    name: 'Syed Huzaifa Nazim',
    email: 'syed.huzaifa@apnaghar.com',
    profilePic: 'https://images.unsplash.com/photo-1535713875002-d1d0cfce7232?w=800',
    isLoggedIn: true,
  };

  const handleLogout = () => {
    // Implement actual logout logic here (e.g., clear tokens, call API)
    // After logout, redirect to login page
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.flex1}>
      <ScrollView style={styles.flex1} contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            {/* Placeholder for Image component */}
            <Ionicons name="person" size={50} color="white" /> 
          </View>
          <AppText variant="h2" weight="bold" style={styles.nameText}>
            {user.name}
          </AppText>
          <AppText variant="body" color="secondary">
            {user.email}
          </AppText>
          <TouchableOpacity onPress={() => router.push('/edit-profile')}>
             <AppText variant="body" color="primary" style={styles.editButton}>
                Edit Profile
             </AppText>
          </TouchableOpacity>
        </View>

        {/* Account Management Section */}
        <View style={styles.section}>
          <AppText variant="h3" weight="bold" style={styles.sectionTitle}>
            Account
          </AppText>
          <View style={styles.linksContainer}>
            <ProfileLink
              icon="heart-outline"
              title="My Favorites"
              description="View your saved properties"
              route="/favorites"
            />
            <ProfileLink
              icon="home-outline"
              title="My Listings"
              description="Properties you have posted (Agent/Owner)"
              route="/my-listings"
              color={Colors.secondary[500]}
            />
            <ProfileLink
              icon="notifications-outline"
              title="Notifications"
              description="Check alerts and messages"
              route="/notifications"
            />
          </View>
        </View>
        
        {/* Settings & Support Section */}
        <View style={styles.section}>
          <AppText variant="h3" weight="bold" style={styles.sectionTitle}>
            Settings & Support
          </AppText>
          <View style={styles.linksContainer}>
            <ProfileLink
              icon="settings-outline"
              title="Settings"
              description="Manage app preferences and privacy"
              route="/settings"
            />
            <ProfileLink
              icon="help-circle-outline"
              title="Help & Support"
              description="FAQ and contact customer service"
              route="/help"
            />
          </View>
        </View>
        
        {/* Logout Section */}
        <View style={styles.section}>
          <ProfileLink
            icon="log-out-outline"
            title="Log Out"
            description="Sign out of your account"
            route="" // Handled directly via onPress
            isDanger={true}
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  scrollContent: {
    paddingVertical: 100,
    paddingHorizontal: 16,
    gap: 24,
  },
  // Header
  profileHeader: {
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  nameText: {
    fontSize: 24,
  },
  editButton: {
    marginTop: 8,
    textDecorationLine: 'underline',
  },
  // Sections
  section: {
    gap: 12,
  },
  sectionTitle: {
    marginLeft: 8,
  },
  linksContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border.light,
    overflow: 'hidden',
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    backgroundColor: 'white',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  defaultText: {
      color: Colors.text.primary,
  },
  dangerText: {
    color: Colors.error[500],
  },
});

export default ProfileScreen;