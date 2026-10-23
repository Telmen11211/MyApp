import { Palette } from '@/features/activity/appearance';
import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useActivity } from '@/features/activity/activity-context';
import { dateKey, parseDate, shiftDay } from '@/features/activity/model';
import { HabitEditor } from '@/features/activity/habit-editor';
import { useSettingsDrawer } from '@/features/activity/settings-drawer';
import { DailyProgress } from '@/features/activity/daily-progress';
import { HabitRow } from '@/features/activity/habit-row';
import { useUI, useStyles, Button, Icon, Screen, Section } from '@/features/activity/ui';
export default function TodayScreen() {
  const { palette, s } = useUI();
  const styles = useStyles(makeStyles);
  const { name, daily, store, day } = useActivity();
  const openSettings = useSettingsDrawer();
  const [adding, setAdding] = useState(false);
  const offset = (parseDate(day).getDay() + 6) % 7;
  return <Screen>
    <View style={s.between}><View style={styles.brand}><View style={styles.mark}><Icon name="challenge" size={20} color={palette.onAccent} /></View><Text style={styles.wordmark}>dayly<Text style={{ color: palette.accent }}>.</Text></Text></View><View style={s.row}><Pressable accessibilityRole="button" accessibilityLabel="Тохиргоо нээх" onPress={openSettings} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}><Icon name="more" light size={24} /></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Аккаунт нээх" onPress={() => router.navigate('/profile')} style={styles.avatar}><Text style={{ color: palette.accent, fontWeight: '700' }}>{name.slice(0,1)}</Text></Pressable></View></View>
    <View style={{ gap: 9 }}><Text style={s.eyebrow}>{parseDate(day).getMonth()+1}-Р САРЫН {parseDate(day).getDate()}</Text><Text style={s.title}>Өнөөдөр</Text></View>
    <View style={styles.week}>{['Да','Мя','Лх','Пү','Ба','Бя','Ня'].map((label, i) => {
      const key = shiftDay(day, i-offset), log = store.logs[key];
      const done = log?.planned.length && log.planned.every(id => { const e = log.entries[id]; return e && e.amount >= e.target; });
      return <Pressable key={key} accessibilityRole="button" accessibilityLabel={`${key} түүх харах`} onPress={() => router.navigate({ pathname: '/history', params: { date: key } })} style={[styles.weekDay, i === offset && styles.today]}><Text style={[s.tiny, i === offset && styles.dark]}>{label}</Text><Text style={[styles.dayNumber, i === offset && styles.dark]}>{parseDate(key).getDate()}</Text><View style={[styles.dot, { backgroundColor: done ? i === offset ? palette.onAccent : palette.primary : palette.muted }]} /></Pressable>;
    })}</View>
    <DailyProgress />
    <Section title="Миний дадлууд" action="+ Нэмэх" onPress={() => setAdding(true)} />
    {daily.length === 0 && <View style={s.card}><Icon name="sun" color={palette.accent} size={32} /><Text style={s.body}>Өнөөдөр төлөвлөсөн дадал алга. Шинэ дадал нэмэх эсвэл бэлэн санаанаас сонгоорой.</Text><Button label="Дадал нэмэх" onPress={() => setAdding(true)} /></View>}
    {(['Өглөө','Өдөр','Орой'] as const).map(period => { const items = daily.filter(h => h.period === period); return items.length ? <View key={period} style={{ gap: 12 }}><Text style={s.eyebrow}>{period.toUpperCase()} · {items.length}</Text>{items.map(h => <HabitRow key={`${h.id}-${dateKey()}`} habit={h} />)}</View> : null; })}
    <Pressable accessibilityRole="button" onPress={() => router.navigate('/history')} style={[s.card, s.row]}><Icon name="history" color="#C6B8F5" /><View style={{ flex: 1, gap: 4 }}><Text style={s.rowTitle}>Дадлын түүх</Text><Text style={s.caption}>Хийсэн даалгаврууд</Text></View><Icon name="right" color={palette.muted} /></Pressable>
    <Section title="Шинэ дадлын санаа" action="Сонгох" onPress={() => router.navigate('/explore')} />
    {adding && <HabitEditor onClose={() => setAdding(false)} />}
  </Screen>;
}
const makeStyles = (palette: Palette) => StyleSheet.create({ brand: { flexDirection: 'row', gap: 9, alignItems: 'center' }, mark: { width: 30, height: 33, borderRadius: 11, backgroundColor: palette.primary, alignItems: 'center', justifyContent: 'center' }, wordmark: { color: palette.text, fontSize: 30, fontWeight: '800', letterSpacing: -1.5 }, avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: palette.selected, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: palette.selectedBorder }, week: { flexDirection: 'row', gap: 6 }, weekDay: { flex: 1, paddingVertical: 13, borderRadius: 18, alignItems: 'center', gap: 9, backgroundColor: palette.card }, today: { backgroundColor: palette.primary }, dark: { color: palette.onAccent }, dayNumber: { fontSize: 17, fontWeight: '600', color: palette.text }, dot: { width: 5, height: 5, borderRadius: 3 } });
