import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
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

interface FormState {
  name: string;
  email: string;
  password: string;
  phone: string;
}

const INITIAL_FORM: FormState = { name: '', email: '', password: '', phone: '' };

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [formData, setFormData] = useState<FormState>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const validate = (): string | null => {
    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();

    if (!name || !email || !formData.password) return 'Please fill in all required fields.';
    if (name.length < ValidationRules.name.minLength) return 'Name is too short.';
    if (!ValidationRules.email.regex.test(email)) return 'Please enter a valid email address.';
    if (formData.password.length < ValidationRules.password.minLength) {
      return `Password must be at least ${ValidationRules.password.minLength} characters.`;
    }
    if (phone && !ValidationRules.phone.regex.test(phone)) return 'Please enter a valid Pakistani mobile number.';
    return null;
  };

  const handleSignUp = async () => {
    setFormError(null);
    const validationError = validate();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setLoading(true);
    try {
      await signUp({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim() || undefined,
        role: 'buyer',
      });
      Alert.alert('Account created', 'You can now sign in with your new account.');
      router.replace('/signin' as Href);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Sign up failed. Please try again.');
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
              Create Account
            </AppText>
            <AppText variant="body" color="muted" align="center" style={styles.subtitle}>
              Join us to find your dream property
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
              <Ionicons name="person-outline" size={20} color={Colors.gray[600]} style={styles.inputIcon} />
              <TextInput
                placeholder="Full Name"
                placeholderTextColor={Colors.gray[500]}
                style={styles.input}
                value={formData.name}
                onChangeText={t => setFormData(prev => ({ ...prev, name: t }))}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color={Colors.gray[600]} style={styles.inputIcon} />
              <TextInput
                placeholder="Email Address"
                placeholderTextColor={Colors.gray[500]}
                style={styles.input}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                value={formData.email}
                onChangeText={t => setFormData(prev => ({ ...prev, email: t }))}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="call-outline" size={20} color={Colors.gray[600]} style={styles.inputIcon} />
              <TextInput
                placeholder="Phone Number (optional)"
                placeholderTextColor={Colors.gray[500]}
                style={styles.input}
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={t => setFormData(prev => ({ ...prev, phone: t }))}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.gray[600]} style={styles.inputIcon} />
              <TextInput
                placeholder="Password"
                placeholderTextColor={Colors.gray[500]}
                style={styles.input}
                secureTextEntry
                autoComplete="password-new"
                value={formData.password}
                onChangeText={t => setFormData(prev => ({ ...prev, password: t }))}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSignUp}
              disabled={loading}
              accessibilityRole="button"
            >
              <AppText variant="body" weight="bold" color="inverse">
                {loading ? 'Creating Account…' : 'Sign Up'}
              </AppText>
            </TouchableOpacity>

            <View style={styles.footer}>
              <AppText variant="body" color="secondary">
                Already have an account?{' '}
              </AppText>
              <TouchableOpacity onPress={() => router.replace('/signin' as Href)}>
                <AppText variant="body" weight="bold" color="brand">
                  Sign In
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
  headerContainer: { alignItems: 'center', marginBottom: Spacing.lg },
  logo: { width: 100, height: 50, marginBottom: Spacing.md },
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

  button: {
    backgroundColor: Colors.primary[500],
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  buttonDisabled: { opacity: 0.7 },

  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
});
