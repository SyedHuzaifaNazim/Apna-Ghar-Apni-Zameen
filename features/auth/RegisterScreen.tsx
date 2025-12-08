import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Navigation types
type RootStackParamList = {
  '(tabs)': undefined;
  login: undefined;
  Home: undefined;
};

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Mock services
const analyticsService = {
  track: (event: string, data?: any) => console.log('Analytics:', event, data),
  trackError: (error: Error, context?: any) => console.error('Error:', error, context),
};

const storageService = {
  setItem: async (key: string, value: any) => {
    console.log('Storing:', key, value);
  },
};

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    };
    let isValid = true;

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    // Phone validation (optional)
    if (formData.phone.trim() && !/^\d{10,15}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number (10-15 digits)';
      isValid = false;
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must include uppercase, lowercase and number';
      isValid = false;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        email: formData.email,
        name: formData.fullName,
        phone: formData.phone.trim() || null,
        token: 'mock-jwt-token-new',
      };

      await storageService.setItem('auth_token', mockUser.token);
      await storageService.setItem('user_data', JSON.stringify(mockUser));

      await analyticsService.track('user_register', {
        method: 'email',
        user_id: mockUser.id,
        has_phone: !!formData.phone.trim(),
      });

      // Success alert
      Alert.alert('Success', 'Your account has been created successfully!', [
        {
          text: 'Continue',
          onPress: () => {
            // Navigate to main tabs
            navigation.reset({
              index: 0,
              routes: [{ name: '(tabs)' }],
            });
          }
        }
      ]);
      
    } catch (error) {
      console.error('Registration failed:', error);
      await analyticsService.trackError(error as Error, {
        context: 'registration',
        email: formData.email,
      });
      Alert.alert('Registration Failed', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = async (provider: 'google' | 'facebook' | 'apple') => {
    try {
      setLoading(true);

      const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        email: `user@${provider}.com`,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        provider,
        token: 'mock-social-jwt-token',
      };

      await storageService.setItem('auth_token', mockUser.token);
      await storageService.setItem('user_data', JSON.stringify(mockUser));

      await analyticsService.track('user_register', {
        method: provider,
        user_id: mockUser.id,
      });

      Alert.alert('Success', `Account created with ${provider} successfully!`, [
        {
          text: 'Continue',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: '(tabs)' }],
            });
          }
        }
      ]);
      
    } catch (error) {
      console.error('Social login failed:', error);
      await analyticsService.trackError(error as Error, {
        context: 'social_register',
        provider,
      });
      Alert.alert('Registration Failed', `Failed to create account with ${provider}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToLogin = () => {
    navigation.navigate('login');
    analyticsService.track('switch_to_login');
  };

  const handleBackPress = () => {
    navigation.goBack();
    analyticsService.track('register_back_press');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          bounces={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#2e7d32" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Account</Text>
          </View>

          <View style={styles.content}>
            {/* Welcome Section */}
            <View style={styles.welcomeSection}>
              <View style={styles.iconContainer}>
                <Ionicons name="person-add" size={40} color="#2e7d32" />
              </View>
              
              <Text style={styles.welcomeTitle}>Join Us Today</Text>
              <Text style={styles.welcomeSubtitle}>
                Create your account to start your property journey
              </Text>
            </View>

            {/* Registration Form */}
            <View style={styles.formContainer}>
              {/* Full Name Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <View style={[styles.inputWrapper, errors.fullName ? styles.inputError : null]}>
                  <Ionicons name="person-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    placeholder="Enter your full name"
                    placeholderTextColor="#9CA3AF"
                    value={formData.fullName}
                    onChangeText={(text) => handleInputChange('fullName', text)}
                    style={styles.input}
                    editable={!loading}
                    autoComplete="name"
                  />
                </View>
                {errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}
              </View>

              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <View style={[styles.inputWrapper, errors.email ? styles.inputError : null]}>
                  <Ionicons name="mail-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    value={formData.email}
                    onChangeText={(text) => handleInputChange('email', text)}
                    style={styles.input}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!loading}
                    autoComplete="email"
                  />
                </View>
                {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
              </View>

              {/* Phone Input (Optional) */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Phone Number <Text style={styles.optionalText}>(Optional)</Text>
                </Text>
                <View style={[styles.inputWrapper, errors.phone ? styles.inputError : null]}>
                  <Ionicons name="call-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    placeholder="Enter your phone number"
                    placeholderTextColor="#9CA3AF"
                    value={formData.phone}
                    onChangeText={(text) => handleInputChange('phone', text)}
                    style={styles.input}
                    keyboardType="phone-pad"
                    editable={!loading}
                    autoComplete="tel"
                  />
                </View>
                {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={[styles.inputWrapper, errors.password ? styles.inputError : null]}>
                  <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    placeholder="Create a password"
                    placeholderTextColor="#9CA3AF"
                    value={formData.password}
                    onChangeText={(text) => handleInputChange('password', text)}
                    style={styles.input}
                    secureTextEntry={!showPassword}
                    editable={!loading}
                    autoComplete="password-new"
                  />
                  <TouchableOpacity
                    style={styles.passwordToggle}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons 
                      name={showPassword ? "eye-off-outline" : "eye-outline"} 
                      size={20} 
                      color="#6B7280" 
                    />
                  </TouchableOpacity>
                </View>
                {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
                {!errors.password && formData.password.length > 0 && (
                  <Text style={styles.passwordHint}>
                    • At least 6 characters
                    {'\n'}• Include uppercase & lowercase letters
                    {'\n'}• Include at least one number
                  </Text>
                )}
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={[styles.inputWrapper, errors.confirmPassword ? styles.inputError : null]}>
                  <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    placeholder="Confirm your password"
                    placeholderTextColor="#9CA3AF"
                    value={formData.confirmPassword}
                    onChangeText={(text) => handleInputChange('confirmPassword', text)}
                    style={styles.input}
                    secureTextEntry={!showConfirmPassword}
                    editable={!loading}
                    autoComplete="password-new"
                  />
                  <TouchableOpacity
                    style={styles.passwordToggle}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Ionicons 
                      name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                      size={20} 
                      color="#6B7280" 
                    />
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
              </View>

              {/* Register Button */}
              <TouchableOpacity
                style={[styles.registerButton, loading && styles.buttonDisabled]}
                onPress={handleRegister}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="person-add-outline" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                    <Text style={styles.registerButtonText}>Create Account</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.divider} />
              </View>

              {/* Social Register Buttons */}
              <View style={styles.socialButtonsContainer}>
                <TouchableOpacity
                  style={[styles.socialButton, styles.googleButton]}
                  onPress={() => handleSocialRegister('google')}
                  disabled={loading}
                  activeOpacity={0.7}
                >
                  <Ionicons name="logo-google" size={20} color="#DB4437" />
                  <Text style={styles.socialButtonText}>Google</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.socialButton, styles.facebookButton]}
                  onPress={() => handleSocialRegister('facebook')}
                  disabled={loading}
                  activeOpacity={0.7}
                >
                  <Ionicons name="logo-facebook" size={20} color="#4267B2" />
                  <Text style={styles.socialButtonText}>Facebook</Text>
                </TouchableOpacity>
              </View>

              {/* Login Link */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={handleSwitchToLogin} disabled={loading}>
                  <Text style={[styles.loginLink, loading && styles.linkDisabled]}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Benefits Section */}
            <View style={styles.benefitsContainer}>
              <Text style={styles.benefitsTitle}>Benefits of Creating an Account</Text>
              
              <View style={styles.benefitsList}>
                <View style={styles.benefitItem}>
                  <View style={[styles.benefitIcon, { backgroundColor: '#FEF3F2' }]}>
                    <Ionicons name="heart" size={20} color="#DC2626" />
                  </View>
                  <View style={styles.benefitTextContainer}>
                    <Text style={styles.benefitTitle}>Save Favorites</Text>
                    <Text style={styles.benefitDescription}>
                      Save properties you love and access them anytime
                    </Text>
                  </View>
                </View>

                <View style={styles.benefitItem}>
                  <View style={[styles.benefitIcon, { backgroundColor: '#F0F9FF' }]}>
                    <Ionicons name="notifications" size={20} color="#0EA5E9" />
                  </View>
                  <View style={styles.benefitTextContainer}>
                    <Text style={styles.benefitTitle}>Price Alerts</Text>
                    <Text style={styles.benefitDescription}>
                      Get notified when prices drop on saved properties
                    </Text>
                  </View>
                </View>

                <View style={styles.benefitItem}>
                  <View style={[styles.benefitIcon, { backgroundColor: '#F0FDF4' }]}>
                    <Ionicons name="search" size={20} color="#16A34A" />
                  </View>
                  <View style={styles.benefitTextContainer}>
                    <Text style={styles.benefitTitle}>Smart Search</Text>
                    <Text style={styles.benefitDescription}>
                      Get personalized property recommendations
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 16,
  },
  content: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  optionalText: {
    color: '#6B7280',
    fontWeight: '400',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    height: 56,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    height: '100%',
    paddingVertical: 0,
  },
  passwordToggle: {
    paddingLeft: 12,
  },
  passwordHint: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 8,
    marginLeft: 4,
    lineHeight: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  registerButton: {
    backgroundColor: '#2e7d32',
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonIcon: {
    marginRight: 8,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 16,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 56,
    gap: 8,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
  },
  facebookButton: {
    backgroundColor: '#FFFFFF',
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#6B7280',
    fontSize: 14,
  },
  loginLink: {
    color: '#2e7d32',
    fontSize: 14,
    fontWeight: '600',
  },
  linkDisabled: {
    opacity: 0.5,
  },
  benefitsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 20,
  },
  benefitsList: {
    gap: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitTextContainer: {
    flex: 1,
    gap: 4,
  },
  benefitTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  benefitDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});

export default RegisterScreen;