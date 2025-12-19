import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppText from '@/components/base/AppText';
import { Colors } from '@/constants/Colors';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'alert' | 'update' | 'promotional';
  read: boolean;
  action?: string;
}

const NotificationsScreen: React.FC = () => {
  const router = useRouter();
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Price Drop Alert',
      message: 'The 3-bed flat in Clifton you saved has reduced price by Rs 5 Lakh',
      time: '2 hours ago',
      type: 'alert',
      read: false,
      action: 'View Property'
    },
    {
      id: '2',
      title: 'New Property Match',
      message: 'We found 4 new properties matching your search criteria in Gulshan-e-Iqbal',
      time: '1 day ago',
      type: 'update',
      read: true
    },
    {
      id: '3',
      title: 'Schedule Viewing Reminder',
      message: 'Don\'t forget your property viewing tomorrow at 3:00 PM',
      time: '2 days ago',
      type: 'alert',
      read: true,
      action: 'View Details'
    },
    {
      id: '4',
      title: 'Market Insights',
      message: 'Property prices in Karachi have increased by 6% this quarter',
      time: '3 days ago',
      type: 'update',
      read: true
    },
    {
      id: '5',
      title: 'Exclusive Offer',
      message: 'Get special discounts on premium properties this weekend',
      time: '1 week ago',
      type: 'promotional',
      read: true
    }
  ]);

  const [notificationSettings, setNotificationSettings] = useState({
    priceAlerts: true,
    newMatches: true,
    viewingReminders: true,
    marketUpdates: false,
    promotional: false
  });

  const handleNotificationPress = (notification: Notification) => {
    // Mark as read
    setNotifications(prev =>
      prev.map(n =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    );

    if (notification.action) {
      Alert.alert(notification.title, `Action: ${notification.action}`);
    }
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear Notifications",
      "Are you sure you want to clear all notifications?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear", 
          style: "destructive",
          onPress: () => {
            setNotifications([]);
            Alert.alert("Success", "All notifications have been cleared");
          }
        }
      ]
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
    Alert.alert("Success", "All notifications marked as read");
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <Ionicons name="alert-circle" size={24} color={Colors.error[500]} />;
      case 'update':
        return <Ionicons name="information-circle" size={24} color={Colors.primary[500]} />;
      case 'promotional':
        return <Ionicons name="megaphone" size={24} color={Colors.secondary[500]} />;
      default:
        return <Ionicons name="notifications" size={24} color={Colors.text.secondary} />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {router.canGoBack() && (
            <TouchableOpacity 
              onPress={() => router.back()} 
              style={styles.iconButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.primary[500]} />
            </TouchableOpacity>
          )}
          
          <View style={styles.headerTitleContainer}>
            <AppText variant="h2" weight="bold">Notifications</AppText>
            <AppText variant="body" color="secondary">
              {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
            </AppText>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity 
            onPress={handleMarkAllAsRead} 
            style={styles.iconButton}
          >
            <Ionicons name="checkmark-done" size={22} color={Colors.primary[500]} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleClearAll} 
            style={styles.iconButton}
          >
            <Ionicons name="trash-outline" size={22} color={Colors.error[500]} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentContainer}>
          
          {/* Notification Settings */}
          <View style={styles.settingsCard}>
            <AppText variant="h3" weight="bold" style={styles.sectionTitle}>Notification Settings</AppText>
            
            <View style={styles.settingsList}>
              <View style={styles.settingItem}>
                <View style={styles.settingText}>
                  <AppText variant="body" weight="medium">Price Alerts</AppText>
                  <AppText variant="small" color="secondary">
                    Get notified when saved properties change price
                  </AppText>
                </View>
                <Switch
                  value={notificationSettings.priceAlerts}
                  onValueChange={() => setNotificationSettings(prev => ({
                    ...prev,
                    priceAlerts: !prev.priceAlerts
                  }))}
                  trackColor={{ false: Colors.gray[300], true: Colors.primary[300] }}
                  thumbColor={notificationSettings.priceAlerts ? Colors.primary[500] : Colors.gray[100]}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingText}>
                  <AppText variant="body" weight="medium">New Matches</AppText>
                  <AppText variant="small" color="secondary">
                    Alert when new properties match your criteria
                  </AppText>
                </View>
                <Switch
                  value={notificationSettings.newMatches}
                  onValueChange={() => setNotificationSettings(prev => ({
                    ...prev,
                    newMatches: !prev.newMatches
                  }))}
                  trackColor={{ false: Colors.gray[300], true: Colors.primary[300] }}
                  thumbColor={notificationSettings.newMatches ? Colors.primary[500] : Colors.gray[100]}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingText}>
                  <AppText variant="body" weight="medium">Viewing Reminders</AppText>
                  <AppText variant="small" color="secondary">
                    Reminders for scheduled property viewings
                  </AppText>
                </View>
                <Switch
                  value={notificationSettings.viewingReminders}
                  onValueChange={() => setNotificationSettings(prev => ({
                    ...prev,
                    viewingReminders: !prev.viewingReminders
                  }))}
                  trackColor={{ false: Colors.gray[300], true: Colors.primary[300] }}
                  thumbColor={notificationSettings.viewingReminders ? Colors.primary[500] : Colors.gray[100]}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingText}>
                  <AppText variant="body" weight="medium">Market Updates</AppText>
                  <AppText variant="small" color="secondary">
                    Real estate market trends and insights
                  </AppText>
                </View>
                <Switch
                  value={notificationSettings.marketUpdates}
                  onValueChange={() => setNotificationSettings(prev => ({
                    ...prev,
                    marketUpdates: !prev.marketUpdates
                  }))}
                  trackColor={{ false: Colors.gray[300], true: Colors.primary[300] }}
                  thumbColor={notificationSettings.marketUpdates ? Colors.primary[500] : Colors.gray[100]}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingText}>
                  <AppText variant="body" weight="medium">Promotional</AppText>
                  <AppText variant="small" color="secondary">
                    Special offers and promotional content
                  </AppText>
                </View>
                <Switch
                  value={notificationSettings.promotional}
                  onValueChange={() => setNotificationSettings(prev => ({
                    ...prev,
                    promotional: !prev.promotional
                  }))}
                  trackColor={{ false: Colors.gray[300], true: Colors.primary[300] }}
                  thumbColor={notificationSettings.promotional ? Colors.primary[500] : Colors.gray[100]}
                />
              </View>
            </View>
          </View>

          {/* Notifications List */}
          <View style={styles.notificationsSection}>
            <AppText variant="h3" weight="bold" style={styles.sectionTitle}>Recent Notifications</AppText>
            
            {notifications.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="notifications-off-outline" size={48} color={Colors.text.disabled} />
                <AppText variant="body" color="secondary" align="center" style={styles.emptyText}>
                  No notifications yet
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
                        backgroundColor: notification.read ? 'white' : Colors.primary[50],
                        borderColor: notification.read ? Colors.gray[200] : Colors.primary[200],
                        opacity: pressed ? 0.9 : 1
                      }
                    ]}
                  >
                    <View style={styles.notificationContentRow}>
                      <View style={styles.iconContainer}>
                        {getNotificationIcon(notification.type)}
                      </View>
                      
                      <View style={styles.notificationTextContainer}>
                        <View style={styles.notificationHeader}>
                          <AppText variant="body" weight="medium" style={styles.flexText}>
                            {notification.title}
                          </AppText>
                          {!notification.read && (
                            <View style={styles.unreadDot} />
                          )}
                        </View>
                        
                        <AppText variant="body" color="secondary" style={styles.messageText}>
                          {notification.message}
                        </AppText>
                        
                        <View style={styles.notificationFooter}>
                          <AppText variant="small" color="disabled">
                            {notification.time}
                          </AppText>
                          
                          {notification.action && (
                            <AppText variant="small" color="primary" weight="medium">
                              {notification.action}
                            </AppText>
                          )}
                        </View>
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
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 4,
  },
  iconButton: {
    padding: 8,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  contentContainer: {
    padding: 16,
    gap: 24,
  },
  settingsCard: {
    backgroundColor: Colors.gray[50],
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  settingsList: {
    gap: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  settingText: {
    flex: 1,
    gap: 4,
  },
  notificationsSection: {
    gap: 12,
  },
  notificationsList: {
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    marginTop: 8,
  },
  notificationCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  notificationContentRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginTop: 2,
  },
  notificationTextContainer: {
    flex: 1,
    gap: 4,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  flexText: {
    flex: 1,
    marginRight: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    backgroundColor: Colors.primary[500],
    borderRadius: 4,
    marginTop: 6,
  },
  messageText: {
    marginBottom: 4,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
});

export default NotificationsScreen;