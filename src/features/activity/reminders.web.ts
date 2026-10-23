import { Habit } from './model';
export async function requestReminderPermission() { return false; }
export async function syncReminders(_habits: Habit[]) {}
export async function snoozeReminder(_habit: Habit) {}
