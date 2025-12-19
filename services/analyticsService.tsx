import { Platform } from 'react-native';
import { storageService } from './storageService';

// Types
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp: number;
  sessionId: string;
  userId?: string;
}

export interface AnalyticsUser {
  id: string;
  email?: string;
  name?: string;
  properties?: Record<string, any>;
}

export interface AnalyticsSession {
  id: string;
  startTime: number;
  endTime?: number;
  screenViews: number;
  events: number;
}

export interface AnalyticsConfig {
  enabled: boolean;
  trackScreenViews: boolean;
  trackUserEngagement: boolean;
  trackErrors: boolean;
  sampleRate: number;
  flushInterval: number;
}

// Constants
const DEFAULT_CONFIG: AnalyticsConfig = {
  enabled: true,
  trackScreenViews: true,
  trackUserEngagement: true,
  trackErrors: true,
  sampleRate: 1.0, // 100%
  flushInterval: 30000, // 30 seconds
};

const STORAGE_KEYS = {
  ANALYTICS_CONFIG: 'analytics_config',
  ANALYTICS_QUEUE: 'analytics_queue',
  ANALYTICS_USER: 'analytics_user',
  ANALYTICS_SESSION: 'analytics_session',
};

class AnalyticsService {
  private config: AnalyticsConfig = DEFAULT_CONFIG;
  private queue: AnalyticsEvent[] = [];
  private currentSession: AnalyticsSession | null = null;
  private currentUser: AnalyticsUser | null = null;
  // Fixed: Changed from NodeJS.Timeout to any to support React Native's number return type
  private flushTimer: any = null;
  private isInitialized = false;

  // Initialization
  async initialize(customConfig?: Partial<AnalyticsConfig>): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Load saved config
      const savedConfig = await storageService.getItem<AnalyticsConfig>(STORAGE_KEYS.ANALYTICS_CONFIG);
      this.config = { ...DEFAULT_CONFIG, ...savedConfig, ...customConfig };

      // Load pending events
      await this.loadQueuedEvents();

      // Start session
      await this.startSession();

      // Start flush timer
      this.startFlushTimer();

