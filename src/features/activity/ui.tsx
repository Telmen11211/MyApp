import { PropsWithChildren, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView, SymbolViewProps } from 'expo-symbols';
import { Challenge, useActivity } from './activity-context';

export const palette = { bg: '#111410', card: '#1D211B', line: '#30362B', text: '#F6F7EE', muted: '#9DA694', lime: '#D6F67A' };
const icons = {
  home: ['square.grid.2x2', 'space_dashboard'], challenge: ['bolt', 'bolt'], progress: ['chart.bar.xaxis', 'bar_chart'],
  profile: ['person.crop.circle', 'account_circle'], walk: ['figure.walk', 'directions_walk'], mind: ['sparkles', 'auto_awesome'],
  water: ['drop', 'water_drop'], book: ['book', 'menu_book'], stretch: ['figure.cooldown', 'accessibility_new'],
  sun: ['sun.max', 'light_mode'], arrow: ['arrow.up.right', 'north_east'], right: ['chevron.right', 'chevron_right'],
  check: ['checkmark', 'check'], close: ['xmark', 'close'], flame: ['flame', 'local_fire_department'],
  clock: ['clock', 'schedule'], trophy: ['trophy', 'emoji_events'], edit: ['pencil', 'edit'],
} as const;
export type IconName = keyof typeof icons;
export function Icon({ name, size = 24, color = palette.text }: { name: IconName; size?: number; color?: string }) {
  const [ios, other] = icons[name];
  return <SymbolView name={{ ios, android: other, web: other } as SymbolViewProps['name']} size={size} tintColor={color} />;
}
export function Screen({ children }: PropsWithChildren) {
  return <SafeAreaView style={s.safe} edges={['top', 'left', 'right']}><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>{children}</ScrollView></SafeAreaView>;
}
export function PageTitle({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return <View style={{ gap: 9 }}><Text style={s.eyebrow}>{eyebrow}</Text><Text style={s.title}>{title}</Text><Text style={s.body}>{subtitle}</Text></View>;
}
export function Section({ title, action, onPress }: { title: string; action?: string; onPress?: () => void }) {
  return <View style={s.between}><Text style={s.sectionTitle}>{title}</Text>{action && <Pressable accessibilityRole="button" onPress={onPress} hitSlop={10} style={s.smallAction}><Text style={s.link}>{action}</Text><Icon name="right" size={16} color={palette.lime} /></Pressable>}</View>;
}
export function Button({ label, onPress, secondary = false }: { label: string; onPress: () => void; secondary?: boolean }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [s.button, secondary && s.secondaryButton, pressed && { opacity: 0.75 }]}><Text style={[s.buttonText, secondary && { color: palette.text }]}>{label}</Text><Icon name="arrow" size={20} color={secondary ? palette.text : palette.bg} /></Pressable>;
}
export function ChallengeRow({ challenge, onPress }: { challenge: Challenge; onPress: () => void }) {
  const { completed, started } = useActivity();
  const done = completed.includes(challenge.id);
  return <Pressable accessibilityRole="button" accessibilityLabel={`${challenge.title}, ${done ? 'дууссан' : `${challenge.minutes} минут`}`} onPress={onPress} style={({ pressed }) => [s.challengeRow, pressed && { opacity: 0.7 }]}>
    <View style={[s.iconBox, { backgroundColor: `${challenge.color}18` }]}><Icon name={challenge.icon} color={challenge.color} size={26} /></View>
    <View style={{ flex: 1, gap: 7 }}><Text style={s.rowTitle}>{challenge.title}</Text><Text style={s.caption}>{done ? 'Дууссан ✓' : started.includes(challenge.id) ? 'Хийж байна' : `${challenge.category} · ${challenge.minutes} мин`}</Text></View>
    <View style={{ alignItems: 'flex-end', gap: 6 }}><Text style={[s.points, { color: done ? palette.lime : challenge.color }]}>{done ? '✓' : `+${challenge.points}`}</Text><Text style={s.tiny}>{done ? 'БОЛСОН' : 'XP'}</Text></View>
  </Pressable>;
}
export function ChallengeModal({ challenge, onClose }: { challenge: Challenge | null; onClose: () => void }) {
  const { started, completed, start, complete } = useActivity();
  if (!challenge) return null;
  const done = completed.includes(challenge.id);
  const active = started.includes(challenge.id);
  return <Modal transparent animationType="slide" visible onRequestClose={onClose}>
    <View style={s.modalBackdrop}><SafeAreaView style={s.sheet} edges={['bottom']}><ScrollView contentContainerStyle={{ padding: 26, gap: 22 }}>
      <View style={s.between}><View style={s.pill}><Text style={s.pillText}>{done ? 'САЙН БАЙНА!' : challenge.category.toUpperCase()}</Text></View><Pressable accessibilityRole="button" accessibilityLabel="Хаах" onPress={onClose} style={s.close}><Icon name="close" /></Pressable></View>
      <View style={[s.detailIcon, { backgroundColor: `${challenge.color}18` }]}><Icon name={done ? 'check' : challenge.icon} size={56} color={challenge.color} /></View>
      <Text style={s.title}>{done ? 'Нэг алхам урагш!' : challenge.title}</Text>
      <Text style={s.body}>{done ? `Чи энэ сорилтоо дуусгаад ${challenge.points} XP цуглууллаа. Өөртөө баяр хүргээрэй!` : challenge.description}</Text>
      <View style={s.row}><Text style={s.tag}>{challenge.minutes} минут</Text><Text style={[s.tag, { color: palette.lime }]}>+{challenge.points} XP</Text></View>
      {!done && challenge.steps.map((step, index) => <View key={step} style={s.step}><Text style={s.stepNumber}>0{index + 1}</Text><Text style={[s.body, { flex: 1, color: palette.text }]}>{step}</Text></View>)}
      {active && !done && <Text style={s.caption}>Сорилтоо хийж дуусгасны дараа доорх товчоор баталгаажуулаарай.</Text>}
      <Button label={done ? 'Үргэлжлүүлэх' : active ? 'Хийж дуусгалаа' : 'Сорилт эхлүүлэх'} onPress={() => { if (done) onClose(); else if (active) complete(challenge.id); else start(challenge.id); }} />
    </ScrollView></SafeAreaView></View>
  </Modal>;
}
export function useChallengeDetail() {
  const [selected, setSelected] = useState<Challenge | null>(null);
  return { open: setSelected, modal: <ChallengeModal challenge={selected} onClose={() => setSelected(null)} /> };
}
export const s = StyleSheet.create({
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
  link: { color: palette.lime, fontSize: 12, fontWeight: '600' },
  smallAction: { flexDirection: 'row', alignItems: 'center', minHeight: 44 },
  card: { backgroundColor: palette.card, borderRadius: 24, padding: 22, gap: 20, borderWidth: 1, borderColor: palette.line },
  button: { backgroundColor: palette.lime, borderRadius: 16, minHeight: 54, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  buttonText: { fontSize: 14, fontWeight: '700', color: palette.bg },
  secondaryButton: { backgroundColor: palette.line },
  challengeRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: palette.line },
  iconBox: { width: 52, height: 56, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { color: palette.text, fontSize: 14, fontWeight: '600', lineHeight: 20 },
  points: { color: palette.lime, fontSize: 16, fontWeight: '700' },
  pill: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, backgroundColor: '#D6F67A14', alignSelf: 'flex-start' },
  pillText: { color: palette.lime, fontSize: 10, letterSpacing: 1, fontWeight: '700' },
  tag: { color: palette.muted, backgroundColor: palette.line, paddingVertical: 8, paddingHorizontal: 13, borderRadius: 10, fontSize: 12 },
  modalBackdrop: { flex: 1, backgroundColor: '#000000AA', justifyContent: 'flex-end', alignItems: 'center' },
  sheet: { backgroundColor: palette.card, maxHeight: '92%', width: '100%', maxWidth: 650, borderTopLeftRadius: 32, borderTopRightRadius: 32, overflow: 'hidden' },
  close: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.line },
  detailIcon: { width: 100, height: 100, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  step: { flexDirection: 'row', alignItems: 'flex-start', gap: 16 },
  stepNumber: { color: palette.lime, fontSize: 14, fontWeight: '600', paddingTop: 3 },
});
