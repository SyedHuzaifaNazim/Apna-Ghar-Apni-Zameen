// @ts-nocheck
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Box, HStack, IconButton, ScrollView, useToast, VStack } from 'native-base';
import React, { useState } from 'react';

import AppText from '../../components/base/AppText';
import { Colors } from '../../constants/Colors';
import { BorderRadius, Layout, Shadows } from '../../constants/Layout';
import { analyticsService } from '../../services/analyticsService';
import { storageService } from '../../services/storageService';
import AuthForm, { AuthFormData } from './AuthForm';
import { SocialUser } from './SocialLogin';

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (formData: AuthFormData) => {
    setLoading(true);
    
    try {
      // Simulate API call - replace with actual authentication
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful login
      const mockUser = {
        id: '1',
        email: formData.email,
        name: 'John Doe',
        token: 'mock-jwt-token',
      };

      // Store authentication data
      await storageService.setItem('auth_token', mockUser.token);
      await storageService.setItem('user_data', mockUser);

      // Track login event
      await analyticsService.track('user_login', {
        method: 'email',
        user_id: mockUser.id,
      });

      toast.show({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
        duration: 3000,
      });
      
      navigation.goBack();
    } catch (error) {
      await analyticsService.trackError(error as Error, {
        context: 'login',
        email: formData.email,
      });
      
      throw new Error('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (user: SocialUser) => {
    try {
      setLoading(true);

      // Mock social login success
      const mockUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        token: 'mock-social-token',
        provider: user.provider,
      };

      await storageService.setItem('auth_token', mockUser.token);
      await storageService.setItem('user_data', mockUser);

      await analyticsService.track('user_login', {
        method: user.provider,
        user_id: user.id,
      });

      toast.show({
        title: 'Welcome!',
        description: `Signed in with ${user.provider} successfully`,
        duration: 3000,
      });
      
      navigation.goBack();
    } catch (error) {
      await analyticsService.trackError(error as Error, {
        context: 'social_login',
        provider: user.provider,
      });
      
      throw new Error(`Failed to sign in with ${user.provider}`);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword' as never);
    analyticsService.track('forgot_password_click');
  };

  const handleSwitchToRegister = () => {
    navigation.navigate('Register' as never);
    analyticsService.track('switch_to_register');
  };

  const handleBackPress = () => {
    navigation.goBack();
    analyticsService.track('login_back_press');
  };

  return (
    <Box flex={1} bg="white" safeArea>
      {/* Header */}
      <Box 
        bg="white" 
        px={Layout.isSmallDevice ? 4 : 6} 
        py={4}
        borderBottomWidth={1}
        borderBottomColor={Colors.border.light}
      >
        <HStack alignItems="center" space={4}>
          <IconButton
            icon={<Ionicons name="arrow-back" size={24} color={Colors.primary[500]} />}
            onPress={handleBackPress}
            variant="ghost"
            borderRadius="full"
            _pressed={{ bg: Colors.primary[50] }}
          />
          <AppText variant="h2" weight="bold">Sign In</AppText>
        </HStack>
      </Box>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={false}
      >
        <VStack 
          space={8} 
          p={Layout.isSmallDevice ? 4 : 6} 
          flex={1}
          bg={Colors.background.secondary}
        >
          {/* Welcome Section */}
          <VStack space={3} alignItems="center">
            <Box 
              width={80} 
              height={80} 
              borderRadius="full" 
              bg={Colors.primary[50]}
              justifyContent="center"
              alignItems="center"
              mb={2}
            >
              <Ionicons name="key" size={40} color={Colors.primary[500]} />
            </Box>
            
            <VStack space={2} alignItems="center">
              <AppText variant="h1" weight="bold" align="center">
                Welcome Back
              </AppText>
              <AppText variant="body" color="secondary" align="center">
                Sign in to continue your property search and manage your favorites
              </AppText>
            </VStack>
          </VStack>

          {/* Auth Form */}
          <Box 
            bg="white" 
            p={6} 
            borderRadius={BorderRadius.xl}
            style={Shadows.sm}
          >
            <AuthForm
              mode="login"
              onSubmit={handleLogin}
              loading={loading}
              onSwitchMode={handleSwitchToRegister}
              onForgotPassword={handleForgotPassword}
            />
          </Box>

          {/* Additional Help */}
          <VStack space={4} alignItems="center">
            <AppText variant="body" color="secondary" align="center">
              By signing in, you agree to our{'\n'}
              <AppText 
                variant="body" 
                color="primary" 
                weight="semibold"
                onPress={() => {
                  // Navigate to terms
                  analyticsService.track('terms_click');
                }}
              >
                Terms of Service
              </AppText>
              {' '}and{' '}
              <AppText 
                variant="body" 
                color="primary" 
                weight="semibold"
                onPress={() => {
                  // Navigate to privacy
                  analyticsService.track('privacy_click');
                }}
              >
                Privacy Policy
              </AppText>
            </AppText>
          </VStack>
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default LoginScreen;