import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Habit } from './model';
Notifications.setNotificationHandler({ handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }) });
export async function requestReminderPermission() {
  if (Platform.OS === 'android') await Notifications.setNotificationChannelAsync('habits', { name: 'Дадлын сануулга', importance: Notifications.AndroidImportance.DEFAULT });
  const result = await Notifications.requestPermissionsAsync();
  return result.granted || result.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
}
export async function syncReminders(habits: Habit[]) {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const item of scheduled) if (item.identifier.startsWith('dayly-weekly-')) await Notifications.cancelScheduledNotificationAsync(item.identifier);
  const permission = await Notifications.getPermissionsAsync();
  if (!permission.granted && permission.ios?.status !== Notifications.IosAuthorizationStatus.PROVISIONAL) return;
  for (const h of habits.filter(h => !h.archived && h.reminder)) {
    const [hour, minute] = h.reminder.split(':').map(Number);
    for (const weekday of h.days) await Notifications.scheduleNotificationAsync({
      identifier: `dayly-weekly-${h.id}-${weekday}`,
      content: { title: h.title, body: 'Дадлаа хийх цаг боллоо.', data: { habitId: h.id }, sound: false },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.WEEKLY, weekday: weekday + 1, hour, minute, channelId: 'habits' },
    });
  }
}
export async function snoozeReminder(habit: Habit) {
  await Notifications.scheduleNotificationAsync({ identifier: `dayly-snooze-${habit.id}`, content: { title: habit.title, body: 'Дадлаа хийхэд бэлэн үү?', sound: false }, trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 600, channelId: 'habits' } });
}
