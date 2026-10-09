import { Tabs, TabList, TabTrigger, TabSlot, TabTriggerSlotProps } from 'expo-router/ui';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, IconName, palette } from '@/features/activity/ui';

function TabButton({ isFocused, children, icon, ...props }: TabTriggerSlotProps & { icon: IconName }) {
  return <Pressable {...props} accessibilityRole="tab" accessibilityState={{ selected: isFocused }} style={({ pressed }) => [styles.tab, pressed && { opacity: 0.6 }]}>
    <View style={[styles.icon, isFocused && styles.active]}><Icon name={icon} size={23} color={isFocused ? palette.bg : palette.muted} /></View>
    <Text style={[styles.label, isFocused && { color: palette.lime }]}>{children}</Text>
  </Pressable>;
}
export default function AppTabs() {
  const insets = useSafeAreaInsets();
  return <Tabs style={styles.root}>
    <TabSlot style={{ flex: 1 }} />
    <TabList style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <TabTrigger name="today" href="/" asChild><TabButton icon="home">Өнөөдөр</TabButton></TabTrigger>
      <TabTrigger name="explore" href="/explore" asChild><TabButton icon="challenge">Сорилтууд</TabButton></TabTrigger>
      <TabTrigger name="progress" href="/progress" asChild><TabButton icon="progress">Ахиц</TabButton></TabTrigger>
      <TabTrigger name="profile" href="/profile" asChild><TabButton icon="profile">Профайл</TabButton></TabTrigger>
    </TabList>
  </Tabs>;
}
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.bg },
  bar: { flexDirection: 'row', backgroundColor: '#181C16', borderTopWidth: 1, borderTopColor: palette.line, paddingTop: 11, paddingHorizontal: 12, justifyContent: 'center' },
  tab: { flex: 1, maxWidth: 155, alignItems: 'center', gap: 6, minHeight: 58 },
  icon: { width: 52, height: 32, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  active: { backgroundColor: palette.lime },
  label: { color: palette.muted, fontSize: 10, fontWeight: '600' },
});
