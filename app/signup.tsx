import { Href, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useAuth(); // Use context
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if(!formData.name || !formData.email || !formData.password) {
       Alert.alert("Error", "Please fill in all required fields");
       return;
    }

    const handleSignUp = async () => {
    if(!formData.name || !formData.email || !formData.password) {
       Alert.alert("Error", "Please fill in all required fields");
       return;
    }

    setLoading(true);
    try {
      // FIX: Add 'role' here to satisfy TypeScript
      await signUp({ 
        ...formData, 
        role: 'buyer' // <--- Default role added here
      });
      
      router.replace('/signin' as Href);
    } catch (error) {
      console.log("Signup failed");
    } finally {
      setLoading(false);
    }
  };

    setLoading(true);
    try {
      // This calls AuthContext logic
      await signUp({ 
        ...formData, 
        role: 'buyer' // <--- Default role added here
      });
      // If success, go to sign in
      router.replace('/signin' as Href);
    } catch (error) {
      console.log("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      
      <TextInput 
        placeholder="Full Name" 
        style={styles.input} 
        onChangeText={t => setFormData({...formData, name: t})}
      />
      <TextInput 
        placeholder="Email" 
        style={styles.input} 
        autoCapitalize="none"
        onChangeText={t => setFormData({...formData, email: t})}
      />
      <TextInput 
        placeholder="Password" 
        style={styles.input} 
        secureTextEntry 
        onChangeText={t => setFormData({...formData, password: t})}
      />
       <TextInput 
        placeholder="Phone" 
        style={styles.input} 
        keyboardType="phone-pad"
        onChangeText={t => setFormData({...formData, phone: t})}
      />

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleSignUp}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "Creating..." : "Sign Up"}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => router.push('/signin' as Href)}>
        <Text style={styles.linkText}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f8f9fa' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, color: '#333', textAlign: 'center' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  button: { backgroundColor: '#007bff', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  buttonDisabled: { backgroundColor: '#87cefa' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  linkText: { color: '#007bff', textAlign: 'center', marginTop: 10 },
});