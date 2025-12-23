import { Href, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function SignInScreen() {
  const router = useRouter();
  const { signIn } = useAuth(); // Use the Context function
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      // This calls the logic in AuthContext (which handles the API URL)
      await signIn(email, password);
      // If successful, navigate back
      router.back(); 
    } catch (error: any) {
      // Error is already alerted in AuthContext, but we can log it here
      console.log("Login failed in screen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <TextInput 
        placeholder="Email" 
        style={styles.input} 
        autoCapitalize="none"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput 
        placeholder="Password" 
        style={styles.input} 
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleSignIn}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "Signing In..." : "Sign In"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/signup' as Href)}>
         <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f8f9fa' },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, color: '#333', textAlign: 'center' },
    input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
    button: { backgroundColor: '#28a745', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
    buttonDisabled: { backgroundColor: '#94d3a2' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    linkText: { color: '#007bff', textAlign: 'center' },
});