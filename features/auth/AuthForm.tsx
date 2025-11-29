// @ts-nocheck
import { Ionicons } from '@expo/vector-icons';
import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControl,
    HStack,
    Input,
    useToast,
    VStack,
    WarningOutlineIcon
} from 'native-base';
import React, { useState } from 'react';

import AppButton from '../../components/base/AppButton';
import AppText from '../../components/base/AppText';
import { Colors } from '../../constants/Colors';
import SocialLogin from './SocialLogin';

export interface AuthFormData {
  email: string;
  password: string;
  fullName?: string;
  phone?: string;
  confirmPassword?: string;
  agreeToTerms?: boolean;
}

export interface AuthFormErrors {
  email?: string;
  password?: string;
  fullName?: string;
  phone?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
  general?: string;
}

interface AuthFormProps {
  mode: 'login' | 'register';
  onSubmit: (data: AuthFormData) => Promise<void>;
  loading?: boolean;
  onSwitchMode?: () => void;
  onForgotPassword?: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  onSubmit,
  loading = false,
  onSwitchMode,
  onForgotPassword
}) => {
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  
  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toast = useToast();

  const validateForm = (): boolean => {
    const newErrors: AuthFormErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (mode === 'register') {
      // Full name validation
      if (!formData.fullName?.trim()) {
        newErrors.fullName = 'Full name is required';
      }

      // Phone validation
      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
        newErrors.phone = 'Phone number must be 10 digits';
      }

      // Confirm password validation
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      // Terms agreement validation
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = 'You must agree to the terms and conditions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
      
      toast.show({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Authentication failed',
        // Removed 'status' as it's not supported by IToastProps
        duration: 3000,
      });
    }
  };

  const handleInputChange = (field: keyof AuthFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof AuthFormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const getSubmitButtonText = () => {
    if (loading) {
      return mode === 'login' ? 'Signing In...' : 'Creating Account...';
    }
    return mode === 'login' ? 'Sign In' : 'Create Account';
  };

  return (
    <VStack space={6}>
      {/* General Error */}
      {errors.general && (
        <Box bg="error.50" p={3} borderRadius="lg" borderWidth={1} borderColor="error.200">
          <AppText variant="body" color="error" align="center">
            {errors.general}
          </AppText>
        </Box>
      )}

      <VStack space={4}>
        {/* Full Name (Register only) */}
        {mode === 'register' && (
          <FormControl isInvalid={!!errors.fullName}>
            <FormControl.Label>
              <AppText variant="body" weight="medium">Full Name</AppText>
            </FormControl.Label>
            <Input
              placeholder="Enter your full name"
              value={formData.fullName}
              onChangeText={(value) => handleInputChange('fullName', value)}
              fontSize="md"
              borderRadius="lg"
              height={12}
              InputLeftElement={
                <Ionicons 
                  name="person-outline" 
                  size={20} 
                  color={Colors.text.secondary} 
                  style={{ marginLeft: 12 }}
                />
              }
              variant="outline"
              _focus={{
                borderColor: Colors.primary[500],
                backgroundColor: 'white'
              }}
            />
            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
              {errors.fullName}
            </FormControl.ErrorMessage>
          </FormControl>
        )}

        {/* Email */}
        <FormControl isInvalid={!!errors.email}>
          <FormControl.Label>
            <AppText variant="body" weight="medium">Email</AppText>
          </FormControl.Label>
          <Input
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            fontSize="md"
            borderRadius="lg"
            height={12}
            keyboardType="email-address"
            autoCapitalize="none"
            InputLeftElement={
              <Ionicons 
                name="mail-outline" 
                size={20} 
                color={Colors.text.secondary} 
                style={{ marginLeft: 12 }}
              />
            }
            variant="outline"
            _focus={{
              borderColor: Colors.primary[500],
              backgroundColor: 'white'
            }}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {errors.email}
          </FormControl.ErrorMessage>
        </FormControl>

        {/* Phone (Register only) */}
        {mode === 'register' && (
          <FormControl isInvalid={!!errors.phone}>
            <FormControl.Label>
              <AppText variant="body" weight="medium">Phone Number</AppText>
            </FormControl.Label>
            <Input
              placeholder="Enter your phone number"
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              fontSize="md"
              borderRadius="lg"
              height={12}
              keyboardType="phone-pad"
              InputLeftElement={
                <Ionicons 
                  name="call-outline" 
                  size={20} 
                  color={Colors.text.secondary} 
                  style={{ marginLeft: 12 }}
                />
              }
              variant="outline"
              _focus={{
                borderColor: Colors.primary[500],
                backgroundColor: 'white'
              }}
            />
            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
              {errors.phone}
            </FormControl.ErrorMessage>
          </FormControl>
        )}

        {/* Password */}
        <FormControl isInvalid={!!errors.password}>
          <FormControl.Label>
            <AppText variant="body" weight="medium">Password</AppText>
          </FormControl.Label>
          <Input
            placeholder="Enter your password"
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
            type={showPassword ? "text" : "password"}
            fontSize="md"
            borderRadius="lg"
            height={12}
            autoCapitalize="none"
            InputLeftElement={
              <Ionicons 
                name="lock-closed-outline" 
                size={20} 
                color={Colors.text.secondary} 
                style={{ marginLeft: 12 }}
              />
            }
            InputRightElement={
              <Button
                variant="ghost"
                onPress={() => setShowPassword(!showPassword)}
                mr={2}
              >
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color={Colors.text.secondary} 
                />
              </Button>
            }
            variant="outline"
            _focus={{
              borderColor: Colors.primary[500],
              backgroundColor: 'white'
            }}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {errors.password}
          </FormControl.ErrorMessage>
        </FormControl>

        {/* Confirm Password (Register only) */}
        {mode === 'register' && (
          <FormControl isInvalid={!!errors.confirmPassword}>
            <FormControl.Label>
              <AppText variant="body" weight="medium">Confirm Password</AppText>
            </FormControl.Label>
            <Input
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              type={showConfirmPassword ? "text" : "password"}
              fontSize="md"
              borderRadius="lg"
              height={12}
              autoCapitalize="none"
              InputLeftElement={
                <Ionicons 
                  name="lock-closed-outline" 
                  size={20} 
                  color={Colors.text.secondary} 
                  style={{ marginLeft: 12 }}
                />
              }
              InputRightElement={
                <Button
                  variant="ghost"
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  mr={2}
                >
                  <Ionicons 
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color={Colors.text.secondary} 
                  />
                </Button>
              }
              variant="outline"
              _focus={{
                borderColor: Colors.primary[500],
                backgroundColor: 'white'
              }}
            />
            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
              {errors.confirmPassword}
            </FormControl.ErrorMessage>
          </FormControl>
        )}

        {/* Terms Agreement (Register only) */}
        {mode === 'register' && (
          <FormControl isInvalid={!!errors.agreeToTerms}>
            <Checkbox
              value="terms"
              isChecked={formData.agreeToTerms}
              onChange={(value) => handleInputChange('agreeToTerms', value)}
              colorScheme="primary"
              my={2}
              alignItems="flex-start"
            >
              <VStack space={1}>
                <AppText variant="body">
                  I agree to the{' '}
                  <AppText variant="body" color="primary" weight="semibold">
                    Terms of Service
                  </AppText>
                  {' '}and{' '}
                  <AppText variant="body" color="primary" weight="semibold">
                    Privacy Policy
                  </AppText>
                </AppText>
                {errors.agreeToTerms && (
                  <AppText variant="small" color="error">
                    {errors.agreeToTerms}
                  </AppText>
                )}
              </VStack>
            </Checkbox>
          </FormControl>
        )}
      </VStack>

      {/* Submit Button */}
      <AppButton 
        onPress={handleSubmit}
        variant="primary"
        size="lg"
        loading={loading}
        style={{ marginTop: 4 }}
      >
        {getSubmitButtonText()}
      </AppButton>

      {/* Forgot Password (Login only) */}
      {mode === 'login' && onForgotPassword && (
        <Button 
          variant="link" 
          alignSelf="center"
          onPress={onForgotPassword}
          _text={{ color: 'primary.500', fontSize: 'md' }}
        >
          Forgot Password?
        </Button>
      )}

      {/* Divider */}
      <HStack alignItems="center" space={3} my={2}>
        <Divider flex={1} />
        <AppText variant="body" color="secondary">OR</AppText>
        <Divider flex={1} />
      </HStack>

      {/* Social Login */}
      <SocialLogin mode={mode} />

      {/* Switch Mode */}
      {onSwitchMode && (
        <HStack justifyContent="center" space={1}>
          <AppText variant="body" color="secondary">
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
          </AppText>
          <Button 
            variant="link" 
            p={0}
            onPress={onSwitchMode}
            _text={{ color: 'primary.500', fontSize: 'md', fontWeight: 'semibold' }}
          >
            {mode === 'login' ? 'Sign Up' : 'Sign In'}
          </Button>
        </HStack>
      )}
    </VStack>
  );
};

export default AuthForm;