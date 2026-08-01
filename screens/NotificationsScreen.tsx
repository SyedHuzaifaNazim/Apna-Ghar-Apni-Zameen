import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppText from '@/components/base/AppText';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Shadows, Spacing } from '@/constants/Layout';
import { storageService } from '@/services/storageService';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'alert' | 'update' | 'promotional';
  read: boolean;
}

interface NotificationPrefs {
  priceAlerts: boolean;
  newMatches: boolean;
  viewingReminders: boolean;
  marketUpdates: boolean;
  promotional: boolean;
}

const DEFAULT_PREFS: NotificationPrefs = {
  priceAlerts: true,
  newMatches: true,
  viewingReminders: true,
  marketUpdates: false,
  promotional: false,
};

const PREFS_KEY = 'notification_preferences';

const PREF_ITEMS: { key: keyof NotificationPrefs; label: string; description: string }[] = [
  { key: 'priceAlerts', label: 'Price Alerts', description: 'Get notified when saved properties change price' },
  { key: 'newMatches', label: 'New Matches', description: 'Alert when new properties match your criteria' },
  { key: 'viewingReminders', label: 'Viewing Reminders', description: 'Reminders for scheduled property viewings' },
  { key: 'marketUpdates', label: 'Market Updates', description: 'Real estate market trends and insights' },
  { key: 'promotional', label: 'Promotional', description: 'Special offers and promotional content' },
];

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'alert':
      return <Ionicons name="alert-circle" size={22} color={Colors.error[500]} />;
    case 'update':
      return <Ionicons name="information-circle" size={22} color={Colors.primary[500]} />;
    case 'promotional':
      return <Ionicons name="megaphone" size={22} color={Colors.secondary[500]} />;
  }
};

