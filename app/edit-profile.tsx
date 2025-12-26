import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '../constants/Colors';
import { useAuth } from '../context/AuthContext';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateProfile, isLoading } = useAuth();

  // Initialize form with current user data
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  
  // Email is usually read-only for security, or requires a separate verification process
  const email = user?.email || ''; 

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }

    // Call the context function which now connects to the backend
    await updateProfile({ name, phone });
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity 
          onPress={handleSave} 
          disabled={isLoading}
          style={styles.saveButton}
        >
          <Text style={[styles.saveText, isLoading && { opacity: 0.5 }]}>
            {isLoading ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          
          {/* Avatar Section (Placeholder for future upload feature) */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {name ? name.charAt(0).toUpperCase() : 'U'}
              </Text>
              <View style={styles.cameraIcon}>
                <Ionicons name="camera" size={16} color="#fff" />
              </View>
            </View>
            <Text style={styles.changePhotoText}>Change Profile Photo</Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color="#666" />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={[styles.inputWrapper, styles.disabledInput]}>
              <Ionicons name="mail-outline" size={20} color="#999" />
              <TextInput
                style={[styles.input, { color: '#999' }]}
                value={email}
                editable={false} // Email is non-editable
              />
              <Ionicons name="lock-closed" size={16} color="#ccc" />
            </View>
            <Text style={styles.helperText}>Email cannot be changed.</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="call-outline" size={20} color="#666" />
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="+92 300 1234567"
                keyboardType="phone-pad"
              />
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  backButton: { padding: 5 },
  saveButton: { padding: 5 },
  saveText: { fontSize: 16, fontWeight: 'bold', color: Colors.primary[500] },

  content: { padding: 24 },

  // Avatar
  avatarSection: { alignItems: 'center', marginBottom: 30 },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  avatarText: { fontSize: 40, color: '#fff', fontWeight: 'bold' },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#333',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  changePhotoText: { color: Colors.primary[500], fontWeight: '600' },

  // Form
  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },
  input: { flex: 1, marginLeft: 10, fontSize: 16, color: '#333' },
  disabledInput: { backgroundColor: '#f9f9f9', borderColor: '#eee' },
  helperText: { fontSize: 12, color: '#999', marginTop: 5, marginLeft: 5 },
});