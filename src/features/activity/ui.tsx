import { PropsWithChildren } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView, SymbolViewProps } from 'expo-symbols';
import lightWeight from 'expo-symbols/androidWeights/light';
import { useActivity } from './activity-context';
import { Palette, useAppearance, useStyles } from './appearance';
export { useStyles } from './appearance';


const icons = {
  home: ['square.grid.2x2', 'space_dashboard'], challenge: ['bolt', 'bolt'], progress: ['chart.bar.xaxis', 'bar_chart'],
  history: ['clock.arrow.circlepath', 'history'], plus: ['plus', 'add'],
  profile: ['person.crop.circle', 'account_circle'], walk: ['figure.walk', 'directions_walk'], mind: ['sparkles', 'auto_awesome'],
  water: ['drop', 'water_drop'], book: ['book', 'menu_book'], stretch: ['figure.cooldown', 'accessibility_new'],
  sun: ['sun.max', 'light_mode'], arrow: ['arrow.up.right', 'north_east'], right: ['chevron.right', 'chevron_right'],
  check: ['checkmark', 'check'], close: ['xmark', 'close'], flame: ['flame', 'local_fire_department'],
  settings: ['gearshape', 'settings'], more: ['ellipsis', 'more_horiz'], moon: ['moon', 'dark_mode'],
  clock: ['clock', 'schedule'], trophy: ['trophy', 'emoji_events'], edit: ['pencil', 'edit'],
} as const;
export type IconName = keyof typeof icons;
export function Icon({ name, size = 24, color, light = false }: { name: IconName; size?: number; color?: string; light?: boolean }) {
  const { palette, mode } = useAppearance();
  const lightTints: Record<string,string> = { '#D6F67A':'#1D4ED8', '#93C5FD':'#1D4ED8', '#C4B5FD':'#1D4ED8', '#C6B8F5':'#7353B1', '#A8D9E8':'#28738A', '#F2BD96':'#9C5527', '#F4D785':'#896612' };
  const tint = mode === 'light' && color ? lightTints[color.toUpperCase()] ?? color : color ?? palette.text;
  const [ios, other] = icons[name];
  return <SymbolView name={{ ios, android: other, web: other } as SymbolViewProps['name']} size={size} weight={light ? { ios: 'light', android: lightWeight } : undefined} tintColor={tint} />;
}
export function Screen({ children }: PropsWithChildren) {
  const { s } = useUI();
  return <SafeAreaView style={s.safe} edges={['top', 'left', 'right']}><ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={s.content}><StorageNotice />{children}</ScrollView></SafeAreaView>;
}
function StorageNotice() {
  const { palette, s } = useUI();
  const { error, retrySave } = useActivity();
  return error ? <Pressable accessibilityRole="button" onPress={retrySave} style={s.card}><Text style={{ color: palette.warning }}>{error}</Text><Text style={s.link}>Дахин оролдох</Text></Pressable> : null;
}
export function PageTitle({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  const { s } = useUI();
  return <View style={{ gap: 9 }}>{eyebrow ? <Text style={s.eyebrow}>{eyebrow}</Text> : null}<Text style={s.title}>{title}</Text>{subtitle ? <Text style={s.body}>{subtitle}</Text> : null}</View>;
}
export function Section({ title, action, onPress }: { title: string; action?: string; onPress?: () => void }) {
  const { palette, s } = useUI();
  return <View style={s.between}><Text style={s.sectionTitle}>{title}</Text>{action && <Pressable accessibilityRole="button" onPress={onPress} hitSlop={10} style={s.smallAction}><Text style={s.link}>{action}</Text><Icon name="right" size={16} color={palette.accent} /></Pressable>}</View>;
}
export function Button({ label, onPress, secondary = false, disabled = false }: { label: string; onPress: () => void; secondary?: boolean; disabled?: boolean }) {
  const { palette, s } = useUI();
  return <Pressable accessibilityRole="button" disabled={disabled} accessibilityState={{ disabled }} onPress={onPress} style={({ pressed }) => [s.button, disabled && { opacity: 0.5 }, secondary && s.secondaryButton, pressed && { opacity: 0.75 }]}><Text style={[s.buttonText, secondary && { color: palette.text }]}>{label}</Text><Icon name="arrow" size={20} color={secondary ? palette.text : palette.onAccent} /></Pressable>;
}
const makeSharedStyles = (palette: Palette) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.bg },
  content: { width: '100%', maxWidth: 650, alignSelf: 'center', padding: 24, paddingTop: 22, paddingBottom: 32, gap: 26 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  eyebrow: { color: palette.muted, fontSize: 10, letterSpacing: 2.3, fontWeight: '700' },
  title: { color: palette.text, fontSize: 32, fontWeight: '700', letterSpacing: -1.3, lineHeight: 39 },
  body: { color: palette.muted, fontSize: 14, lineHeight: 23 },
  caption: { color: palette.muted, fontSize: 12, lineHeight: 18 },
  tiny: { color: palette.muted, fontSize: 9, letterSpacing: 1.2, fontWeight: '600' },
  sectionTitle: { color: palette.text, fontSize: 18, fontWeight: '600', letterSpacing: -0.4 },
  link: { color: palette.accent, fontSize: 12, fontWeight: '600' },
  smallAction: { flexDirection: 'row', alignItems: 'center', minHeight: 44 },
  card: { backgroundColor: palette.card, borderRadius: 24, padding: 22, gap: 20, borderWidth: 1, borderColor: palette.line },
  button: { backgroundColor: palette.primary, borderRadius: 16, minHeight: 54, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  buttonText: { fontSize: 14, fontWeight: '700', color: palette.onAccent },
  secondaryButton: { backgroundColor: palette.selected },
  challengeRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: palette.line },
  iconBox: { width: 52, height: 56, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { color: palette.text, fontSize: 14, fontWeight: '600', lineHeight: 20 },
  points: { color: palette.accent, fontSize: 16, fontWeight: '700' },
  pill: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, backgroundColor: palette.selected, alignSelf: 'flex-start' },
  pillText: { color: palette.accent, fontSize: 10, letterSpacing: 1, fontWeight: '700' },
  tag: { color: palette.muted, backgroundColor: palette.selected, paddingVertical: 8, paddingHorizontal: 13, borderRadius: 10, fontSize: 12 },
  modalBackdrop: { flex: 1, backgroundColor: '#000000AA', justifyContent: 'flex-end', alignItems: 'center' },
  sheet: { backgroundColor: palette.card, maxHeight: '92%', width: '100%', maxWidth: 650, borderTopLeftRadius: 32, borderTopRightRadius: 32, overflow: 'hidden' },
  close: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.line },
  detailIcon: { width: 100, height: 100, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  step: { flexDirection: 'row', alignItems: 'flex-start', gap: 16 },
  stepNumber: { color: palette.accent, fontSize: 14, fontWeight: '600', paddingTop: 3 },
});

export function useUI() { const { palette } = useAppearance(); const s = useStyles(makeSharedStyles); return { palette, s }; }
