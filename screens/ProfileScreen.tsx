import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router'; // <--- Import Href to fix the path error
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  
  // FIX 1: Use 'signOut' instead of 'logout' to match your Context
  const { user, signOut } = useAuth(); 

  // 1. STATE: LOGGED OUT (Show Sign Up / Sign In)
  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <View style={styles.authContainer}>
          <Ionicons name="person-circle-outline" size={100} color="#ccc" />
          <Text style={styles.guestText}>Join us to access your personal dashboard.</Text>
          
          {/* FIX 2: Add 'as Href' to fix the TypeScript error */}
          <TouchableOpacity 
            style={[styles.button, styles.signInButton]} 
            onPress={() => router.push('/signin' as Href)} 
          >
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.signUpButton]} 
            onPress={() => router.push('/signup' as Href)} 
          >
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 2. STATE: LOGGED IN (Show User Data)
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
             {/* Show first letter of name if avatar is missing */}
             <Text style={styles.avatarText}>
                {user.name ? user.name.charAt(0).toUpperCase() : '?'}
             </Text>
        </View>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        <Text style={styles.userRole}>{user.role.toUpperCase()}</Text>
        
        <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color="#666"/>
            <Text style={styles.infoText}>{user.phone || "No phone added"}</Text>
        </View>
      </View>

      {/* FIX 1: Use signOut here as well */}
      <TouchableOpacity style={styles.logoutButton} onPress={() => signOut()}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, backgroundColor: '#fff' },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  
  // Auth State Styles
  authContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  guestText: { fontSize: 16, color: '#666', textAlign: 'center', marginVertical: 20 },
  button: { width: '100%', padding: 15, borderRadius: 12, alignItems: 'center', marginVertical: 8 },
  signInButton: { backgroundColor: '#333' },
  signInText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  signUpButton: { backgroundColor: '#fff', borderWidth: 2, borderColor: '#333' },
  signUpText: { color: '#333', fontWeight: 'bold', fontSize: 16 },

  // Logged In Styles
  profileCard: { backgroundColor: '#fff', margin: 20, padding: 30, borderRadius: 20, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  avatarContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFD700', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: '#333' },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  userEmail: { fontSize: 16, color: '#666', marginBottom: 5 },
  userRole: { fontSize: 12, color: '#999', marginBottom: 15, letterSpacing: 1 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoText: { color: '#444' },
  
  logoutButton: { marginHorizontal: 20, padding: 15, backgroundColor: '#ff4757', borderRadius: 12, alignItems: 'center' },
  logoutText: { color: '#fff', fontWeight: 'bold' }
});