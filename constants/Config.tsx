import { Platform } from 'react-native';

// App Configuration
export const AppConfig = {
  // App Information
  app: {
    name: 'Apna Ghar Apni Zameen',
    displayName: 'Apna Ghar Apni Zameen',
    version: '1.0.0',
    build: '1',
    bundleId: Platform.select({
      ios: 'com.apnaghar.apnizameen',
      android: 'com.apnaghar.apnizameen',
      default: 'com.apnaghar.apnizameen',
    }),
  },

  // Environment
  environment: process.env.EXPO_PUBLIC_APP_ENV || 'development',
  isDevelopment: process.env.EXPO_PUBLIC_APP_ENV === 'development',
  isStaging: process.env.EXPO_PUBLIC_APP_ENV === 'staging',
  isProduction: process.env.EXPO_PUBLIC_APP_ENV === 'production',

  // Platform
  platform: {
    os: Platform.OS,
    version: Platform.Version,
    isIOS: Platform.OS === 'ios',
    isAndroid: Platform.OS === 'android',
    isWeb: Platform.OS === 'web',
  },
} as const;

// API Configuration
export const ApiConfig = {
  // Base URLs
  baseUrl: process.env.EXPO_PUBLIC_API_URL || 'https://apna-ghar-backend.vercel.app',
  
  // Specific Posts API (from your .env.local)
  postsApi: process.env.EXPO_PUBLIC_POSTS_API || 'https://apna-ghar-backend.vercel.app/properties',
  
  cdnUrl: process.env.EXPO_PUBLIC_CDN_URL || 'https://cdn.apnagharapnizameen.com',

  // Endpoints
  endpoints: {
    // Auth endpoints
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      logout: '/auth/logout',
      refresh: '/auth/refresh',
      forgotPassword: '/auth/forgot-password',
      resetPassword: '/auth/reset-password',
      verifyEmail: '/auth/verify-email',
      profile: '/auth/profile',
    },

    // Property endpoints
    properties: {
      list: '/properties',
      featured: '/properties/featured',
      search: '/properties/search',
      detail: '/properties/:id',
      create: '/properties',
      update: '/properties/:id',
      delete: '/properties/:id',
      similar: '/properties/:id/similar',
      nearby: '/properties/nearby',
      categories: '/properties/categories',
      filters: '/properties/filters',
    },

    // User endpoints
    user: {
      favorites: '/user/favorites',
      addFavorite: '/user/favorites/:id',
      removeFavorite: '/user/favorites/:id',
      preferences: '/user/preferences',
      searchHistory: '/user/search-history',
      viewedProperties: '/user/viewed-properties',
      notifications: '/user/notifications',
    },

    // Agent endpoints
    agents: {
      list: '/agents',
      detail: '/agents/:id',
      contact: '/agents/:id/contact',
      reviews: '/agents/:id/reviews',
    },

    // Viewing endpoints
    viewings: {
      schedule: '/viewings/schedule',
      list: '/viewings',
      cancel: '/viewings/:id',
      reschedule: '/viewings/:id/reschedule',
    },

    // Upload endpoints
    upload: {
      image: '/upload/image',
      document: '/upload/document',
      avatar: '/upload/avatar',
    },

    // Analytics endpoints
    analytics: {
      track: '/analytics/track',
      events: '/analytics/events',
    },
  },

  // API Settings
  settings: {
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
    cacheTimeout: 5 * 60 * 1000, // 5 minutes
  },

  // Headers
  headers: {
    common: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Platform': Platform.OS,
      'X-App-Version': AppConfig.app.version,
      'X-Device-ID': 'device-id', // This would be set dynamically
    },
  },
} as const;

