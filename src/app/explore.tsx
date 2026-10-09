import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { challenges, useActivity } from '@/features/activity/activity-context';
import { ChallengeRow, Icon, palette, PageTitle, s, Screen, useChallengeDetail } from '@/features/activity/ui';

export default function ExploreScreen() {
  const [category, setCategory] = useState('Бүгд');
  const [query, setQuery] = useState('');
  const { completed } = useActivity();
  const detail = useChallengeDetail();
  const visible = challenges.filter(item => (category === 'Бүгд' || item.category === category) && item.title.toLowerCase().includes(query.trim().toLowerCase()));
  return <Screen>
    <PageTitle eyebrow="ӨӨРИЙН ХЭМНЭЛЭЭ ОЛ" title="Өнөөдөр юу хийх вэ?" subtitle="Бие, сэтгэлдээ хэрэгтэй жижиг сорилтоо сонго." />
    <View style={styles.search}><Icon name="challenge" size={19} color={palette.muted} /><TextInput accessibilityLabel="Сорилт хайх" value={query} onChangeText={setQuery} placeholder="Сорилтоо хайгаарай..." placeholderTextColor={palette.muted} style={styles.input} selectionColor={palette.lime} />{query.length > 0 && <Pressable accessibilityRole="button" accessibilityLabel="Хайлтыг цэвэрлэх" onPress={() => setQuery('')} style={styles.clear}><Icon name="close" size={18} /></Pressable>}</View>
    <View style={styles.banner}><View style={{ flex: 1, gap: 10 }}><Text style={styles.bannerLabel}>ЧАМД ЗОРИУЛСАН</Text><Text style={styles.bannerTitle}>Өдөрт багахан цаг.{'\n'}Өөртөө том хөрөнгө оруулалт.</Text><Text style={styles.bannerBody}>2–20 минутын хялбар сорилтууд</Text></View><View style={styles.bannerIcon}><Icon name="mind" size={48} color="#C6B8F5" /></View></View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>{['Бүгд', 'Хөдөлгөөн', 'Төвлөрөл', 'Өөртөө'].map(item => <Pressable accessibilityRole="button" accessibilityState={{ selected: category === item }} key={item} onPress={() => setCategory(item)} style={[styles.chip, category === item && styles.selectedChip]}><Text style={[styles.chipText, category === item && { color: palette.bg }]}>{item}</Text></Pressable>)}</ScrollView>
    <View><View style={s.between}><Text style={s.sectionTitle}>{category === 'Бүгд' ? 'Бүх сорилтууд' : category}</Text><Text style={s.caption}>{visible.length} сорилт</Text></View>{visible.map(item => <ChallengeRow key={item.id} challenge={item} onPress={() => detail.open(item)} />)}{visible.length === 0 && <View style={styles.empty}><Icon name="sun" size={40} color={palette.muted} /><Text style={s.sectionTitle}>Сорилт олдсонгүй</Text><Text style={s.body}>Өөр үгээр хайх эсвэл ангиллаа солиорой.</Text></View>}</View>
    <View style={[s.card, { flexDirection: 'row', alignItems: 'center', borderStyle: 'dashed' }]}><Icon name="check" color={palette.lime} /><View style={{ flex: 1, gap: 5 }}><Text style={s.rowTitle}>{completed.length > 0 ? `${completed.length} сорилт дуусгалаа. Гоё эхлэл!` : 'Эхний жижиг алхмаа хийгээрэй'}</Text><Text style={s.caption}>Өөрт тохирсон хурдаар урагшил.</Text></View></View>
    {detail.modal}
  </Screen>;
}
const styles = StyleSheet.create({
  search: { minHeight: 54, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: palette.card, borderRadius: 16, paddingHorizontal: 16, borderWidth: 1, borderColor: palette.line }, input: { flex: 1, paddingVertical: 16, color: palette.text, fontSize: 13 }, clear: { padding: 10 },
  banner: { flexDirection: 'row', gap: 10, alignItems: 'center', padding: 22, borderRadius: 24, backgroundColor: '#2C2738', borderWidth: 1, borderColor: '#443951' }, bannerLabel: { color: '#C6B8F5', letterSpacing: 1.5, fontSize: 9, fontWeight: '700' }, bannerTitle: { color: '#F1ECFF', fontSize: 19, lineHeight: 28, fontWeight: '600', letterSpacing: -0.5 }, bannerBody: { color: '#B1A6C6', fontSize: 11, lineHeight: 18 }, bannerIcon: { width: 65, height: 86, borderRadius: 30, backgroundColor: '#3B334A', alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '12deg' }] },
  chip: { borderWidth: 1, borderColor: palette.line, paddingHorizontal: 17, minHeight: 43, borderRadius: 22, justifyContent: 'center' }, selectedChip: { backgroundColor: palette.lime, borderColor: palette.lime }, chipText: { color: palette.muted, fontSize: 12, fontWeight: '600' }, empty: { alignItems: 'center', paddingVertical: 45, gap: 15 },
});
