
// NOTE: We are temporarily mocking this service because Expo Go SDK 53
// removed support for Android Push Notifications. To use real notifications
// later, we will need to create a "Development Build".

export async function registerForPushNotificationsAsync() {
  console.log("LOG: Push Notifications skipped (Expo Go limitation)");
  return null;
}

export async function schedulePushNotification(title: string, body: string, data = {}) {
  console.log(`LOG: Notification Simulated: ${title} - ${body}`);
  return;
}

export async function sendPushNotification(expoPushToken: string, title: string, body: string) {
  console.log("LOG: Send Push Notification skipped");
}

export const cancelAllNotifications = async () => {
  console.log("LOG: Cancel Notifications skipped");
}

// Add any other exports your app might be using as empty functions here
export default {
    registerForPushNotificationsAsync,
    schedulePushNotification,
    sendPushNotification,
    cancelAllNotifications
};