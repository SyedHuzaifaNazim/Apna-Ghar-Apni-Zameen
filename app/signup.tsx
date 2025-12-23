import { useRouter } from 'expo-router'; // <--- Use this for navigation
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignUpScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });

  const handleSignUp = async () => {
    try {
      // Use your computer IP if on device, localhost if on simulator
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.status === 'ok') {
        Alert.alert("Success", "Account created!");
        router.replace('/signin'); // <--- Navigate to signin file
      } else {
        Alert.alert("Error", data.error);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not connect to server");
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

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => router.push('/signin')}>
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
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  linkText: { color: '#007bff', textAlign: 'center', marginTop: 10 },
});