      this.isInitialized = true;
      console.log('AnalyticsService initialized successfully');
    } catch (error) {
      console.error('AnalyticsService initialization error:', error);
    }
  }

  // Session Management
  private async startSession(): Promise<void> {
    const sessionId = this.generateId();
    this.currentSession = {
      id: sessionId,
      startTime: Date.now(),
      screenViews: 0,
      events: 0,
    };

    await storageService.setItem(STORAGE_KEYS.ANALYTICS_SESSION, this.currentSession);

    // Track session start
    await this.track('session_start', {
      session_id: sessionId,
      platform: Platform.OS,
      app_version: '1.0.0',
    });
  }

  async endSession(): Promise<void> {
    if (!this.currentSession) return;

    this.currentSession.endTime = Date.now();

    await this.track('session_end', {
      session_id: this.currentSession.id,
      duration: this.currentSession.endTime - this.currentSession.startTime,
      screen_views: this.currentSession.screenViews,
      events: this.currentSession.events,
    });

    // Flush events before ending session
    await this.flush();

    this.currentSession = null;
    await storageService.removeItem(STORAGE_KEYS.ANALYTICS_SESSION);
  }

  // User Management
  async identify(user: AnalyticsUser): Promise<void> {
    this.currentUser = user;
    await storageService.setItem(STORAGE_KEYS.ANALYTICS_USER, user);

    await this.track('user_identified', {
      user_id: user.id,
      ...user.properties,
    });
  }

  async reset(): Promise<void> {
    this.currentUser = null;
    await storageService.removeItem(STORAGE_KEYS.ANALYTICS_USER);
    
    this.queue = [];
    await storageService.removeItem(STORAGE_KEYS.ANALYTICS_QUEUE);

    await this.track('user_reset');
  }

  // Event Tracking
  async track(eventName: string, properties?: Record<string, any>): Promise<void> {
    if (!this.config.enabled || Math.random() > this.config.sampleRate) {
      return;
    }

    try {
      const event: AnalyticsEvent = {
        name: eventName,
        properties: {
          ...properties,
          platform: Platform.OS,
          app_version: '1.0.0',
          timestamp: new Date().toISOString(),
        },
        timestamp: Date.now(),
        sessionId: this.currentSession?.id || 'unknown',
        userId: this.currentUser?.id,
      };

      // Update session metrics
      if (this.currentSession) {
        this.currentSession.events++;
        await storageService.setItem(STORAGE_KEYS.ANALYTICS_SESSION, this.currentSession);
      }

      this.queue.push(event);
      await this.saveQueuedEvents();

      // Log for development
      if (__DEV__) {
        console.log('📊 Analytics Event:', eventName, event.properties);
      }
    } catch (error) {
      console.error('AnalyticsService track error:', error);
    }
  }

  // Screen Tracking
  async trackScreenView(screenName: string, properties?: Record<string, any>): Promise<void> {
    if (!this.config.trackScreenViews) return;

    await this.track('screen_view', {
      screen_name: screenName,
      ...properties,
    });

    if (this.currentSession) {
      this.currentSession.screenViews++;
      await storageService.setItem(STORAGE_KEYS.ANALYTICS_SESSION, this.currentSession);
    }
  }

  // Property-specific Events
  async trackPropertyView(propertyId: number, propertyData?: any): Promise<void> {
    await this.track('property_view', {
      property_id: propertyId,
      property_type: propertyData?.propertyCategory,
      listing_type: propertyData?.listingType,
      price: propertyData?.price,
      location: propertyData?.address?.city,
    });
  }

  async trackPropertySearch(query: string, filters?: any, resultsCount?: number): Promise<void> {
    await this.track('property_search', {
      search_query: query,
      filters: JSON.stringify(filters),
      results_count: resultsCount,
    });
  }

  async trackPropertyFavorite(propertyId: number, action: 'add' | 'remove'): Promise<void> {
    await this.track('property_favorite', {
      property_id: propertyId,
      action,
    });
  }

  async trackPropertyContact(propertyId: number, contactMethod: string): Promise<void> {
    await this.track('property_contact', {
      property_id: propertyId,
      contact_method: contactMethod,
    });
  }

  async trackViewingScheduled(propertyId: number, viewingDate: string): Promise<void> {
    await this.track('viewing_scheduled', {
      property_id: propertyId,
      viewing_date: viewingDate,
    });
  }

  // User Engagement Events
  async trackUserEngagement(action: string, properties?: Record<string, any>): Promise<void> {
    if (!this.config.trackUserEngagement) return;

    await this.track('user_engagement', {
      engagement_action: action,
      ...properties,
    });
  }

  // Error Tracking
  async trackError(error: Error, context?: Record<string, any>): Promise<void> {
    if (!this.config.trackErrors) return;

    await this.track('error_occurred', {
      error_name: error.name,
      error_message: error.message,
      error_stack: error.stack,
      context: JSON.stringify(context),
    });
  }

  // E-commerce Events
  async trackPurchase(propertyId: number, amount: number, currency: string = 'INR'): Promise<void> {
    await this.track('purchase', {
      property_id: propertyId,
      amount,
      currency,
      transaction_id: this.generateId(),
    });
  }

  // Flush and Send Events
  private async flush(): Promise<void> {
    if (this.queue.length === 0) return;

    try {
      const eventsToSend = [...this.queue];
      this.queue = [];
      await storageService.setItem(STORAGE_KEYS.ANALYTICS_QUEUE, this.queue);

      // Send events to your analytics backend
      await this.sendEventsToBackend(eventsToSend);

      if (__DEV__) {
        console.log(`📤 Flushed ${eventsToSend.length} analytics events`);
      }
    } catch (error) {
      console.error('AnalyticsService flush error:', error);
      // Restore events to queue if send fails
      await this.loadQueuedEvents();
    }
  }

  private async sendEventsToBackend(events: AnalyticsEvent[]): Promise<void> {
    // Replace with your actual analytics backend endpoint
    const backendUrl = process.env.EXPO_PUBLIC_ANALYTICS_URL;

    if (!backendUrl) {
      if (__DEV__) {
        console.log('Analytics events (simulated send):', events);
      }
      return;
    }

    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          events,
          user: this.currentUser,
          session: this.currentSession,
        }),
      });

      if (!response.ok) {
        throw new Error(`Analytics backend responded with ${response.status}`);
      }

      if (__DEV__) {
        console.log('✅ Analytics events sent successfully');
      }
    } catch (error) {
      console.error('AnalyticsService sendEventsToBackend error:', error);
      throw error;
    }
  }

  // Configuration Management
  async updateConfig(newConfig: Partial<AnalyticsConfig>): Promise<void> {
    this.config = { ...this.config, ...newConfig };
    await storageService.setItem(STORAGE_KEYS.ANALYTICS_CONFIG, this.config);
  }

  async getConfig(): Promise<AnalyticsConfig> {
    return { ...this.config };
  }

  // Queue Management
  private async loadQueuedEvents(): Promise<void> {
    try {
      const savedQueue = await storageService.getItem<AnalyticsEvent[]>(STORAGE_KEYS.ANALYTICS_QUEUE);
      this.queue = savedQueue || [];
    } catch (error) {
      console.error('AnalyticsService loadQueuedEvents error:', error);
      this.queue = [];
    }
  }

  private async saveQueuedEvents(): Promise<void> {
    try {
      await storageService.setItem(STORAGE_KEYS.ANALYTICS_QUEUE, this.queue);
    } catch (error) {
      console.error('AnalyticsService saveQueuedEvents error:', error);
    }
  }

  // Timer Management
  private startFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flushInterval);
  }

  // Utility Methods
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Metrics and Insights
  async getSessionMetrics(): Promise<{
    totalSessions: number;
    averageSessionLength: number;
    screensPerSession: number;
    eventsPerSession: number;
  }> {
    // This would typically come from your analytics backend
    return {
      totalSessions: 0,
      averageSessionLength: 0,
      screensPerSession: 0,
      eventsPerSession: 0,
    };
  }

  async getPopularProperties(): Promise<Array<{ propertyId: number; views: number }>> {
    // This would typically come from your analytics backend
    return [];
  }

  async getUserJourney(userId: string): Promise<any[]> {
    // This would typically come from your analytics backend
    return [];
  }

  // Cleanup
  async destroy(): Promise<void> {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }

    await this.endSession();
    await this.flush();

    this.isInitialized = false;
  }
}

// Create singleton instance
export const analyticsService = new AnalyticsService();

// Export convenience functions
export const trackEvent = (eventName: string, properties?: Record<string, any>) =>
  analyticsService.track(eventName, properties);

export const trackScreen = (screenName: string, properties?: Record<string, any>) =>
  analyticsService.trackScreenView(screenName, properties);

export const trackError = (error: Error, context?: Record<string, any>) =>
  analyticsService.trackError(error, context);

export default analyticsService;