const NotificationsScreen: React.FC = () => {
  const router = useRouter();

  // No backend notification feed exists yet (lands with the alerts/matching
  // system in a later task) — this starts empty rather than showing fabricated history.
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [prefs, setPrefs] = useState<NotificationPrefs>(DEFAULT_PREFS);

  useEffect(() => {
    storageService
      .getItem<NotificationPrefs>(PREFS_KEY)
      .then(saved => {
        if (saved) setPrefs(prev => ({ ...prev, ...saved }));
      })
      .catch(() => undefined);
  }, []);

  const handleTogglePref = (key: keyof NotificationPrefs) => {
    setPrefs(prev => {
      const next = { ...prev, [key]: !prev[key] };
      storageService.setItem(PREFS_KEY, next).catch(() => undefined);
      return next;
    });
  };

  const handleNotificationPress = (notification: Notification) => {
    setNotifications(prev => prev.map(n => (n.id === notification.id ? { ...n, read: true } : n)));
  };

  const handleClearAll = () => {
    Alert.alert('Clear notifications', 'Are you sure you want to clear all notifications?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => setNotifications([]) },
    ]);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {router.canGoBack() && (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.iconButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={22} color={Colors.primary[500]} />
            </TouchableOpacity>
          )}

          <View style={styles.headerTitleContainer}>
            <AppText variant="h3" weight="bold">
              Notifications
            </AppText>
            <AppText variant="bodySmall" color="secondary">
              {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
            </AppText>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleMarkAllAsRead} style={styles.iconButton} disabled={notifications.length === 0}>
            <Ionicons
              name="checkmark-done"
              size={20}
              color={notifications.length === 0 ? Colors.gray[300] : Colors.primary[500]}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleClearAll} style={styles.iconButton} disabled={notifications.length === 0}>
            <Ionicons
              name="trash-outline"
              size={20}
              color={notifications.length === 0 ? Colors.gray[300] : Colors.error[500]}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentContainer}>
          <View style={styles.settingsCard}>
            <AppText variant="h4" weight="bold" style={styles.sectionTitle}>
              Notification Settings
            </AppText>

            <View style={styles.settingsList}>
              {PREF_ITEMS.map(item => (
                <View key={item.key} style={styles.settingItem}>
                  <View style={styles.settingText}>
                    <AppText variant="body" weight="medium">
                      {item.label}
                    </AppText>
                    <AppText variant="bodySmall" color="secondary">
                      {item.description}
                    </AppText>
                  </View>
                  <Switch
                    value={prefs[item.key]}
                    onValueChange={() => handleTogglePref(item.key)}
                    trackColor={{ false: Colors.gray[300], true: Colors.primary[300] }}
                    thumbColor={prefs[item.key] ? Colors.primary[500] : Colors.gray[100]}
                  />
                </View>
              ))}
            </View>
          </View>

          <View style={styles.notificationsSection}>
            <AppText variant="h4" weight="bold" style={styles.sectionTitle}>
              Recent Notifications
            </AppText>

            {notifications.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="notifications-off-outline" size={48} color={Colors.text.disabled} />
                <AppText variant="body" color="secondary" align="center" style={styles.emptyText}>
                  No notifications yet
                </AppText>
                <AppText variant="bodySmall" color="muted" align="center" style={styles.emptySubtext}>
                  You&apos;ll see price alerts and property matches here once you save searches or favorites.
                </AppText>
              </View>
            ) : (
              <View style={styles.notificationsList}>
                {notifications.map(notification => (
                  <Pressable
                    key={notification.id}
                    onPress={() => handleNotificationPress(notification)}
                    style={({ pressed }) => [
                      styles.notificationCard,
                      {
                        backgroundColor: notification.read ? Colors.background.card : Colors.primary[50],
                        borderColor: notification.read ? Colors.gray[200] : Colors.primary[200],
                        opacity: pressed ? 0.9 : 1,
                      },
                    ]}
                  >
                    <View style={styles.notificationContentRow}>
                      <View style={styles.iconContainer}>{getNotificationIcon(notification.type)}</View>

                      <View style={styles.notificationTextContainer}>
                        <View style={styles.notificationHeader}>
                          <AppText variant="body" weight="medium" style={styles.flexText}>
                            {notification.title}
                          </AppText>
                          {!notification.read && <View style={styles.unreadDot} />}
                        </View>

                        <AppText variant="bodySmall" color="secondary" style={styles.messageText}>
                          {notification.message}
                        </AppText>

                        <AppText variant="caption" color="disabled">
                          {notification.time}
                        </AppText>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.primary },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    backgroundColor: Colors.background.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    ...Shadows.sm,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: Spacing.sm },
  headerTitleContainer: { flex: 1 },
  headerActions: { flexDirection: 'row', gap: 4 },
  iconButton: { padding: Spacing.xs },
  scrollContent: { paddingBottom: Spacing.xl },
  contentContainer: { padding: Spacing.md, gap: Spacing.lg },

  settingsCard: { backgroundColor: Colors.gray[50], borderRadius: BorderRadius.lg, padding: Spacing.md },
  sectionTitle: { marginBottom: Spacing.md },
  settingsList: { gap: Spacing.md },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: Spacing.md },
  settingText: { flex: 1, gap: 4 },

  notificationsSection: { gap: Spacing.sm },
  notificationsList: { gap: Spacing.sm },
  emptyState: { alignItems: 'center', paddingVertical: Spacing.xl, paddingHorizontal: Spacing.lg },
  emptyText: { marginTop: Spacing.sm },
  emptySubtext: { marginTop: Spacing.xs },

  notificationCard: { padding: Spacing.md, borderRadius: BorderRadius.lg, borderWidth: 1 },
  notificationContentRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start' },
  iconContainer: { marginTop: 2 },
  notificationTextContainer: { flex: 1, gap: 4 },
  notificationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  flexText: { flex: 1, marginRight: Spacing.sm },
  unreadDot: { width: 8, height: 8, backgroundColor: Colors.primary[500], borderRadius: 4, marginTop: 6 },
  messageText: { marginBottom: 4 },
});

export default NotificationsScreen;
