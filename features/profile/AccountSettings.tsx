import { Ionicons } from '@expo/vector-icons';
import { HStack, IconButton, Switch, VStack } from 'native-base';
import React, { useCallback, useEffect, useState } from 'react';

import Colors from '@/constants/Colors';
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
    <VStack space={4} bg="white" p={4} borderRadius="2xl" shadow={1}>
      <AppText variant="h3" weight="bold">
        Account Settings
      </AppText>

      {TOGGLES.map(toggle => (
        <HStack
          key={toggle.key}
          justifyContent="space-between"
          alignItems="center"
          borderBottomWidth={1}
          borderBottomColor="gray.100"
          pb={3}
          mb={1}
        >
          <HStack space={3} alignItems="center" flex={1}>
            <IconButton
              icon={<Ionicons name={toggle.icon} size={20} color={Colors.primary[500]} />}
              variant="ghost"
            />
            <VStack flex={1}>
              <AppText variant="body" weight="medium">
                {toggle.label}
              </AppText>
              <AppText variant="small" color={Colors.text.secondary}>
                {toggle.description}
              </AppText>
            </VStack>
          </HStack>

          <Switch
            isChecked={preferences[toggle.key]}
            onToggle={() => handleToggle(toggle.key)}
            colorScheme="primary"
          />
        </HStack>
      ))}
    </VStack>
  );
};

export default AccountSettings;
