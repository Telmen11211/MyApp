import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { challenges, useActivity } from '@/features/activity/activity-context';
import { Button, ChallengeRow, Icon, palette, s, Screen, Section, useChallengeDetail } from '@/features/activity/ui';

export default function TodayScreen() {
  const { name, completed, points } = useActivity();
  const detail = useChallengeDetail();
  const daily = challenges.slice(0, 3);
  const count = daily.filter(item => completed.includes(item.id)).length;
  const now = new Date();
  const weekday = ['Ням', 'Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан', 'Бямба'][now.getDay()];
  return <Screen>
    <View style={s.between}><View style={styles.brand}><View style={styles.brandMark}><Icon name="challenge" size={21} color={palette.bg} /></View><Text style={styles.wordmark}>dayly<Text style={{ color: palette.lime }}>.</Text></Text></View><Pressable accessibilityRole="button" accessibilityLabel="Профайл нээх" onPress={() => router.navigate('/profile')} style={styles.avatar}><Text style={styles.avatarText}>{name.slice(0, 1)}</Text></Pressable></View>
    <View style={{ gap: 9 }}><Text style={s.eyebrow}>{now.getMonth() + 1}-Р САРЫН {now.getDate()} · {weekday.toUpperCase()}</Text><Text style={s.title}>Жижиг алхам.{'\n'}<Text style={{ color: palette.lime }}>Илүү сайхан өдөр.</Text></Text><Text style={s.body}>Сайн уу, {name}. Өнөөдөр өөртөө цаг гаргая.</Text></View>
    <View style={styles.week}>{Array.from({ length: 7 }, (_, index) => {
      const date = new Date(now); const offset = (now.getDay() + 6) % 7; date.setDate(now.getDate() - offset + index);
      const today = index === offset;
      return <View key={index} style={[styles.day, today && styles.today]}><Text style={[styles.dayLabel, today && styles.dark]}>{['Да', 'Мя', 'Лх', 'Пү', 'Ба', 'Бя', 'Ня'][index]}</Text><Text style={[styles.dayNumber, today && styles.dark]}>{date.getDate()}</Text><View style={[styles.dayDot, today && { backgroundColor: palette.bg }]} /></View>;
    })}</View>
    <View style={styles.hero}>
      <View style={s.between}><View style={styles.heroBadge}><View style={styles.liveDot} /><Text style={styles.heroLabel}>ӨНӨӨДРИЙН ГОЛ СОРИЛТ</Text></View><Text style={styles.heroIndex}>01 / 03</Text></View>
      <View style={styles.heroVisual}>
        <View style={styles.orbitOuter} /><View style={styles.orbitInner} />
        <View style={styles.sparkOne}><Icon name="mind" size={26} color="#536333" /></View>
        <View style={styles.sparkTwo}><Icon name="sun" size={23} color="#536333" /></View>
        <View style={styles.walkCircle}><Icon name="walk" size={86} color="#263519" /></View>
        <View style={styles.floatingTag}><Icon name="challenge" size={15} color={palette.bg} /><Text style={styles.floatingText}>+100 XP</Text></View>
      </View>
      <Text style={styles.heroTitle}>Өглөөг шинэ challenge-ээр эхлүүл</Text><Text style={styles.heroDescription}>20 минутын алхалт.</Text>
      <View style={[s.row, { gap: 18, marginVertical: 6 }]}><View style={[s.row, { gap: 5 }]}><Icon name="clock" size={15} color="#485834" /><Text style={styles.heroMeta}>20 минут</Text></View><View style={[s.row, { gap: 8 }]}><Text style={styles.heroMeta}>↗  Хөнгөн</Text><Text style={styles.heroMeta}>Хөдөлгөөн</Text></View></View>
      <Pressable accessibilityRole="button" onPress={() => detail.open(challenges[0])} style={({ pressed }) => [styles.heroButton, pressed && { opacity: 0.8 }]}><Text style={styles.heroButtonText}>{completed.includes('walk') ? 'Сорилт дууссан ✓' : 'Өнөөдрийн сорилтоо эхлүүлье'}</Text><Icon name="arrow" size={20} color={palette.lime} /></Pressable>
    </View>
    <View style={styles.stats}><View style={styles.stat}><Icon name="check" size={20} color={palette.lime} /><Text style={styles.statNumber}>{count}<Text style={styles.statSuffix}> / 3</Text></Text><Text style={s.caption}>Өдрийн сорилт</Text></View><View style={styles.statDivider} /><View style={styles.stat}><Icon name="challenge" size={20} color="#F4D785" /><Text style={styles.statNumber}>{points}<Text style={styles.statSuffix}> XP</Text></Text><Text style={s.caption}>Өнөөдрийн оноо</Text></View></View>
    <View><Section title="Өөртөө өгөх жижиг завсарлага" action="Бүгд" onPress={() => router.navigate('/explore')} />{daily.slice(1).map(item => <ChallengeRow key={item.id} challenge={item} onPress={() => detail.open(item)} />)}</View>
    {count === 3 && <Button label="Өнөөдрийн ахицаа харах" onPress={() => router.navigate('/progress')} />}
    <Text style={styles.footer}>Төгс байх албагүй. Өнөөдөр эхлэхэд л болно.</Text>
    {detail.modal}
  </Screen>;
}
const styles = StyleSheet.create({
  brand: { flexDirection: 'row', alignItems: 'center', gap: 9 }, brandMark: { width: 29, height: 32, borderRadius: 10, backgroundColor: palette.lime, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-8deg' }] },
  wordmark: { fontSize: 30, fontWeight: '800', letterSpacing: -1.5, color: palette.text }, avatar: { width: 43, height: 43, borderRadius: 22, borderWidth: 1, borderColor: '#4D5741', backgroundColor: '#303C26', alignItems: 'center', justifyContent: 'center' }, avatarText: { fontSize: 17, color: palette.lime, fontWeight: '600' },
  week: { flexDirection: 'row', justifyContent: 'space-between', gap: 5 }, day: { flex: 1, alignItems: 'center', gap: 9, paddingVertical: 13, borderRadius: 19, backgroundColor: palette.card }, today: { backgroundColor: palette.lime }, dayLabel: { fontSize: 10, color: palette.muted, fontWeight: '600' }, dayNumber: { fontSize: 16, color: palette.text, fontWeight: '600' }, dayDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#434A3C' }, dark: { color: palette.bg },
  hero: { padding: 22, borderRadius: 28, backgroundColor: palette.lime, gap: 11, overflow: 'hidden' }, heroBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 }, liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#435A21' }, heroLabel: { color: '#3B4C26', fontWeight: '700', letterSpacing: 1, fontSize: 9 }, heroIndex: { color: '#5D7041', fontSize: 10, fontWeight: '600' },
  heroVisual: { height: 177, alignItems: 'center', justifyContent: 'center' }, orbitOuter: { width: 240, height: 155, borderRadius: 100, borderWidth: 1, borderColor: '#A9CA5B', position: 'absolute', transform: [{ rotate: '-22deg' }] }, orbitInner: { width: 194, height: 131, borderRadius: 100, borderWidth: 1, borderColor: '#B9D96D', position: 'absolute', transform: [{ rotate: '20deg' }] }, walkCircle: { width: 132, height: 132, borderRadius: 66, backgroundColor: '#C2E365', alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-10deg' }] }, floatingTag: { position: 'absolute', bottom: 8, right: '15%', backgroundColor: '#F1FFC9', borderRadius: 12, flexDirection: 'row', gap: 3, paddingHorizontal: 11, paddingVertical: 8, transform: [{ rotate: '-8deg' }] }, floatingText: { fontWeight: '800', fontSize: 12, color: palette.bg }, sparkOne: { position: 'absolute', left: '12%', top: 20 }, sparkTwo: { position: 'absolute', right: '8%', top: 48 },
  heroTitle: { color: '#1D2C13', fontSize: 26, fontWeight: '800', letterSpacing: -1 }, heroDescription: { color: '#4A5E32', fontSize: 12, lineHeight: 19 }, heroMeta: { fontSize: 10, fontWeight: '600', color: '#485834' }, heroButton: { minHeight: 53, borderRadius: 15, backgroundColor: '#1E2A16', padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }, heroButtonText: { color: '#F0FAD9', fontSize: 12, fontWeight: '600' },
  stats: { flexDirection: 'row', backgroundColor: palette.card, padding: 20, borderRadius: 22, alignItems: 'center' }, stat: { flex: 1, gap: 8, alignItems: 'center' }, statNumber: { fontSize: 28, fontWeight: '700', color: palette.text, letterSpacing: -1 }, statSuffix: { fontSize: 15, fontWeight: '400', color: palette.muted }, statDivider: { width: 1, height: 62, backgroundColor: palette.line }, footer: { textAlign: 'center', color: '#78836F', fontSize: 11, paddingVertical: 8 },
});
