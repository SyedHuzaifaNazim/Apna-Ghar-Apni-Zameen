import { useRouter } from 'expo-router'; // <--- Use this
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function SignInScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
      const response = await fetch('http://localhost:5000/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (data.status === 'ok') {
        login(data.user); 
        router.back(); // <--- Go back to Profile after login
      } else {
        Alert.alert("Failed", "Invalid email or password");
      }
    } catch (error) {
        Alert.alert("Error", "Server connection failed");
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
      />
      <TextInput 
        placeholder="Password" 
        style={styles.input} 
        secureTextEntry
        onChangeText={setPassword}
      />
      
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/signup')}>
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
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    linkText: { color: '#007bff', textAlign: 'center' },
});