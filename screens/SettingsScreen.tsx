import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import {
  Actionsheet,
  Box,
  Divider,
  HStack,
  IconButton,
  Pressable,
  ScrollView,
  Switch,
  useDisclose,
  useToast,
  VStack
} from 'native-base';
import React, { useState } from 'react';

import AppButton from '@/components/base/AppButton';
import AppText from '@/components/base/AppText';
import { Colors } from '@/constants/Colors';

const SettingsScreen: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclose();
  
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    smsAlerts: false,
    locationServices: true,
    darkMode: false,
    biometricAuth: false,
    autoPlayVideos: true,
    highQualityImages: false
  });

  const handleSettingToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    
    toast.show({
      title: "Setting updated",
      description: `${key} ${!settings[key] ? 'enabled' : 'disabled'}`,
      variant: "solid",
      duration: 2000,
    });
  };

  const handleClearCache = () => {
    toast.show({
      title: "Cache cleared",
      description: "App cache has been cleared successfully",
      variant: "solid",
    });
  };

  const handleExportData = () => {
    toast.show({
      title: "Data exported",
      description: "Your data has been exported successfully",
      variant: "solid",
    });
  };

  const handleCopyAppInfo = async () => {
    await Clipboard.setStringAsync('Apna Ghar Apni Zameen v1.0.0');
    toast.show({
      title: "Copied",
      description: "App information copied to clipboard",
      variant: "solid",
    });
  };

  const handleLogout = () => {
    onOpen();
  };

  const confirmLogout = () => {
    toast.show({
      title: "Logged out",
      description: "You have been logged out successfully",
      variant: "solid",
    });
    onClose();
  };

  const settingSections = [
    {
      title: "Notifications",
      icon: "notifications",
      items: [
        {
          label: "Push Notifications",
          description: "Receive push notifications for alerts and updates",
          value: settings.pushNotifications,
          key: "pushNotifications"
        },
        {
          label: "Email Notifications",
          description: "Get property updates via email",
          value: settings.emailNotifications,
          key: "emailNotifications"
        },
        {
          label: "SMS Alerts",
          description: "Important alerts via SMS",
          value: settings.smsAlerts,
          key: "smsAlerts"
        }
      ]
    },
    {
      title: "Privacy & Security",
      icon: "shield-checkmark",
      items: [
        {
          label: "Location Services",
          description: "Use your location for nearby properties",
          value: settings.locationServices,
          key: "locationServices"
        },
        {
          label: "Biometric Authentication",
          description: "Use fingerprint or face ID to login",
          value: settings.biometricAuth,
          key: "biometricAuth"
        }
      ]
    },
    {
      title: "Appearance",
      icon: "color-palette",
      items: [
        {
          label: "Dark Mode",
          description: "Switch to dark theme",
          value: settings.darkMode,
          key: "darkMode"
        },
        {
          label: "High Quality Images",
          description: "Load high resolution property images",
          value: settings.highQualityImages,
          key: "highQualityImages"
        },
        {
          label: "Auto-play Videos",
          description: "Automatically play property videos",
          value: settings.autoPlayVideos,
          key: "autoPlayVideos"
        }
      ]
    }
  ];

  const actionItems = [
    {
      icon: "trash",
      title: "Clear Cache",
      description: "Clear temporary app data",
      action: handleClearCache,
      color: Colors.text.secondary
    },
    {
      icon: "download",
      title: "Export Data",
      description: "Download your saved data",
      action: handleExportData,
      color: Colors.primary
    },
    {
      icon: "document",
      title: "Terms of Service",
      description: "View our terms and conditions",
      action: () => toast.show({ title: "Terms", description: "Opening terms of service" }),
      color: Colors.text.primary
    },
    {
      icon: "lock-closed",
      title: "Privacy Policy",
      description: "How we handle your data",
      action: () => toast.show({ title: "Privacy", description: "Opening privacy policy" }),
      color: Colors.text.primary
    }
  ];

  return (
    <Box flex={1} bg="white" safeArea>
      {/* Header */}
      <Box px={4} py={3} bg="white" shadow={1} borderBottomWidth={1} borderBottomColor="gray.200">
        <HStack alignItems="center" space={4}>
          {router.canGoBack() && (
            <IconButton
              icon={<Ionicons name="arrow-back" size={24} color={Colors.primary[500]} />}
              onPress={() => router.back()}
              variant="ghost"
            />
          )}
          <AppText variant="h2" weight="bold">Settings</AppText>
        </HStack>
      </Box>

      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack space={6} p={4}>
          {/* Settings Sections */}
          {settingSections.map(section => (
            <VStack key={section.title} space={4} bg="gray.50" p={4} borderRadius="xl">
              <HStack space={3} alignItems="center">
                <Ionicons name={section.icon as any} size={20} color={Colors.primary[500]} />
                <AppText variant="h3" weight="bold">{section.title}</AppText>
              </HStack>
              
              <VStack space={3}>
                {section.items.map(item => (
                  <HStack key={item.key} justifyContent="space-between" alignItems="center">
                    <VStack space={1} flex={1}>
                      <AppText variant="body" weight="medium">{item.label}</AppText>
                      <AppText variant="small" color="secondary">{item.description}</AppText>
                    </VStack>
                    <Switch
                      isChecked={item.value}
                      onToggle={() => handleSettingToggle(item.key as keyof typeof settings)}
                      colorScheme="primary"
                    />
                  </HStack>
                ))}
              </VStack>
            </VStack>
          ))}

          {/* Action Items */}
          <VStack space={4} bg="gray.50" p={4} borderRadius="xl">
            <AppText variant="h3" weight="bold">Data & Privacy</AppText>
            
            <VStack space={2}>
              {actionItems.map((item, index) => (
                <Box key={item.title}>
                  <Pressable 
                    onPress={item.action}
                    _pressed={{ backgroundColor: 'gray.100' }}
                  >
                    <HStack space={3} alignItems="center" py={3}>
                      <Ionicons name={item.icon as any} size={20} color={typeof item.color === 'string' ? item.color : item.color[500]} />
                      <VStack flex={1} space={1}>
                        <AppText variant="body" weight="medium">{item.title}</AppText>
                        <AppText variant="small" color="secondary">{item.description}</AppText>
                      </VStack>
                      <Ionicons name="chevron-forward" size={16} color={Colors.text.disabled} />
                    </HStack>
                  </Pressable>
                  {index < actionItems.length - 1 && <Divider />}
                </Box>
              ))}
            </VStack>
          </VStack>

          {/* App Information */}
          <VStack space={4} bg="gray.50" p={4} borderRadius="xl">
            <AppText variant="h3" weight="bold">App Information</AppText>
            
            <VStack space={3}>
              <HStack justifyContent="space-between">
                <AppText variant="body" color="secondary">Version</AppText>
                <AppText variant="body" weight="medium">1.0.0</AppText>
              </HStack>
              
              <HStack justifyContent="space-between">
                <AppText variant="body" color="secondary">Build Number</AppText>
                <AppText variant="body" weight="medium">2024.10.1</AppText>
              </HStack>
              
              <HStack justifyContent="space-between">
                <AppText variant="body" color="secondary">Last Updated</AppText>
                <AppText variant="body" weight="medium">October 2024</AppText>
              </HStack>
            </VStack>

            <HStack space={2} mt={2}>
              <AppButton 
                variant="outline" 
                style={{ flex: 1 }}
                onPress={handleCopyAppInfo}
                leftIcon={<Ionicons name="copy" size={16} color={Colors.primary[500]} />}
              >
                Copy Info
              </AppButton>
              <AppButton 
                variant="outline" 
                style={{ flex: 1 }}
                onPress={() => toast.show({ title: "Rate", description: "Opening app store" })}
                leftIcon={<Ionicons name="star" size={16} color={Colors.primary[500]} />}
              >
                Rate App
              </AppButton>
            </HStack>
          </VStack>

          {/* Account Actions */}
          <VStack space={3}>
            <AppButton 
              variant="outline" 
              onPress={() => toast.show({ title: "Delete", description: "Account deletion process" })}
              leftIcon={<Ionicons name="trash" size={16} color={Colors.error[500]} />}
            >
              Delete Account
            </AppButton>
            
            <AppButton 
              variant="outline" 
              style={{ flex: 1 }}
              onPress={handleLogout}
              leftIcon={<Ionicons name="log-out" size={16} color={Colors.error[500]} />}
            >
              Log Out
            </AppButton>
          </VStack>
        </VStack>
      </ScrollView>

      {/* Logout Confirmation */}
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Box w="100%" p={4}>
            <VStack space={4} alignItems="center">
              <Ionicons name="log-out" size={48} color={Colors.error[500]} />
              
              <VStack space={2} alignItems="center">
                <AppText variant="h3" weight="bold">Log Out?</AppText>
                <AppText variant="body" color="secondary" align="center">
                  Are you sure you want to log out? You'll need to sign in again to access your account.
                </AppText>
              </VStack>

              <HStack space={3} width="100%">
                <AppButton 
                  variant="outline" 
                  style={{ flex: 1 }}
                  onPress={onClose}
                >
                  Cancel
                </AppButton>
                <AppButton 
                  variant="outline" 
                  style={{ flex: 1 }}
                  color={Colors.error[500]}
                  onPress={confirmLogout}
                >
                  Log Out
                </AppButton>
              </HStack>
            </VStack>
          </Box>
        </Actionsheet.Content>
      </Actionsheet>
    </Box>
  );
};

export default SettingsScreen;