// @ts-nocheck
import React from 'react';
import { VStack, Button, HStack, useToast } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
// import * as Apple from 'expo-auth-session/providers/apple';

import AppText from '../../components/base/AppText';
import AppButton from '../../components/base/AppButton';
import { Colors } from '../../constants/Colors';

// Configure WebBrowser for OAuth
WebBrowser.maybeCompleteAuthSession();

interface SocialLoginProps {
  mode: 'login' | 'register';
  onSuccess?: (user: SocialUser) => void;
  onError?: (error: string) => void;
}

export interface SocialUser {
  id: string;
  email: string;
  name: string;
  photo?: string;
  provider: 'google' | 'facebook' | 'apple';
}

const SocialLogin: React.FC<SocialLoginProps> = ({ 
  mode, 
  onSuccess, 
  onError 
}) => {
  const toast = useToast();

  // Google OAuth
  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    clientId: 'YOUR_GOOGLE_EXPO_CLIENT_ID',
    iosClientId: 'YOUR_GOOGLE_IOS_CLIENT_ID',
    androidClientId: 'YOUR_GOOGLE_ANDROID_CLIENT_ID',
    webClientId: 'YOUR_GOOGLE_WEB_CLIENT_ID',
  });

  // Facebook OAuth
  const [facebookRequest, facebookResponse, facebookPromptAsync] = Facebook.useAuthRequest({
    clientId: 'YOUR_FACEBOOK_APP_ID',
  });

  // Apple OAuth
  // const [appleRequest, appleResponse, applePromptAsync] = Apple.useAuthRequest({
  //   clientId: 'YOUR_APPLE_SERVICE_ID',
  //   scopes: ['name', 'email'],
  // });

  React.useEffect(() => {
    if (googleResponse?.type === 'success') {
      handleGoogleSuccess(googleResponse.authentication?.accessToken as string);
    }
  }, [googleResponse]);

  React.useEffect(() => {
    if (facebookResponse?.type === 'success') {
      handleFacebookSuccess(facebookResponse.authentication?.accessToken as string);
    }
  }, [facebookResponse]);

  // React.useEffect(() => {
  //   if (appleResponse?.type === 'success') {
  //     handleAppleSuccess(appleResponse);
  //   }
  // }, [appleResponse]);

  const handleGoogleSuccess = async (accessToken?: string) => {
    if (!accessToken) {
      handleError('Google authentication failed');
      return;
    }

    try {
      // In a real app, you would verify the token with your backend
      const userInfo = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      const user = await userInfo.json();
      
      const socialUser: SocialUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        photo: user.picture,
        provider: 'google'
      };

      onSuccess?.(socialUser);
      
      toast.show({
        title: 'Success',
        description: `Signed in with Google successfully`,
        // Removed 'status' as it's not supported by IToastProps
        duration: 3000,
      });
    } catch (error) {
      handleError('Failed to fetch user info from Google');
    }
  };

  const handleFacebookSuccess = async (accessToken?: string) => {
    if (!accessToken) {
      handleError('Facebook authentication failed');
      return;
    }

    try {
      // In a real app, you would verify the token with your backend
      const userInfo = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`);
      const user = await userInfo.json();
      
      const socialUser: SocialUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        photo: user.picture?.data?.url,
        provider: 'facebook'
      };

      onSuccess?.(socialUser);
      
      toast.show({
        title: 'Success',
        description: `Signed in with Facebook successfully`,
        // Removed 'status' as it's not supported by IToastProps
        duration: 3000,
      });
    } catch (error) {
      handleError('Failed to fetch user info from Facebook');
    }
  };

  const handleAppleSuccess = async (response: any) => {
    try {
      // Apple authentication handling
      // Note: Apple doesn't provide email in subsequent requests for existing users
      const socialUser: SocialUser = {
        id: response.user?.id || 'apple_user',
        email: response.user?.email || '',
        name: response.user?.name || 'Apple User',
        provider: 'apple'
      };

      onSuccess?.(socialUser);
      
      toast.show({
        title: 'Success',
        description: `Signed in with Apple successfully`,
        // Removed 'status' as it's not supported by IToastProps
        duration: 3000,
      });
    } catch (error) {
      handleError('Apple authentication failed');
    }
  };

  const handleError = (error: string) => {
    console.error('Social login error:', error);
    onError?.(error);
    
    toast.show({
      title: 'Authentication Failed',
      description: error,
      // Removed 'status' as it's not supported by IToastProps
      duration: 3000,
    });
  };

  const handleGoogleLogin = async () => {
    try {
      await googlePromptAsync();
    } catch (error) {
      handleError('Google login failed');
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await facebookPromptAsync();
    } catch (error) {
      handleError('Facebook login failed');
    }
  };

  const handleAppleLogin = async () => {
    try {
      // await applePromptAsync();
    } catch (error) {
      handleError('Apple login failed');
    }
  };

  const getButtonText = (provider: string) => {
    const action = mode === 'login' ? 'Sign in' : 'Sign up';
    return `${action} with ${provider}`;
  };

  return (
    <VStack space={3}>
      <AppText variant="body" color="secondary" align="center">
        {mode === 'login' ? 'Sign in quickly with' : 'Sign up quickly with'}
      </AppText>

      {/* Google Button */}
      <AppButton
        variant="outline"
        onPress={handleGoogleLogin}
        disabled={!googleRequest}
        leftIcon={
          <Ionicons name="logo-google" size={20} color={Colors.error[500]} />
        }
      >
        {getButtonText('Google')}
      </AppButton>

      {/* Facebook Button */}
      <AppButton
        variant="outline"
        onPress={handleFacebookLogin}
        disabled={!facebookRequest}
        leftIcon={
          <Ionicons name="logo-facebook" size={20} color={Colors.primary[500]} />
        }
      >
        {getButtonText('Facebook')}
      </AppButton>

      {/* Apple Button (iOS only) */}
        <AppButton
          variant="outline"
          onPress={handleAppleLogin}
          leftIcon={
            <Ionicons name="logo-apple" size={20} color={Colors.text.primary} />
          }
        >
          {getButtonText('Apple')}
        </AppButton>

      {/* Privacy Notice */}
      <AppText variant="small" color="disabled" align="center">
        We'll never post anything without your permission
      </AppText>
    </VStack>
  );
}

export default SocialLogin;