import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import AppButton from '@/components/base/AppButton';
import AppText from '@/components/base/AppText';
import { Colors } from '@/constants/Colors';

const EditProfileScreen: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: 'Syed Huzaifa Nazim',
    email: 'syed.huzaifa@apnaghar.com',
    phone: '03XX-XXXXXXX',
    city: 'Karachi',
    // ... other fields
  });
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    // Simulate API call to save profile
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Your profile has been updated!');
      router.back();
    }, 1500);
  };
  
  const handleInputChange = (key: string, value: string) => {
      setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <SafeAreaView style={styles.flex1}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.primary[500]} />
        </TouchableOpacity>
        <AppText variant="h2" weight="bold">Edit Profile</AppText>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={50} color="white" /> 
          </View>
          <TouchableOpacity style={styles.changeAvatarButton}>
              <AppText variant="body" color="primary" style={styles.changeAvatarText}>
                  Change Photo
              </AppText>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <AppText variant="h3" weight="bold" style={styles.formTitle}>Personal Information</AppText>
          
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={formData.name}
            onChangeText={(text) => handleInputChange('name', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={formData.email}
            keyboardType="email-address"
            onChangeText={(text) => handleInputChange('email', text)}
            editable={false} // Email typically shouldn't be easily editable
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={formData.phone}
            keyboardType="phone-pad"
            onChangeText={(text) => handleInputChange('phone', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="City"
            value={formData.city}
            onChangeText={(text) => handleInputChange('city', text)}
          />
        </View>

        {/* Save Button */}
        <AppButton 
          onPress={handleSave}
          isLoading={loading}
          style={styles.saveButton}
        >
          Save Changes
        </AppButton>
        <View style={{ height: 40 }}/>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  scrollContent: {
    padding: 16,
  },
  // Avatar
  avatarSection: {
      alignItems: 'center',
      marginBottom: 32,
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
  changeAvatarButton: {
      padding: 8,
  },
  changeAvatarText: {
      textDecorationLine: 'underline',
  },
  // Form
  formSection: {
      gap: 16,
      marginBottom: 32,
  },
  formTitle: {
      marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: Colors.gray[50],
  },
  saveButton: {
      marginHorizontal: 16,
      marginBottom: 20,
  }
});

export default EditProfileScreen;