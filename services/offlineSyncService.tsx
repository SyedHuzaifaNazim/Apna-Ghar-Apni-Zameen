import { analyticsService } from './analyticsService';
import { notificationService } from './notificationService';
import { offlineQueueService, OfflineAction } from './offlineQueueService';

const handleFavoritesAdd = async (action: OfflineAction) => {
  const { propertyId, propertyData, analytics } = action.payload;

  await analyticsService.track('property_favorited', analytics);

  if (propertyData) {
    await notificationService.schedulePriceDropAlert(
      propertyId,
      propertyData.title,
      propertyData.price,
      propertyData.price * 0.9,
      new Date(Date.now() + 24 * 60 * 60 * 1000)
    );
  }
};

const handleFavoritesRemove = async (action: OfflineAction) => {
  const { propertyId, analytics } = action.payload;

  await analyticsService.track('property_unfavorited', analytics);
  await notificationService.cancelNotification(`price_drop_${propertyId}`);
};

const handleAnalyticsTrack = async (action: OfflineAction) => {
  const { eventName, params } = action.payload;
  await analyticsService.track(eventName, params);
};

offlineQueueService.registerProcessor('favorites:add', handleFavoritesAdd);
offlineQueueService.registerProcessor('favorites:remove', handleFavoritesRemove);
offlineQueueService.registerProcessor('analytics:track', handleAnalyticsTrack);