// Map Configuration
export const MapConfig = {
  // Map provider (google, mapbox, etc.)
  provider: 'google',

  // API Keys
  apiKey: process.env.EXPO_PUBLIC_MAP_API_KEY,

  // Map settings
  settings: {
    defaultZoom: 12,
    minZoom: 8,
    maxZoom: 20,
    clusterRadius: 60,
    animationDuration: 500,
  },

  // Default locations (major Pakistani cities)
  defaultLocations: {
    karachi: { latitude: 24.8607, longitude: 67.0011 },
    lahore: { latitude: 31.5204, longitude: 74.3587 },
    islamabad: { latitude: 33.6844, longitude: 73.0479 },
    faisalabad: { latitude: 31.4504, longitude: 73.1350 },
    rawalpindi: { latitude: 33.5651, longitude: 73.0169 },
    multan: { latitude: 30.1575, longitude: 71.5249 },
    peshawar: { latitude: 34.0151, longitude: 71.5249 },
  },

  // Map styles
  styles: {
    standard: '',
    light: 'mapbox://styles/mapbox/light-v10',
    dark: 'mapbox://styles/mapbox/dark-v10',
    satellite: 'mapbox://styles/mapbox/satellite-v9',
  },
} as const;

// Storage Configuration
export const StorageConfig = {
  // Storage keys
  keys: {
    auth: {
      token: '@auth_token',
      refreshToken: '@auth_refresh_token',
      user: '@auth_user',
    },
    app: {
      settings: '@app_settings',
      preferences: '@app_preferences',
      onboarding: '@app_onboarding',
    },
    data: {
      favorites: '@data_favorites',
      searchHistory: '@data_search_history',
      viewedProperties: '@data_viewed_properties',
      cache: '@cache_',
    },
  },

  // Cache settings
  cache: {
    defaultTTL: 15 * 60 * 1000, // 15 minutes
    longTTL: 60 * 60 * 1000, // 1 hour
    shortTTL: 5 * 60 * 1000, // 5 minutes
  },
} as const;

// Feature Flags
export const FeatureFlags = {
  // Enable/disable features
  features: {
    // Auth features
    socialLogin: true,
    biometricAuth: Platform.OS === 'ios',
    guestMode: true,

    // Property features
    advancedFilters: true,
    mapView: true,
    virtualTours: false,
    priceHistory: true,

    // User features
    favorites: true,
    searchHistory: true,
    pushNotifications: true,
    inAppChat: false,

    // Payment features
    inAppPayments: false,
    mortgageCalculator: true,

    // Analytics features
    userTracking: true,
    errorReporting: true,
    performanceMonitoring: true,
  },

  // Experimental features
  experimental: {
    aiRecommendations: false,
    arView: false,
    voiceSearch: false,
    smartAlerts: true,
  },
} as const;

// Notification Configuration
export const NotificationConfig = {
  // Channels
  channels: {
    propertyAlerts: {
      id: 'property-alerts',
      name: 'Property Alerts',
      description: 'Price drops and new property matches',
    },
    viewingReminders: {
      id: 'viewing-reminders',
      name: 'Viewing Reminders',
      description: 'Reminders for scheduled property viewings',
    },
    generalUpdates: {
      id: 'general-updates',
      name: 'General Updates',
      description: 'App updates and news',
    },
  },

  // Settings
  settings: {
    defaultSound: true,
    defaultVibration: true,
    badgeEnabled: true,
  },
} as const;

// Analytics Configuration
export const AnalyticsConfig = {
  // Providers (mixpanel, amplitude, firebase, etc.)
  providers: ['firebase'],

  // Tracking settings
  tracking: {
    screenViews: true,
    userEngagement: true,
    errors: true,
    performance: true,
  },

  // Sampling rates (0-1)
  sampling: {
    general: 1.0,
    errors: 1.0,
    performance: 0.1,
  },

  // Event names
  events: {
    // App events
    appLaunch: 'app_launch',
    appBackground: 'app_background',
    appForeground: 'app_foreground',

    // Auth events
    login: 'login',
    register: 'register',
    logout: 'logout',

    // Property events
    propertyView: 'property_view',
    propertySearch: 'property_search',
    propertyFavorite: 'property_favorite',
    propertyContact: 'property_contact',

    // User events
    screenView: 'screen_view',
    buttonClick: 'button_click',
    formSubmit: 'form_submit',
  },
} as const;

