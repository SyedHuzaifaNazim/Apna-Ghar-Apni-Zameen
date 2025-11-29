import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Box, Center, HStack, IconButton, Pressable, ScrollView, Switch, useToast, VStack } from 'native-base';
import React, { useState } from 'react';

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
  const toast = useToast();
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

    toast.show({
      title: notification.title,
      description: `Notification action: ${notification.action || 'View details'}`,
      status: "info",
    });
  };

  const handleClearAll = () => {
    setNotifications([]);
    toast.show({
      title: "Cleared",
      description: "All notifications have been cleared",
      status: "success",
    });
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
    toast.show({
      title: "Marked as read",
      description: "All notifications marked as read",
      status: "success",
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <Ionicons name="alert-circle" size={20} color={Colors.error} />;
      case 'update':
        return <Ionicons name="information-circle" size={20} color={Colors.primary} />;
      case 'promotional':
        return <Ionicons name="megaphone" size={20} color={Colors.secondary} />;
      default:
        return <Ionicons name="notifications" size={20} color={Colors.text.secondary} />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Box flex={1} bg="white" safeArea>
      {/* Header */}
      <Box px={4} py={3} bg="white" shadow={1} borderBottomWidth={1} borderBottomColor="gray.200">
        <HStack alignItems="center" space={4}>
          {router.canGoBack() && (
            <IconButton
              icon={<Ionicons name="arrow-back" size={24} color={Colors.primary} />}
              onPress={() => router.back()}
              variant="ghost"
            />
          )}
          
          <VStack flex={1}>
            <AppText variant="h2" weight="bold">Notifications</AppText>
            <AppText variant="body" color="secondary">
              {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
            </AppText>
          </VStack>

          <HStack space={1}>
            <IconButton
              icon={<Ionicons name="checkmark-done" size={20} color={Colors.primary} />}
              onPress={handleMarkAllAsRead}
              variant="ghost"
            />
            <IconButton
              icon={<Ionicons name="trash-outline" size={20} color={Colors.error} />}
              onPress={handleClearAll}
              variant="ghost"
            />
          </HStack>
        </HStack>
      </Box>

      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack space={6} p={4}>
          {/* Notification Settings */}
          <VStack space={4} bg="gray.50" p={4} borderRadius="xl">
            <AppText variant="h3" weight="bold">Notification Settings</AppText>
            
            <VStack space={3}>
              <HStack justifyContent="space-between" alignItems="center">
                <VStack space={1}>
                  <AppText variant="body" weight="medium">Price Alerts</AppText>
                  <AppText variant="small" color="secondary">
                    Get notified when saved properties change price
                  </AppText>
                </VStack>
                <Switch
                  isChecked={notificationSettings.priceAlerts}
                  onToggle={() => setNotificationSettings(prev => ({
                    ...prev,
                    priceAlerts: !prev.priceAlerts
                  }))}
                  colorScheme="primary"
                />
              </HStack>

              <HStack justifyContent="space-between" alignItems="center">
                <VStack space={1}>
                  <AppText variant="body" weight="medium">New Matches</AppText>
                  <AppText variant="small" color="secondary">
                    Alert when new properties match your criteria
                  </AppText>
                </VStack>
                <Switch
                  isChecked={notificationSettings.newMatches}
                  onToggle={() => setNotificationSettings(prev => ({
                    ...prev,
                    newMatches: !prev.newMatches
                  }))}
                  colorScheme="primary"
                />
              </HStack>

              <HStack justifyContent="space-between" alignItems="center">
                <VStack space={1}>
                  <AppText variant="body" weight="medium">Viewing Reminders</AppText>
                  <AppText variant="small" color="secondary">
                    Reminders for scheduled property viewings
                  </AppText>
                </VStack>
                <Switch
                  isChecked={notificationSettings.viewingReminders}
                  onToggle={() => setNotificationSettings(prev => ({
                    ...prev,
                    viewingReminders: !prev.viewingReminders
                  }))}
                  colorScheme="primary"
                />
              </HStack>

              <HStack justifyContent="space-between" alignItems="center">
                <VStack space={1}>
                  <AppText variant="body" weight="medium">Market Updates</AppText>
                  <AppText variant="small" color="secondary">
                    Real estate market trends and insights
                  </AppText>
                </VStack>
                <Switch
                  isChecked={notificationSettings.marketUpdates}
                  onToggle={() => setNotificationSettings(prev => ({
                    ...prev,
                    marketUpdates: !prev.marketUpdates
                  }))}
                  colorScheme="primary"
                />
              </HStack>

              <HStack justifyContent="space-between" alignItems="center">
                <VStack space={1}>
                  <AppText variant="body" weight="medium">Promotional</AppText>
                  <AppText variant="small" color="secondary">
                    Special offers and promotional content
                  </AppText>
                </VStack>
                <Switch
                  isChecked={notificationSettings.promotional}
                  onToggle={() => setNotificationSettings(prev => ({
                    ...prev,
                    promotional: !prev.promotional
                  }))}
                  colorScheme="primary"
                />
              </HStack>
            </VStack>
          </VStack>

          {/* Notifications List */}
          <VStack space={3}>
            <AppText variant="h3" weight="bold">Recent Notifications</AppText>
            
            {notifications.length === 0 ? (
              <Center py={8}>
                <Ionicons name="notifications-off-outline" size={48} color={Colors.text.disabled} />
                <AppText variant="body" color="secondary" align="center" style={{ marginTop: 8 }}>
                  No notifications yet
                </AppText>
              </Center>
            ) : (
              <VStack space={3}>
                {notifications.map(notification => (
                  <Pressable
                    key={notification.id}
                    onPress={() => handleNotificationPress(notification)}
                    _pressed={{ backgroundColor: 'gray.50' }}
                  >
                    <Box 
                      bg={notification.read ? 'white' : 'primary.50'} 
                      p={4} 
                      borderRadius="xl"
                      borderWidth={1}
                      borderColor={notification.read ? 'gray.200' : 'primary.200'}
                    >
                      <HStack space={3} alignItems="flex-start">
                        {getNotificationIcon(notification.type)}
                        
                        <VStack flex={1} space={1}>
                          <HStack justifyContent="space-between" alignItems="flex-start">
                            <AppText variant="body" weight="medium" flex={1}>
                              {notification.title}
                            </AppText>
                            {!notification.read && (
                              <Box width={2} height={2} bg="primary.500" borderRadius="full" />
                            )}
                          </HStack>
                          
                          <AppText variant="body" color="secondary">
                            {notification.message}
                          </AppText>
                          
                          <HStack justifyContent="space-between" alignItems="center">
                            <AppText variant="small" color="disabled">
                              {notification.time}
                            </AppText>
                            
                            {notification.action && (
                              <AppText variant="small" color="primary" weight="medium">
                                {notification.action}
                              </AppText>
                            )}
                          </HStack>
                        </VStack>
                      </HStack>
                    </Box>
                  </Pressable>
                ))}
              </VStack>
            )}
          </VStack>
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default NotificationsScreen;