import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as Clipboard from 'expo-clipboard';
import { Href, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppButton from '@/components/base/AppButton';
import AppText from '@/components/base/AppText';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/Layout';
import { useAuth } from '@/context/AuthContext';
import { storageService, STORAGE_KEYS } from '@/services/storageService';

interface PersistedSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsAlerts: boolean;
  locationServices: boolean;
}

const DEFAULT_SETTINGS: PersistedSettings = {
  pushNotifications: true,
  emailNotifications: true,
  smsAlerts: false,
  locationServices: true,
};

const APP_VERSION = Constants.expoConfig?.version ?? '1.0.0';

const SettingsScreen: React.FC = () => {
  const router = useRouter();
  const { signOut } = useAuth();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [settings, setSettings] = useState<PersistedSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    storageService
      .getItem<PersistedSettings>(STORAGE_KEYS.APP_SETTINGS)
      .then(saved => {
        if (saved) setSettings(prev => ({ ...prev, ...saved }));
      })
      .catch(() => undefined);
  }, []);

  const handleSettingToggle = (key: keyof PersistedSettings) => {
    setSettings(prev => {
      const next = { ...prev, [key]: !prev[key] };
      storageService.setItem(STORAGE_KEYS.APP_SETTINGS, next).catch(() => undefined);
      return next;
    });
  };

  const handleClearCache = () => {
    Alert.alert('Clear cache?', 'This removes cached property and image data. Your account and saved favorites are unaffected.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear Cache',
        style: 'destructive',
        onPress: async () => {
          await storageService.clearCache();
          Alert.alert('Cache cleared', 'App cache has been cleared.');
        },
      },
    ]);
  };

  const handleCopyAppInfo = async () => {
    await Clipboard.setStringAsync(`Farsh e Zameen v${APP_VERSION}`);
    Alert.alert('Copied', 'App information copied to clipboard.');
  };

  const handleLogout = () => setIsLogoutModalOpen(true);

  const confirmLogout = async () => {
    setIsLogoutModalOpen(false);
    await signOut();
    router.replace('/(tabs)/' as Href);
  };

  const settingSections: {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    items: { label: string; description: string; value: boolean; key: keyof PersistedSettings }[];
  }[] = [
    {
      title: 'Notifications',
      icon: 'notifications',
      items: [
        {
          label: 'Push Notifications',
          description: 'Receive push notifications for alerts and updates',
          value: settings.pushNotifications,
          key: 'pushNotifications',
        },
        {
          label: 'Email Notifications',
          description: 'Get property updates via email',
          value: settings.emailNotifications,
          key: 'emailNotifications',
        },
        {
          label: 'SMS Alerts',
          description: 'Important alerts via SMS',
          value: settings.smsAlerts,
          key: 'smsAlerts',
        },
      ],
    },
    {
      title: 'Privacy & Security',
      icon: 'shield-checkmark',
      items: [
        {
          label: 'Location Services',
          description: 'Use your location for nearby properties',
          value: settings.locationServices,
          key: 'locationServices',
        },
      ],
    },
  ];

  const actionItems: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    description: string;
    action: () => void;
    color: string;
  }[] = [
    {
      icon: 'trash',
      title: 'Clear Cache',
      description: 'Clear temporary app data',
      action: handleClearCache,
      color: Colors.text.secondary,
    },
    {
      icon: 'document',
      title: 'Terms of Service',
      description: 'View our terms and conditions',
      action: () =>
        Alert.alert('Terms of Service', 'A dedicated Terms of Service page is coming soon.'),
      color: Colors.text.primary,
    },
    {
      icon: 'lock-closed',
      title: 'Privacy Policy',
      description: 'How we handle your data',
      action: () =>
        Alert.alert('Privacy Policy', 'A dedicated Privacy Policy page is coming soon.'),
      color: Colors.text.primary,
    },
  ];

  const handleBack = () => {
    if (router.canGoBack()) router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        {router.canGoBack() && (
          <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={22} color={Colors.primary[500]} />
          </TouchableOpacity>
        )}
        <AppText variant="h3" weight="bold" style={styles.headerTitle}>
          Settings
        </AppText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {settingSections.map(section => (
          <View key={section.title} style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Ionicons name={section.icon} size={18} color={Colors.primary[500]} />
              <AppText variant="h4" weight="bold" style={styles.sectionTitle}>
                {section.title}
              </AppText>
            </View>

            <View style={styles.sectionItemsContainer}>
              {section.items.map(item => (
                <View key={item.key} style={styles.settingItem}>
                  <View style={styles.settingTextContainer}>
                    <AppText variant="body" weight="medium">
                      {item.label}
                    </AppText>
                    <AppText variant="bodySmall" color="secondary">
                      {item.description}
                    </AppText>
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

        <View style={styles.sectionContainer}>
          <AppText variant="h4" weight="bold" style={styles.sectionTitle}>
            Data & Privacy
          </AppText>

          <View style={styles.sectionItemsContainer}>
            {actionItems.map((item, index) => (
              <View key={item.title}>
                <TouchableOpacity onPress={item.action} style={styles.actionItemButton} activeOpacity={0.8}>
                  <View style={styles.actionItemContent}>
                    <Ionicons name={item.icon} size={18} color={item.color} style={styles.actionIcon} />
                    <View style={styles.settingTextContainer}>
                      <AppText variant="body" weight="medium">
                        {item.title}
                      </AppText>
                      <AppText variant="bodySmall" color="secondary">
                        {item.description}
                      </AppText>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={Colors.text.disabled} />
                  </View>
                </TouchableOpacity>
                {index < actionItems.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <AppText variant="h4" weight="bold" style={styles.sectionTitle}>
            App Information
          </AppText>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <AppText variant="body" color="secondary">
                Version
              </AppText>
              <AppText variant="body" weight="medium">
                {APP_VERSION}
              </AppText>
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
          </View>
        </View>

        <View style={styles.accountActions}>
          <AppButton
            variant="outline"
            style={styles.logoutOutlineButton}
            onPress={handleLogout}
            leftIcon={<Ionicons name="log-out" size={16} color={Colors.error[500]} />}
          >
            Log Out
          </AppButton>
        </View>
        <View style={styles.bottomSpacer} />
      </ScrollView>

      <Modal
        visible={isLogoutModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsLogoutModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalVStack}>
              <Ionicons name="log-out" size={44} color={Colors.error[500]} />

              <View style={styles.modalTextContainer}>
                <AppText variant="h4" weight="bold" align="center">
                  Log Out?
                </AppText>
                <AppText variant="bodySmall" color="secondary" align="center" style={styles.modalText}>
                  You&apos;ll need to sign in again to access your account.
                </AppText>
              </View>

              <View style={styles.modalButtonRow}>
                <AppButton variant="outline" style={styles.modalButton} onPress={() => setIsLogoutModalOpen(false)}>
                  Cancel
                </AppButton>
                <AppButton variant="primary" style={styles.modalButtonRed} onPress={confirmLogout}>
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
  safeArea: { flex: 1, backgroundColor: Colors.background.primary },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    backgroundColor: Colors.background.card,
  },
  headerButton: { padding: Spacing.xs, marginRight: Spacing.xs },
  headerTitle: { marginLeft: Spacing.xs },
  scrollContent: { padding: Spacing.md },
  sectionContainer: {
    backgroundColor: Colors.gray[50],
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md, gap: Spacing.xs },
  sectionTitle: {},
  sectionItemsContainer: { gap: Spacing.md },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  settingTextContainer: { flex: 1, marginRight: Spacing.md, gap: 4 },

  actionItemButton: { borderRadius: BorderRadius.md },
  actionItemContent: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm },
  actionIcon: { marginRight: Spacing.sm },
  divider: { height: 1, backgroundColor: Colors.gray[200], marginLeft: Spacing.xl },

  infoSection: { gap: Spacing.sm, marginTop: Spacing.xs },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  buttonRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  infoButton: { flex: 1 },

  accountActions: { paddingHorizontal: Spacing.md },
  logoutOutlineButton: { backgroundColor: 'transparent', borderColor: Colors.error[500], borderWidth: 1 },
  bottomSpacer: { height: Spacing.xxl },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: Colors.background.card,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.lg,
    width: '100%',
  },
  modalVStack: { alignItems: 'center', gap: Spacing.lg },
  modalTextContainer: { alignItems: 'center', gap: Spacing.xs },
  modalText: { textAlign: 'center' },
  modalButtonRow: { flexDirection: 'row', gap: Spacing.sm, width: '100%' },
  modalButton: { flex: 1, backgroundColor: 'transparent', borderColor: Colors.primary[500], borderWidth: 1 },
  modalButtonRed: { flex: 1, backgroundColor: Colors.error[500], borderColor: Colors.error[500], borderWidth: 1 },
});

export default SettingsScreen;
