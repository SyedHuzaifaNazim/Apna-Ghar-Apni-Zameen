import { Ionicons } from '@expo/vector-icons';
import { Box, Button, HStack, VStack } from 'native-base';
import React from 'react';
import { Colors } from '../../constants/Colors';

import AppText from '../../components/base/AppText';
import { useAuth } from '../../hooks/useAuth';

const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <Box p={6} bg={Colors.background.primary} borderRadius="2xl" shadow={1} alignItems="center">
        <Ionicons name="person-circle-outline" size={64} color={Colors.text.secondary} />
        <AppText variant="body" color={Colors.text.secondary} style={{ textAlign: 'center', marginTop: 16 }}>
          Sign in to manage your profile and preferences.
        </AppText>
      </Box>
    );
  }

  return (
    <VStack space={4} bg={Colors.background.primary} p={6} borderRadius="2xl" shadow={1}>
      <HStack space={4} alignItems="center">
        <Ionicons name="person-circle-outline" size={64} color={Colors.text.secondary} />
        <VStack flex={1}>
          <AppText variant="h2" weight="bold" color={Colors.text.primary}>
            {user.name}
          </AppText>
          <AppText variant="body" color={Colors.text.secondary}>
            {user.email}
          </AppText>
          {user.phone && (
            <AppText variant="body" color={Colors.text.secondary}>
              {user.phone}
            </AppText>
          )}
        </VStack>
      </HStack>

      <Button
        variant="outline"
        colorScheme="primary"
        leftIcon={<Ionicons name="log-out-outline" size={18} color={Colors.text.primary} />}
        onPress={logout}
      >
        Sign out
      </Button>
    </VStack>
  );
};

export default UserProfile;
