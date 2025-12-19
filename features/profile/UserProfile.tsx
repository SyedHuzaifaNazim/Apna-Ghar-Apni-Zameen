import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Colors } from '../../constants/Colors';

import AppButton from '../../components/base/AppButton';
import AppText from '../../components/base/AppText';
import { useAuth } from '../../hooks/useAuth';

const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <View style={styles.card}>
        <View style={styles.centerContent}>
          <Ionicons name="person-circle-outline" size={64} color={Colors.text.secondary} />
          <AppText variant="body" color="secondary" style={styles.signInText}>
            Sign in to manage your profile and preferences.
          </AppText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.profileHeader}>
        <Ionicons name="person-circle-outline" size={64} color={Colors.text.secondary} />
        <View style={styles.profileInfo}>
          <AppText variant="h2" weight="bold" color="primary">
            {user.name}
          </AppText>
          <AppText variant="body" color="secondary">
            {user.email}
          </AppText>
          {user.phone && (
            <AppText variant="body" color="secondary">
              {user.phone}
            </AppText>
          )}
        </View>
      </View>

      <AppButton
        variant="outline"
        style={styles.signOutButton}
        textStyle={{ color: Colors.text.primary }}
        leftIcon={<Ionicons name="log-out-outline" size={18} color={Colors.text.primary} />}
        onPress={logout}
      >
        Sign out
      </AppButton>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background.primary || '#fff',
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
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
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInText: {
    textAlign: 'center',
    marginTop: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  signOutButton: {
    borderColor: Colors.gray ? Colors.gray[300] : '#e5e7eb',
  }
});

export default UserProfile;