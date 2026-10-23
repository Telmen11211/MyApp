import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SettingsDrawerProvider } from '@/features/activity/settings-drawer';
import AppTabs from '@/components/app-tabs';
import { ActivityProvider } from '@/features/activity/activity-context';
import { AppearanceProvider, useAppearance } from '@/features/activity/appearance';
export default function Layout() { return <AppearanceProvider><ActivityProvider><Navigation /></ActivityProvider></AppearanceProvider>; }
function Navigation() {
  const { mode } = useAppearance();
  return <ThemeProvider value={mode === 'dark' ? DarkTheme : DefaultTheme}><StatusBar style={mode === 'dark' ? 'light' : 'dark'} /><SettingsDrawerProvider><AppTabs /></SettingsDrawerProvider></ThemeProvider>;
}
