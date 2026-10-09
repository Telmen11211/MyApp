import { DarkTheme, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import AppTabs from '@/components/app-tabs';
import { ActivityProvider } from '@/features/activity/activity-context';

export default function TabLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <StatusBar style="light" />
      <ActivityProvider>
        <AppTabs />
      </ActivityProvider>
    </ThemeProvider>
  );
}