// Business Rules
export const BusinessRules = {
  // Property rules
  properties: {
    maxImages: 20,
    maxTitleLength: 100,
    maxDescriptionLength: 2000,
    priceRange: {
      min: 100000, // 1 Lakh PKR
      max: 1000000000, // 100 Crore PKR
    },
    areaRange: {
      min: 100, // sq ft
      max: 100000, // sq ft
    },
  },

  // Search rules
  search: {
    maxRecentSearches: 10,
    maxSearchHistory: 50,
    maxFilters: 10,
  },

  // User rules
  user: {
    maxFavorites: 100,
    maxViewedProperties: 200,
    maxUploadSize: 10 * 1024 * 1024, // 10MB
  },

  // Validation rules
  validation: {
    email: {
      regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      maxLength: 254,
    },
    phone: {
      regex: /^(03\d{2}|92\d{2})[-\s]?\d{7}$/, // Pakistani mobile numbers (03XX-XXXXXXX or +92 format)
      length: 11, // Without country code
    },
    password: {
      minLength: 6,
      maxLength: 128,
    },
  },
} as const;

// Localization Configuration
export const LocalizationConfig = {
  // Supported languages
  languages: [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
    { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي' },
    { code: 'ps', name: 'Pashto', nativeName: 'پښتو' },
    { code: 'bal', name: 'Balochi', nativeName: 'بلوچی' },
    { code: 'skr', name: 'Saraiki', nativeName: 'سرائیکی' },
  ],

  // Default language
  defaultLanguage: 'en',

  // Currency
  currency: {
    code: 'PKR',
    symbol: 'Rs',
    decimalDigits: 0,
  },

  // Date format
  dateFormat: 'DD/MM/YYYY',

  // Number format
  numberFormat: {
    decimalSeparator: '.',
    thousandSeparator: ',',
  },
} as const;

// Performance Configuration
export const PerformanceConfig = {
  // Image optimization
  images: {
    quality: 80,
    maxWidth: 1200,
    maxHeight: 1200,
    cacheControl: 'public, max-age=31536000',
  },

  // Network optimization
  network: {
    timeout: 30000,
    maxRetries: 3,
    cacheSize: 50 * 1024 * 1024, // 50MB
  },

  // Memory management
  memory: {
    maxCachedImages: 100,
    maxCachedProperties: 50,
    clearCacheOnBackground: true,
  },
} as const;

// Export all configs
export const Config = {
  app: AppConfig,
  api: ApiConfig,
  map: MapConfig,
  storage: StorageConfig,
  features: FeatureFlags,
  notifications: NotificationConfig,
  analytics: AnalyticsConfig,
  business: BusinessRules,
  localization: LocalizationConfig,
  performance: PerformanceConfig,
} as const;

// Type exports
export type AppConfigType = typeof AppConfig;
export type ApiConfigType = typeof ApiConfig;
export type FeatureFlagsType = typeof FeatureFlags;
export type BusinessRulesType = typeof BusinessRules;

// Helper functions
export const isFeatureEnabled = (feature: keyof typeof FeatureFlags.features): boolean => {
  return FeatureFlags.features[feature];
};

export const getApiEndpoint = (endpoint: string, params: Record<string, string> = {}): string => {
  let url = endpoint;
  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}`, params[key]);
  });
  return `${ApiConfig.baseUrl}${url}`;
};

export const getImageUrl = (path: string, size: string = 'medium'): string => {
  const sizes = {
    small: 'w=300',
    medium: 'w=600',
    large: 'w=1200',
    original: '',
  };
  const sizeParam = sizes[size as keyof typeof sizes];
  return `${ApiConfig.cdnUrl}${path}${sizeParam ? `?${sizeParam}` : ''}`;
};

export const formatCurrency = (amount: number): string => {
  if (amount >= 10000000) {
    return `Rs ${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount >= 100000) {
    return `Rs ${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) {
    return `Rs ${(amount / 1000).toFixed(1)}K`;
  }
  return `Rs ${amount.toLocaleString()}`;
};

export const formatArea = (area: number): string => {
  if (area >= 100000) {
    return `${(area / 100000).toFixed(1)} acre`;
  } else if (area >= 10000) {
    return `${(area / 10000).toFixed(1)} hectare`;
  }
  return `${area.toLocaleString()} sq ft`;
};

export default Config;