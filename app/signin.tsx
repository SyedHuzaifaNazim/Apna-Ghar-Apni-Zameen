import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppText from '@/components/base/AppText';
import { Colors } from '@/constants/Colors';
import { ValidationRules } from '@/constants/Config';
import { BorderRadius, Shadows, Spacing } from '@/constants/Layout';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/services/apiService';

const LOGO = require('@/assets/images/transparent-logo1.png');

export default function SignInScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setFormError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setFormError('Please fill in all fields.');
      return;
    }
    if (!ValidationRules.email.regex.test(trimmedEmail)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await signIn(trimmedEmail, password);
      router.replace('/(tabs)/profile');
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.headerContainer}>
            <Image source={LOGO} style={styles.logo} resizeMode="contain" />
            <AppText variant="h2" weight="bold" align="center">
              Welcome Back
            </AppText>
            <AppText variant="body" color="muted" align="center" style={styles.subtitle}>
              Sign in to access your properties
            </AppText>
          </View>

          <View style={styles.formContainer}>
            {formError && (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={16} color={Colors.error[600]} />
                <AppText variant="bodySmall" color={Colors.error[600]} style={styles.errorText}>
                  {formError}
                </AppText>
              </View>
            )}

            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color={Colors.gray[600]} style={styles.inputIcon} />
              <TextInput
                placeholder="Email Address"
                placeholderTextColor={Colors.gray[500]}
                style={styles.input}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                onChangeText={setEmail}
                value={email}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.gray[600]} style={styles.inputIcon} />
              <TextInput
                placeholder="Password"
                placeholderTextColor={Colors.gray[500]}
                style={styles.input}
                secureTextEntry
                autoComplete="password"
                onChangeText={setPassword}
                value={password}
              />
            </View>

            <TouchableOpacity style={styles.forgotPass} onPress={() => router.push('/forgot-password' as Href)}>
              <AppText variant="bodySmall" weight="semibold" color="brand">
                Forgot Password?
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSignIn}
              disabled={loading}
              accessibilityRole="button"
            >
              <AppText variant="body" weight="bold" color="inverse">
                {loading ? 'Signing In…' : 'Sign In'}
              </AppText>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.line} />
              <AppText variant="caption" color="muted" style={styles.orText}>
                OR
              </AppText>
              <View style={styles.line} />
            </View>

            <View style={styles.footer}>
              <AppText variant="body" color="secondary">
                Don&apos;t have an account?{' '}
              </AppText>
              <TouchableOpacity onPress={() => router.push('/signup' as Href)}>
                <AppText variant="body" weight="bold" color="brand">
                  Sign Up
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.primary },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: Spacing.lg },
  headerContainer: { alignItems: 'center', marginBottom: Spacing.xl },
  logo: { width: 120, height: 60, marginBottom: Spacing.md },
  subtitle: { marginTop: Spacing.xs },
  formContainer: { width: '100%' },

  errorBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xs,
    backgroundColor: Colors.error[50],
    borderWidth: 1,
    borderColor: Colors.error[100],
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  errorText: { flex: 1 },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    height: 56,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  inputIcon: { marginRight: Spacing.sm },
  input: { flex: 1, fontSize: 16, color: Colors.text.primary },
  forgotPass: { alignSelf: 'flex-end', marginBottom: Spacing.lg },

  button: {
    backgroundColor: Colors.primary[500],
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.md,
  },
  buttonDisabled: { opacity: 0.7 },

  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: Spacing.xl },
  line: { flex: 1, height: 1, backgroundColor: Colors.border.light },
  orText: { marginHorizontal: Spacing.md },

  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
});
