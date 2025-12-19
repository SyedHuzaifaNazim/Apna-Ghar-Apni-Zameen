import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { Platform, StyleSheet, Switch, View } from 'react-native';

import { Colors } from '@/constants/Colors';
import AppText from '../../components/base/AppText';
import { STORAGE_KEYS, storageService } from '../../services/storageService';

interface AccountToggle {
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  key: keyof AccountPreferences;
}

interface AccountPreferences {
  pushNotifications: boolean;
  emailUpdates: boolean;
  smsAlerts: boolean;
  autoSaveSearches: boolean;
}

const defaultPreferences: AccountPreferences = {
  pushNotifications: true,
  emailUpdates: false,
  smsAlerts: false,
  autoSaveSearches: true,
};

const TOGGLES: AccountToggle[] = [
  {
    label: 'Push Notifications',
    description: 'Receive instant updates on your phone',
    icon: 'notifications',
    key: 'pushNotifications',
  },
  {
    label: 'Email Updates',
    description: 'Weekly digest of new listings',
    icon: 'mail',
    key: 'emailUpdates',
  },
  {
    label: 'SMS Alerts',
    description: 'Critical alerts via SMS',
    icon: 'chatbox',
    key: 'smsAlerts',
  },
  {
    label: 'Auto-save Searches',
    description: 'Automatically save your search filters',
    icon: 'save',
    key: 'autoSaveSearches',
  },
];

const AccountSettings: React.FC = () => {
  const [preferences, setPreferences] = useState<AccountPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPreferences = async () => {
      const stored = await storageService.getItem<AccountPreferences>(STORAGE_KEYS.USER_PREFERENCES);
      if (stored) {
        setPreferences(stored);
      }
      setLoading(false);
    };

    loadPreferences();
  }, []);

  const handleToggle = useCallback(
    async (key: keyof AccountPreferences) => {
      const next = { ...preferences, [key]: !preferences[key] };
      setPreferences(next);
      await storageService.setItem(STORAGE_KEYS.USER_PREFERENCES, next);
    },
    [preferences]
  );

  if (loading) {
    return null;
  }

  return (
    <View style={styles.card}>
      <AppText variant="h3" weight="bold" style={styles.title}>
        Account Settings
      </AppText>

      {TOGGLES.map((toggle, index) => (
        <View
          key={toggle.key}
          style={[
            styles.row,
            index !== TOGGLES.length - 1 && styles.borderBottom
          ]}
        >
          <View style={styles.infoContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name={toggle.icon} size={20} color={Colors.primary[500]} />
            </View>
            <View style={styles.textContainer}>
              <AppText variant="body" weight="medium">
                {toggle.label}
              </AppText>
              <AppText variant="small" color="secondary">
                {toggle.description}
              </AppText>
            </View>
          </View>

          <Switch
            value={preferences[toggle.key]}
            onValueChange={() => handleToggle(toggle.key)}
            trackColor={{ false: Colors.gray ? Colors.gray[300] : '#d1d5db', true: Colors.primary[500] }}
            thumbColor={'white'}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  title: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray ? Colors.gray[100] : '#f3f4f6',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
  },
});

export default AccountSettings;