import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { analyticsService } from './analyticsService';

// Configure how notifications behave when the app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
});

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
  trigger?: Notifications.NotificationTriggerInput;
}

class NotificationService {
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await this.registerForPushNotificationsAsync();
      this.setupListeners();
      this.isInitialized = true;
      console.log('NotificationService initialized successfully');
    } catch (error) {
      console.error('NotificationService initialization error:', error);
      analyticsService.trackError(error as Error, { context: 'notification_init' });
    }
  }

  // Request permissions and get token
  async registerForPushNotificationsAsync(): Promise<string | undefined> {
    // FIX: Skip Push Registration on Android Expo Go (SDK 53+ restriction)
    if (Platform.OS === 'android' && Constants.appOwnership === 'expo') {
      console.log('Skipping Push Registration: Remote notifications are not supported in Expo Go on Android.');
      return undefined;
    }

    if (!Device.isDevice) {
      console.log('Must use physical device for Push Notifications');
      return undefined;
    }

    let token;
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        analyticsService.track('push_permission_denied');
        return undefined;
      }

      // Get the token that uniquely identifies this device
      const tokenData = await Notifications.getExpoPushTokenAsync();
      token = tokenData.data;
      
      // Track successful registration
      analyticsService.track('push_token_registered', { platform: Platform.OS });

    } catch (error) {
      console.error('Error getting push token:', error);
      analyticsService.trackError(error as Error, { context: 'get_push_token' });
    }

    // Android channel configuration
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }

  // Schedule a local notification
  async scheduleNotification({ title, body, data = {}, trigger = null }: NotificationPayload): Promise<string> {
    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
        },
        trigger,
      });

      analyticsService.track('notification_scheduled', { type: data.type || 'general' });
      return id;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return '';
    }
  }

  // Send an immediate local notification
  async sendLocalNotification(title: string, body: string, data: Record<string, any> = {}): Promise<void> {
    await this.scheduleNotification({
      title,
      body,
      data,
      trigger: null, // Immediate
    });
  }

  // Cancel specific notification
  async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  // Cancel all notifications
  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  // Set app badge count
  async setBadgeCount(count: number): Promise<void> {
    await Notifications.setBadgeCountAsync(count);
  }

  // Setup event listeners
  private setupListeners(): void {
    // Listener for incoming notifications while app is foreground
    Notifications.addNotificationReceivedListener(notification => {
      const data = notification.request.content.data;
      analyticsService.track('notification_received', { 
        foreground: true,
        type: data.type 
      });
    });

    // Listener for when user taps a notification
    Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      
      analyticsService.track('notification_opened', { 
        type: data.type,
        actionId: response.actionIdentifier 
      });

      // Handle navigation based on data
      this.handleNotificationTap(data);
    });
  }

  // Centralized navigation logic for notifications
  private handleNotificationTap(data: Record<string, any>): void {
    if (data.url) {
      // Use Expo Router or Linking to navigate
      // Linking.openURL(data.url);
    } else if (data.screen) {
      // Navigate to specific screen if using a navigation ref service
      // NavigationService.navigate(data.screen, data.params);
    }
  }
}

export const notificationService = new NotificationService();