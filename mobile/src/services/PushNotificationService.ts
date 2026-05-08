import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

interface PushNotificationData {
  title: string;
  body: string;
  data?: Record<string, any>;
}

class PushNotificationService {
  private expoPushToken: string | null = null;

  async initialize() {
    if (!Device.isDevice) {
      console.log('Push notifications only work on physical devices');
      return;
    }

    try {
      const token = await this.registerForPushNotifications();
      this.expoPushToken = token;

      // Save token to server
      await this.saveTokenToServer(token);

      // Listen for notifications
      this.setupNotificationListeners();
    } catch (error) {
      console.error('Push notification initialization error:', error);
    }
  }

  private async registerForPushNotifications(): Promise<string> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      throw new Error('Failed to get push notification permissions');
    }

    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    if (!projectId) {
      throw new Error('Project ID is not set');
    }

    const token = await Notifications.getExpoPushTokenAsync({
      projectId,
    });

    return token.data;
  }

  private async saveTokenToServer(token: string) {
    try {
      const response = await fetch('https://api.example.com/notifications/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          platform: 'mobile',
          device: Device.modelName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save token to server');
      }

      // Save locally
      await AsyncStorage.setItem('expoPushToken', token);
    } catch (error) {
      console.error('Save token error:', error);
    }
  }

  private setupNotificationListeners() {
    // Handle notification received while app is in foreground
    const foregroundSubscription = Notifications.addNotificationReceivedListener(
      notification => {
        this.handleNotification(notification);
      }
    );

    // Handle notification tapped
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      response => {
        this.handleNotificationResponse(response);
      }
    );

    return () => {
      foregroundSubscription.remove();
      responseSubscription.remove();
    };
  }

  private handleNotification(notification: Notifications.Notification) {
    const { title, body, data } = notification.request.content;
    console.log('Notification received:', { title, body, data });

    // Emit event for app to handle
    // Can be used to update UI, play sound, etc.
  }

  private handleNotificationResponse(response: Notifications.NotificationResponse) {
    const { title, body, data } = response.notification.request.content;
    console.log('Notification tapped:', { title, body, data });

    // Navigate to relevant screen based on data
    if (data?.orderId) {
      // Navigate to order detail
    } else if (data?.productId) {
      // Navigate to product detail
    }
  }

  // Send local notification
  async sendLocalNotification(notification: PushNotificationData) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: 'default',
          badge: 1,
        },
        trigger: {
          seconds: 2,
        },
      });
    } catch (error) {
      console.error('Send local notification error:', error);
    }
  }

  // Schedule notification
  async scheduleNotification(
    notification: PushNotificationData,
    delaySeconds: number
  ) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: 'default',
        },
        trigger: {
          seconds: delaySeconds,
        },
      });
    } catch (error) {
      console.error('Schedule notification error:', error);
    }
  }

  // Cancel all notifications
  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Cancel notifications error:', error);
    }
  }

  // Get push token
  getPushToken(): string | null {
    return this.expoPushToken;
  }

  // Update notification settings
  async updateNotificationSettings(settings: {
    orderUpdates?: boolean;
    promotions?: boolean;
    community?: boolean;
    loyalty?: boolean;
  }) {
    try {
      await fetch('https://api.example.com/notifications/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      await AsyncStorage.setItem(
        'notificationSettings',
        JSON.stringify(settings)
      );
    } catch (error) {
      console.error('Update notification settings error:', error);
    }
  }

  // Get notification settings
  async getNotificationSettings() {
    try {
      const stored = await AsyncStorage.getItem('notificationSettings');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Get notification settings error:', error);
      return {};
    }
  }
}

export const pushNotificationService = new PushNotificationService();
