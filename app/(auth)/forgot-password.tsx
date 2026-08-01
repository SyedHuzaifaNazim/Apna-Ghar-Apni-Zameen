import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '../../constants/Colors';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSendResetLink = async () => {
    if (!email.trim() || !emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      // TODO: wire up to a real backend endpoint (e.g. POST /forgot-password)
      await new Promise(resolve => setTimeout(resolve, 1200));
      setSent(true);
    } catch {
      Alert.alert('Something went wrong', 'Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex1}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={sent ? 'checkmark-circle' : 'key'}
              size={40}
              color={Colors.primary[500]}
            />
          </View>

          {sent ? (
            <>
              <Text style={styles.title}>Check your email</Text>
              <Text style={styles.subtitle}>
                We&apos;ve sent a password reset link to{'\n'}
                <Text style={styles.emailHighlight}>{email}</Text>
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => router.back()}
                activeOpacity={0.85}
              >
                <Text style={styles.buttonText}>Back to Sign In</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.title}>Forgot your password?</Text>
              <Text style={styles.subtitle}>
                Enter the email linked to your account and we&apos;ll send you a reset link.
              </Text>

              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color={Colors.gray[500]} style={styles.inputIcon} />
                <TextInput
                  placeholder="Email address"
                  placeholderTextColor={Colors.gray[500]}
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  editable={!loading}
                  returnKeyType="send"
                  onSubmitEditing={handleSendResetLink}
                />
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSendResetLink}
                disabled={loading}
                activeOpacity={0.85}
              >
                <Text style={styles.buttonText}>{loading ? 'Sending…' : 'Send Reset Link'}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.primary },
  flex1: { flex: 1 },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  emailHighlight: {
    fontWeight: '700',
    color: Colors.text.primary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.light,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 20,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: Colors.text.primary },
  button: {
    backgroundColor: Colors.primary[500],
    borderRadius: 12,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
