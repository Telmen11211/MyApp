import { Palette } from '@/features/activity/appearance';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { challenges, useActivity } from '@/features/activity/activity-context';
import { Challenge } from '@/features/activity/model';
import { HabitEditor } from '@/features/activity/habit-editor';
import { useUI, useStyles, Button, Icon, PageTitle, Screen } from '@/features/activity/ui';
export default function ExploreScreen() {
  const { palette, s } = useUI();
  const styles = useStyles(makeStyles);
  const { habits, archiveHabit } = useActivity();
  const [category, setCategory] = useState('Бүгд');
  const [query, setQuery] = useState('');
  const [editor, setEditor] = useState<Challenge | 'new' | null>(null);
  const visible = challenges.filter(h => (category === 'Бүгд' || h.category === category) && h.title.toLowerCase().includes(query.trim().toLowerCase()));
  return <Screen>
    <PageTitle title="Дадлын санаанууд" />
    <Button label="Өөрийн дадал үүсгэх" onPress={() => setEditor('new')} />
    <TextInput accessibilityLabel="Дадлын санаа хайх" value={query} onChangeText={setQuery} placeholder="Дадлын санаа хайх…" placeholderTextColor={palette.muted} style={styles.input} />
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{['Бүгд','Хөдөлгөөн','Төвлөрөл','Өөртөө'].map(c => <Pressable key={c} accessibilityRole="button" accessibilityState={{ selected: category === c }} onPress={() => setCategory(c)} style={[styles.chip, category === c && { backgroundColor: palette.primary }]}><Text style={{ color: category === c ? palette.onAccent : palette.muted, fontSize: 12 }}>{c}</Text></Pressable>)}</View>
    {visible.map(h => { const added = habits.some(item => !item.archived && item.id === h.id); return <View key={h.id} style={[s.card, { gap: 15 }]}><View style={s.row}><View style={[s.iconBox, { backgroundColor: `${h.color}18` }]}><Icon name={h.icon} color={h.color} /></View><View style={{ flex: 1, gap: 6 }}><Text style={s.sectionTitle}>{h.title}</Text><Text style={s.caption}>{h.category} · {h.minutes} мин</Text></View></View><Text style={s.body}>{h.description}</Text><Button secondary={added} disabled={added} label={added ? 'Миний дадалд нэмэгдсэн ✓' : 'Өөртөө тохируулж нэмэх'} onPress={() => setEditor(h)} /></View>; })}
    {!visible.length && <Text style={s.body}>Тохирох санаа алга. Өөрийн дадлыг үүсгэж болно.</Text>}
    {habits.some(h => h.archived) && <View style={s.card}><Text style={s.sectionTitle}>Архивласан дадлууд</Text><Text style={s.caption}>Сэргээхэд сануулга унтраалттай байна.</Text>{habits.filter(h => h.archived).map(h => <View key={h.id} style={s.between}><Text style={[s.rowTitle, { flex: 1 }]}>{h.title}</Text><Pressable accessibilityRole="button" onPress={() => archiveHabit(h.id)} style={s.smallAction}><Text style={s.link}>Сэргээх</Text></Pressable></View>)}</View>}
    {editor && <HabitEditor habit={editor === 'new' ? undefined : editor} onClose={() => setEditor(null)} />}
  </Screen>;
}
const makeStyles = (palette: Palette) => StyleSheet.create({ input: { backgroundColor: palette.card, color: palette.text, padding: 17, borderRadius: 16, borderWidth: 1, borderColor: palette.line, fontSize: 14 }, chip: { paddingHorizontal: 16, minHeight: 44, borderWidth: 1, borderColor: palette.line, borderRadius: 22, justifyContent: 'center' } });
