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

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (formData: AuthFormData) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful registration
      const mockUser = {
        id: '2',
        email: formData.email,
        name: formData.fullName,
        phone: formData.phone,
        token: 'mock-jwt-token-new',
      };

      // Store authentication data
      await storageService.setItem('auth_token', mockUser.token);
      await storageService.setItem('user_data', mockUser);

      // Track registration event
      await analyticsService.track('user_register', {
        method: 'email',
        user_id: mockUser.id,
        has_phone: !!formData.phone,
      });

      toast.show({
        title: 'Account created!',
        description: 'Your account has been created successfully.',
        duration: 3000,
      });
      
      navigation.navigate('Login' as never);
    } catch (error) {
      await analyticsService.trackError(error as Error, {
        context: 'registration',
        email: formData.email,
      });
      
      throw new Error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (user: SocialUser) => {
    try {
      setLoading(true);

      // Mock social registration
      const mockUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        token: 'mock-social-token-new',
        provider: user.provider,
      };

      await storageService.setItem('auth_token', mockUser.token);
      await storageService.setItem('user_data', mockUser);

      await analyticsService.track('user_register', {
        method: user.provider,
        user_id: user.id,
      });

      toast.show({
        title: 'Welcome!',
        description: `Account created with ${user.provider} successfully`,
        duration: 3000,
      });
      
      navigation.goBack();
    } catch (error) {
      await analyticsService.trackError(error as Error, {
        context: 'social_register',
        provider: user.provider,
      });
      
      throw new Error(`Failed to create account with ${user.provider}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToLogin = () => {
    navigation.navigate('Login' as never);
    analyticsService.track('switch_to_login');
  };

  const handleBackPress = () => {
    navigation.goBack();
    analyticsService.track('register_back_press');
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
          <AppText variant="h2" weight="bold">Create Account</AppText>
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
              <Ionicons name="person-add" size={40} color={Colors.primary[500]} />
            </Box>
            
            <VStack space={2} alignItems="center">
              <AppText variant="h1" weight="bold" align="center">
                Join Us Today
              </AppText>
              <AppText variant="body" color="secondary" align="center">
                Create your account to start your property journey and save your preferences
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
              mode="register"
              onSubmit={handleRegister}
              loading={loading}
              onSwitchMode={handleSwitchToLogin}
            />
          </Box>

          {/* Benefits Section */}
          <VStack space={4} bg="white" p={5} borderRadius={BorderRadius.lg}>
            <AppText variant="h4" weight="semibold" align="center">
              Benefits of Creating an Account
            </AppText>
            
            <VStack space={3}>
              <HStack space={3} alignItems="flex-start">
                <Ionicons name="heart" size={20} color={Colors.status.featured} />
                <VStack flex={1} space={1}>
                  <AppText variant="body" weight="medium">Save Favorites</AppText>
                  <AppText variant="small" color="secondary">
                    Save properties you love and access them anytime
                  </AppText>
                </VStack>
              </HStack>

              <HStack space={3} alignItems="flex-start">
                <Ionicons name="notifications" size={20} color={Colors.primary[500]} />
                <VStack flex={1} space={1}>
                  <AppText variant="body" weight="medium">Price Alerts</AppText>
                  <AppText variant="small" color="secondary">
                    Get notified when prices drop on saved properties
                  </AppText>
                </VStack>
              </HStack>

              <HStack space={3} alignItems="flex-start">
                <Ionicons name="search" size={20} color={Colors.secondary[500]} />
                <VStack flex={1} space={1}>
                  <AppText variant="body" weight="medium">Smart Search</AppText>
                  <AppText variant="small" color="secondary">
                    Get personalized property recommendations
                  </AppText>
                </VStack>
              </HStack>
            </VStack>
          </VStack>
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default RegisterScreen;