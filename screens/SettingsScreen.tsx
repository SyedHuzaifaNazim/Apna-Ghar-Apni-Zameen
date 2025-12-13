import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native';

import AppButton from '@/components/base/AppButton';
import AppText from '@/components/base/AppText';
import { Colors } from '@/constants/Colors';

const SettingsScreen: React.FC = () => {
  const router = useRouter();
  
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); 
  
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

  const showSimpleAlert = (title: string, message: string) => {
    Alert.alert(title, message);
  };
  
  const handleSettingToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    
    showSimpleAlert(
      "Setting updated",
      `${key} ${!settings[key] ? 'enabled' : 'disabled'}`
    );
  };

  const handleClearCache = () => {
    showSimpleAlert("Cache cleared", "App cache has been cleared successfully");
  };

  const handleExportData = () => {
    showSimpleAlert("Data exported", "Your data has been exported successfully");
  };

  const handleCopyAppInfo = async () => {
    await Clipboard.setStringAsync('Apna Ghar Apni Zameen v1.0.0');
    showSimpleAlert("Copied", "App information copied to clipboard");
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    showSimpleAlert("Logged out", "You have been logged out successfully");
    setIsLogoutModalOpen(false);
    // Add router.replace('/login') here for actual redirection
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
          key: "pushNotifications" as const
        },
        {
          label: "Email Notifications",
          description: "Get property updates via email",
          value: settings.emailNotifications,
          key: "emailNotifications" as const
        },
        {
          label: "SMS Alerts",
          description: "Important alerts via SMS",
          value: settings.smsAlerts,
          key: "smsAlerts" as const
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
          key: "locationServices" as const
        },
        {
          label: "Biometric Authentication",
          description: "Use fingerprint or face ID to login",
          value: settings.biometricAuth,
          key: "biometricAuth" as const
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
      color: Colors.primary[500]
    },
    {
      icon: "document",
      title: "Terms of Service",
      description: "View our terms and conditions",
      action: () => showSimpleAlert("Terms", "Opening terms of service"),
      color: Colors.text.primary
    },
    {
      icon: "lock-closed",
      title: "Privacy Policy",
      description: "How we handle your data",
      action: () => showSimpleAlert("Privacy", "Opening privacy policy"),
      color: Colors.text.primary
    }
  ];

  const handleBack = () => {
      if (router.canGoBack()) {
          router.back();
      }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        {router.canGoBack() && (
            <TouchableOpacity 
                onPress={handleBack}
                style={styles.headerButton}
            >
                <Ionicons name="arrow-back" size={24} color={Colors.primary[500]} />
            </TouchableOpacity>
        )}
        <AppText variant="h2" weight="bold" style={styles.headerTitle}>Settings</AppText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Settings Sections */}
        {settingSections.map(section => (
          <View key={section.title} style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Ionicons name={section.icon as any} size={20} color={Colors.primary[500]} />
              <AppText variant="h3" weight="bold" style={styles.sectionTitle}>{section.title}</AppText>
            </View>
            
            <View style={styles.sectionItemsContainer}>
              {section.items.map(item => (
                <View key={item.key} style={styles.settingItem}>
                  <View style={styles.settingTextContainer}>
                    <AppText variant="body" weight="medium">{item.label}</AppText>
                    <AppText variant="small" color="secondary">{item.description}</AppText>
                  </View>
                  <Switch
                    value={item.value}
                    onValueChange={() => handleSettingToggle(item.key)}
                    trackColor={{ false: Colors.gray[300], true: Colors.primary[500] }}
                    thumbColor={item.value ? Colors.primary[50] : Colors.gray[500]}
                  />
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Action Items */}
        <View style={styles.sectionContainer}>
          <AppText variant="h3" weight="bold" style={styles.sectionTitle}>Data & Privacy</AppText>
          
          <View style={styles.sectionItemsContainer}>
            {actionItems.map((item, index) => (
              <View key={item.title}>
                <TouchableOpacity 
                  onPress={item.action}
                  style={styles.actionItemButton}
                  activeOpacity={0.8}
                >
                  <View style={styles.actionItemContent}>
                    <Ionicons name={item.icon as any} size={20} color={item.color as string} style={{ marginRight: 12 }} />
                    <View style={styles.settingTextContainer}>
                      <AppText variant="body" weight="medium">{item.title}</AppText>
                      <AppText variant="small" color="secondary">{item.description}</AppText>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={Colors.text.disabled} />
                  </View>
                </TouchableOpacity>
                {index < actionItems.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </View>

        {/* App Information (Appearance section simplified) */}
         <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Ionicons name="color-palette" size={20} color={Colors.primary[500]} />
              <AppText variant="h3" weight="bold" style={styles.sectionTitle}>Appearance</AppText>
            </View>
            
            <View style={styles.sectionItemsContainer}>
               {/* Dark Mode Toggle */}
                <View style={styles.settingItem}>
                  <View style={styles.settingTextContainer}>
                    <AppText variant="body" weight="medium">Dark Mode</AppText>
                    <AppText variant="small" color="secondary">Switch to dark theme</AppText>
                  </View>
                  <Switch
                    value={settings.darkMode}
                    onValueChange={() => handleSettingToggle('darkMode')}
                    trackColor={{ false: Colors.gray[300], true: Colors.primary[500] }}
                    thumbColor={settings.darkMode ? Colors.primary[50] : Colors.gray[500]}
                  />
                </View>
            </View>
         </View>
         
        <View style={styles.sectionContainer}>
          <AppText variant="h3" weight="bold" style={styles.sectionTitle}>App Information</AppText>
          
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <AppText variant="body" color="secondary">Version</AppText>
              <AppText variant="body" weight="medium">1.0.0</AppText>
            </View>
            
            <View style={styles.infoRow}>
              <AppText variant="body" color="secondary">Build Number</AppText>
              <AppText variant="body" weight="medium">2024.10.1</AppText>
            </View>
            
            <View style={styles.infoRow}>
              <AppText variant="body" color="secondary">Last Updated</AppText>
              <AppText variant="body" weight="medium">October 2024</AppText>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <AppButton 
              variant="outline" 
              style={styles.infoButton}
              onPress={handleCopyAppInfo}
              leftIcon={<Ionicons name="copy" size={16} color={Colors.primary[500]} />}
            >
              Copy Info
            </AppButton>
            <AppButton 
              variant="outline" 
              style={styles.infoButton}
              onPress={() => showSimpleAlert("Rate", "Opening app store")}
              leftIcon={<Ionicons name="star" size={16} color={Colors.primary[500]} />}
            >
              Rate App
            </AppButton>
          </View>
        </View>

        {/* Account Actions */}
        <View style={styles.accountActions}>
            <AppButton 
              variant="outline" 
              style={styles.actionButton}
              onPress={() => showSimpleAlert("Delete", "Account deletion process")}
              leftIcon={<Ionicons name="trash" size={16} color={Colors.error[500]} />}
            >
              Delete Account
            </AppButton>
            
            <AppButton 
              variant="outline" 
              style={styles.actionButton}
              onPress={handleLogout}
              leftIcon={<Ionicons name="log-out" size={16} color={Colors.error[500]} />}
            >
              Log Out
            </AppButton>
        </View>
        <View style={{ height: 40 }}/>
      </ScrollView>

      {/* Logout Confirmation Modal (Replaced Actionsheet) */}
      <Modal visible={isLogoutModalOpen} transparent={true} animationType="fade" onRequestClose={() => setIsLogoutModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalVStack}>
              <Ionicons name="log-out" size={48} color={Colors.error[500]} />
              
              <View style={styles.modalTextContainer}>
                <AppText variant="h3" weight="bold" align="center">Log Out?</AppText>
                <AppText variant="body" color="secondary" align="center" style={styles.modalText}>
                  Are you sure you want to log out? You'll need to sign in again to access your account.
                </AppText>
              </View>

              <View style={styles.modalButtonRow}>
                <AppButton 
                  variant="outline" 
                  style={styles.modalButton}
                  onPress={() => setIsLogoutModalOpen(false)}
                >
                  Cancel
                </AppButton>
                <AppButton 
                  variant="ghost" 
                  style={styles.modalButtonRed}
                  onPress={confirmLogout}
                >
                  Log Out
                </AppButton>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
    backgroundColor: 'white',
  },
  headerButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
      marginLeft: 10,
  },
  scrollContent: {
    padding: 16,
  },
  sectionContainer: {
    backgroundColor: Colors.gray[50],
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    marginLeft: 8,
  },
  sectionItemsContainer: {
    gap: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 16,
    gap: 4,
  },
  // Action Items
  actionItemButton: {
    borderRadius: 12,
  },
  actionItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray[200],
    marginLeft: 32, // Indent the divider
  },
  // Info Section
  infoSection: {
      gap: 12,
      marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  infoButton: {
    flex: 1,
  },
  accountActions: {
    gap: 12,
    paddingHorizontal: 16,
  },
  actionButton: {
    backgroundColor: 'transparent',
    borderColor: Colors.error[500],
    borderWidth: 1,
  },
  // Modal Styles (Replaced Actionsheet)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end', // Simulates Actionsheet behavior
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    width: '100%',
  },
  modalVStack: {
      alignItems: 'center',
      gap: 20,
  },
  modalTextContainer: {
    alignItems: 'center',
    gap: 8,
  },
  modalText: {
    textAlign: 'center',
  },
  modalButtonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderColor: Colors.primary[500],
    borderWidth: 1,
  },
  modalButtonRed: {
    flex: 1,
    backgroundColor: Colors.error[500],
    borderColor: Colors.error[500],
    borderWidth: 1,
  }
});

export default SettingsScreen;