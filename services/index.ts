export { analyticsService, trackError, trackEvent, trackScreen } from './analyticsService';
export { agentApi, apiService, authApi, propertyApi, userApi } from './apiService';
export { locationService, locationTaskHandler } from './locationService';
export { mapService } from './mapService';
export { notificationService } from './notificationService';
export { STORAGE_KEYS, storageService } from './storageService';

// Service initialization
export const initializeServices = async (): Promise<void> => {
  try {
    // Initialize analytics first (to track other service initializations)
    await analyticsService.initialize();
    
    // Initialize notifications
    await notificationService.initialize();
    
    // Initialize map service
    await mapService.initializeMap();
    
    // Clear expired cache
    await storageService.clearExpiredCache();
    
    console.log('✅ All services initialized successfully');
    
    // Track app start
    await analyticsService.track('app_start', {
      platform: Platform.OS,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Service initialization failed:', error);
    await analyticsService.trackError(error as Error, { context: 'service_initialization' });
  }
};

// Service cleanup
export const cleanupServices = async (): Promise<void> => {
  try {
    await analyticsService.destroy();
    await notificationService.destroy();
    mapService.destroy();
    
    console.log('✅ All services cleaned up successfully');
  } catch (error) {
    console.error('❌ Service cleanup failed:', error);
  }
};