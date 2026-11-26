import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

let handlerConfigured = false;

function ensureNotificationHandler(): void {
  if (handlerConfigured || Platform.OS === 'web') return;
  handlerConfigured = true;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export async function scheduleMedicineReminders(): Promise<{
  scheduled: boolean;
  message: string;
}> {
  if (Platform.OS === 'web') {
    return {
      scheduled: true,
      message: 'Web preview: daily reminders simulated for 8:00 AM, 2:00 PM, 9:00 PM',
    };
  }

  try {
    ensureNotificationHandler();
    const existing = await Notifications.getPermissionsAsync();
    let finalStatus = existing.status;
    if (finalStatus !== 'granted') {
      const requested = await Notifications.requestPermissionsAsync();
      finalStatus = requested.status;
    }

    if (finalStatus !== 'granted') {
      return {
        scheduled: false,
        message: 'Notification permission not granted on device',
      };
    }

    await Notifications.cancelAllScheduledNotificationsAsync();

    const slots = [
      { hour: 8, minute: 0, title: 'Morning Medicine Reminder', body: 'Tapza Care: Take your morning medicines after breakfast.' },
      { hour: 14, minute: 0, title: 'Afternoon Medicine Reminder', body: 'Tapza Care: Time for your afternoon dose.' },
      { hour: 21, minute: 0, title: 'Night Medicine Reminder', body: 'Tapza Care: Take your night medicines before sleep.' },
    ];

    for (const slot of slots) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: slot.title,
          body: slot.body,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: slot.hour,
          minute: slot.minute,
        },
      });
    }

    return {
      scheduled: true,
      message: 'Daily reminders scheduled for 8:00 AM, 2:00 PM, and 9:00 PM',
    };
  } catch {
    return {
      scheduled: false,
      message: 'Could not schedule local notifications in this runtime',
    };
  }
}
