// NOTE: Push notifications are mocked because Expo Go no longer supports
// Android remote notifications. Wire this up to `expo-notifications` once
// the app ships as a Development Build / standalone binary.

class NotificationService {
  async schedulePriceDropAlert(
    propertyId: number,
    title: string,
    currentPrice: number,
    targetPrice: number,
    date: Date
  ): Promise<void> {
    console.log(`LOG: Price drop alert scheduled for "${title}" (#${propertyId}) — notify if price drops to ${targetPrice} by ${date.toISOString()}`);
  }

  async cancelNotification(identifier: string): Promise<void> {
    console.log(`LOG: Notification cancelled: ${identifier}`);
  }
}

export const notificationService = new NotificationService();
export default notificationService;
