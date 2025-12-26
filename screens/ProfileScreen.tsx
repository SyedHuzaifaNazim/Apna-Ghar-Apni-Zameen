import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '../constants/Colors';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive", 
          onPress: async () => {
            await signOut();
            router.replace('/(tabs)/' as Href); // Go home after logout
          }
        }
      ]
    );
  };

  // --- GUEST VIEW (Not Logged In) ---
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.guestContainer}>
          <Image 
            source={require('../assets/images/logo_agaz.png')} 
            style={styles.guestLogo}
            resizeMode="contain"
          />
          <Text style={styles.guestTitle}>Welcome to Apna Ghar</Text>
          <Text style={styles.guestSubtitle}>
            Log in to manage your listings, save favorites, and contact agents.
          </Text>

          <View style={styles.guestButtonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.primaryButton]} 
              onPress={() => router.push('/signin' as Href)}
            >
              <Text style={styles.primaryButtonText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.outlineButton]} 
              onPress={() => router.push('/signup' as Href)}
            >
              <Text style={styles.outlineButtonText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // --- LOGGED IN VIEW ---
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{user.role ? user.role.toUpperCase() : 'MEMBER'}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => router.push('/edit-profile' as Href)} style={styles.editButton}>
            <Ionicons name="pencil" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Stats / Quick Actions (Optional) */}
        <View style={styles.statsContainer}>
          <TouchableOpacity style={styles.statCard} onPress={() => router.push('/my-listings' as Href)}>
            <Ionicons name="home" size={24} color={Colors.primary[500]} />
            <Text style={styles.statLabel}>My Listings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statCard} onPress={() => router.push('/favorites' as Href)}>
            <Ionicons name="heart" size={24} color={Colors.status.featured} />
            <Text style={styles.statLabel}>Favorites</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statCard} onPress={() => router.push('/notifications' as Href)}>
            <Ionicons name="notifications" size={24} color="#FFD700" />
            <Text style={styles.statLabel}>Alerts</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <MenuItem 
            icon="person-outline" 
            label="Personal Details" 
            onPress={() => router.push('/edit-profile' as Href)} 
          />
          <MenuItem 
            icon="settings-outline" 
            label="Settings" 
            onPress={() => router.push('/settings' as Href)} 
          />
           <MenuItem 
            icon="business-outline" 
            label="Industrial Hub" 
            onPress={() => router.push('/industrial-hub' as Href)} 
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <MenuItem 
            icon="help-circle-outline" 
            label="Help & FAQ" 
            onPress={() => router.push('/help' as Href)} 
          />
          <MenuItem 
            icon="information-circle-outline" 
            label="About Us" 
            onPress={() => Alert.alert("About", "Apna Ghar Apni Zameen v1.0.0")} 
          />
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#FF4757" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

// Helper Component for Menu Items
const MenuItem = ({ icon, label, onPress }: { icon: any, label: string, onPress: () => void }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuIconBox}>
      <Ionicons name={icon} size={22} color="#555" />
    </View>
    <Text style={styles.menuLabel}>{label}</Text>
    <Ionicons name="chevron-forward" size={20} color="#ccc" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },

  // Guest Styles
  guestContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  guestLogo: { width: 120, height: 120, marginBottom: 20 },
  guestTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  guestSubtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 40, lineHeight: 24 },
  guestButtonContainer: { width: '100%', gap: 15 },

  // Logged In Header
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 24, 
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  avatarContainer: { 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    backgroundColor: Colors.primary[500], 
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 16
  },
  avatarText: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  userInfo: { flex: 1 },
  userName: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  userEmail: { fontSize: 14, color: '#666', marginTop: 2 },
  roleBadge: { 
    marginTop: 6, 
    backgroundColor: '#E6F4FE', 
    alignSelf: 'flex-start', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 6 
  },
  roleText: { fontSize: 10, color: Colors.primary[500], fontWeight: '700' },
  editButton: { padding: 8 },

  // Stats Cards
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', padding: 20 },
  statCard: { 
    flex: 1, 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2
  },
  statLabel: { marginTop: 8, fontSize: 12, fontWeight: '600', color: '#555' },

  // Menu Sections
  section: { marginTop: 20, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#888', marginBottom: 10, marginLeft: 4, textTransform: 'uppercase' },
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 10,
    shadowColor: '#000', 
    shadowOpacity: 0.03, 
    shadowRadius: 3, 
    elevation: 1 
  },
  menuIconBox: { width: 32, alignItems: 'center', marginRight: 12 },
  menuLabel: { flex: 1, fontSize: 16, color: '#333', fontWeight: '500' },

  // Buttons
  button: { paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  primaryButton: { backgroundColor: Colors.primary[500] },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  outlineButton: { backgroundColor: 'transparent', borderWidth: 2, borderColor: Colors.primary[500] },
  outlineButtonText: { color: Colors.primary[500], fontSize: 16, fontWeight: 'bold' },

  logoutButton: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 30, 
    marginBottom: 50,
    padding: 16,
    marginHorizontal: 20,
    backgroundColor: '#FFF0F1',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD1D5'
  },
  logoutText: { color: '#FF4757', fontWeight: 'bold', fontSize: 16, marginLeft: 8 }
});