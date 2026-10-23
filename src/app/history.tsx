import { Palette } from '@/features/activity/appearance';
import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useActivity } from '@/features/activity/activity-context';
import { completedEntries, dateKey, formatDuration, parseDate } from '@/features/activity/model';
import { useUI, useStyles, Button, Icon, PageTitle, Screen } from '@/features/activity/ui';
export default function HistoryScreen() {
  const { day, store } = useActivity();
  const { palette, s } = useUI();
  const params = useLocalSearchParams<{ date?: string }>();
  const requested = typeof params.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(params.date) && !Number.isNaN(parseDate(params.date).getTime()) ? params.date : day;
  if (!store.demoAccount || !store.demoSignedIn) return <Screen>
    <PageTitle title="Дадлын түүх" />
    <View style={[s.card, { alignItems: 'center' }]}>
      <Icon name="profile" size={40} color={palette.accent} />
      <Text style={s.sectionTitle}>{store.demoAccount ? 'Аккаунтаар нэвтэрнэ үү' : 'Аккаунт үүсгэнэ үү'}</Text>
      <Text style={[s.body, { textAlign: 'center' }]}>Хийсэн даалгаврын түүхээ харахын тулд аккаунтаар нэвтэрнэ үү.</Text>
      <View style={{ alignSelf: 'stretch' }}><Button label={store.demoAccount ? 'Нэвтрэх' : 'Аккаунт үүсгэх'} onPress={() => router.navigate('/profile')} /></View>
    </View>
  </Screen>;
  return <HistoryContent key={requested} requested={requested} />;
}
function HistoryContent({ requested }: { requested: string }) {
  const { palette, s } = useUI();
  const styles = useStyles(makeStyles);
  const { store, day } = useActivity();
  const [selected, setSelected] = useState(requested);
  const [month, setMonth] = useState(requested.slice(0,7));
  const [all, setAll] = useState(false);
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(30);
  const first = parseDate(`${month}-01`), offset = (first.getDay()+6)%7;
  const days = new Date(first.getFullYear(), first.getMonth()+1, 0).getDate();
  const records = Object.entries(store.logs).sort(([a],[b]) => b.localeCompare(a)).filter(([key]) => all || query.trim() || key === selected).flatMap(([key,log]) => completedEntries(log).filter(e => e.habit.title.toLowerCase().includes(query.trim().toLowerCase())).sort((a,b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? '')).map(e => ({ key, entry: e })));
  const navigateMonth = (delta: number) => { const d = parseDate(`${month}-01`); d.setMonth(d.getMonth()+delta); setMonth(dateKey(d).slice(0,7)); };
  return <Screen>
    <PageTitle title="Дадлын түүх" />
    <View style={s.card}>
      <View style={s.between}><Pressable accessibilityRole="button" accessibilityLabel="Өмнөх сар" onPress={() => navigateMonth(-1)} style={styles.nav}><Text style={s.link}>‹</Text></Pressable><Text style={s.sectionTitle}>{first.getFullYear()} · {first.getMonth()+1}-р сар</Text><Pressable accessibilityRole="button" accessibilityLabel="Дараагийн сар" onPress={() => navigateMonth(1)} style={styles.nav}><Text style={s.link}>›</Text></Pressable></View>
      <View style={styles.calendar}>{['Да','Мя','Лх','Пү','Ба','Бя','Ня'].map(label => <View key={label} style={styles.cell}><Text style={s.tiny}>{label}</Text></View>)}{Array.from({ length: offset },(_,i) => <View key={`empty-${i}`} style={styles.cell} />)}{Array.from({ length: days },(_,i) => {
        const key = `${month}-${String(i+1).padStart(2,'0')}`, count = completedEntries(store.logs[key]).length;
        return <Pressable key={key} accessibilityRole="button" accessibilityLabel={`${key}, ${count} дадал хийсэн`} accessibilityState={{ selected: key === selected && !all }} onPress={() => { setSelected(key); setAll(false); setQuery(''); setLimit(30); }} style={[styles.cell, styles.date, key === selected && !all && styles.selected, key === day && styles.today]}><Text style={{ color: key === selected && !all ? palette.onAccent : key > day ? palette.muted : palette.text, fontSize: 13 }}>{i+1}</Text><View style={[styles.dot, { backgroundColor: count ? key === selected && !all ? palette.onAccent : palette.primary : 'transparent' }]} /></Pressable>;
      })}</View>
      <Text style={s.caption}>● Хийсэн дадалтай өдөр · Өдөр дээр дарж дэлгэрүүлнэ.</Text>
    </View>
    <TextInput accessibilityLabel="Хийсэн даалгавар хайх" value={query} onChangeText={text => { setQuery(text); setLimit(30); }} placeholder="Өмнө хийсэн даалгавраа хайх…" placeholderTextColor={palette.muted} style={styles.search} />
    <View style={s.between}><Text style={[s.sectionTitle, { flex: 1 }]}>{query.trim() ? 'Хайлтын үр дүн' : all ? 'Бүх хийсэн даалгавар' : selected === day ? 'Өнөөдрийн хийсэн зүйлс' : selected}</Text><Pressable accessibilityRole="button" onPress={() => { setAll(!all); setLimit(30); }} style={s.smallAction}><Text style={s.link}>{all ? 'Өдрөөр харах' : 'Бүх түүх'}</Text></Pressable></View>
    <Text style={s.caption}>{records.length} хийсэн даалгавар</Text>
    {records.length === 0 && <View style={[s.card, { alignItems: 'center' }]}><Icon name="history" size={40} color={palette.muted} /><Text style={s.sectionTitle}>{query ? 'Тохирох даалгавар алга' : 'Одоогоор бүртгэл алга'}</Text><Text style={[s.body, { textAlign: 'center' }]}>Хийсэн гэж тэмдэглэсэн дадлууд энд харагдана.</Text></View>}
    {records.slice(0,limit).map(({key,entry:e}) => <View key={`${key}-${e.habit.id}`} style={styles.record}><View style={[s.iconBox, { backgroundColor: `${e.habit.color}18` }]}><Icon name="check" color={e.habit.color} /></View><View style={{ flex: 1, gap: 6 }}><Text style={s.rowTitle}>{e.habit.title}</Text><Text style={s.caption}>{key} · {e.timer ? formatDuration(e.target) : `${e.amount}/${e.target} ${e.unit}`}</Text><Text style={s.tiny}>{e.habit.category}{e.completedAt ? ` · ${new Date(e.completedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}` : ''}</Text></View><Text style={s.link}>+{e.habit.points} XP</Text></View>)}
    {records.length > limit && <Button secondary label="Цааш үзэх" onPress={() => setLimit(v => v+30)} />}
  </Screen>;
}
const makeStyles = (palette: Palette) => StyleSheet.create({ calendar: { flexDirection: 'row', flexWrap: 'wrap' }, cell: { width: '14.2857%', minHeight: 44, justifyContent: 'center', alignItems: 'center', gap: 5 }, date: { borderRadius: 13, borderWidth: 1, borderColor: 'transparent', marginVertical: 2 }, selected: { backgroundColor: palette.primary }, today: { borderColor: palette.accent }, dot: { width: 4, height: 4, borderRadius: 2 }, nav: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.selected, borderRadius: 14 }, search: { backgroundColor: palette.card, borderWidth: 1, borderColor: palette.line, borderRadius: 16, padding: 17, color: palette.text, fontSize: 14 }, record: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 20, backgroundColor: palette.card, padding: 17 } });
