import { Palette } from '@/features/activity/appearance';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useActivity } from '@/features/activity/activity-context';
import { completedEntries, shiftDay, streak } from '@/features/activity/model';
import { useUI, useStyles, Button, Icon, PageTitle, Screen, Section } from '@/features/activity/ui';
export default function ProgressScreen() {
  const { palette, s } = useUI();
  const styles = useStyles(makeStyles);
  const { store, daily, day, completed, totalPoints } = useActivity();
  const all = Object.values(store.logs).flatMap(completedEntries);
  const week = Array.from({length:7},(_,i) => { const key = shiftDay(day,i-6), log = store.logs[key]; return { key, count: completedEntries(log).length, planned: log?.planned.length ?? 0 }; });
  const due = week.reduce((sum,d) => sum+d.planned,0);
  const done = week.reduce((sum,d) => { const log = store.logs[d.key]; return sum + (log?.planned.filter(id => { const e = log.entries[id]; return e && e.amount >= e.target; }).length ?? 0); },0);
  const percent = due ? Math.round(done/due*100) : 0;
  const todayCount = daily.filter(h => completed.includes(h.id)).length;
  const max = Math.max(...week.map(d => d.count),1);
  const active = store.habits.filter(h => !h.archived);
  return <Screen>
    <PageTitle title="Ахиц" />
    <View style={styles.summary}><Text style={s.eyebrow}>СҮҮЛИЙН 7 ӨДӨР</Text><Text style={styles.big}>{percent}<Text style={styles.percent}>%</Text></Text><Text style={s.sectionTitle}>{done}/{due} төлөвлөсөн дадал биелсэн</Text><View style={styles.track}><View style={[styles.fill, { width: `${percent}%` }]} /></View><Text style={s.caption}>Апп ашиглаж эхэлснээс хойших бүртгэлд үндэслэнэ. Өнөөдөр {todayCount}/{daily.length} дадал биелсэн.</Text></View>
    <View style={styles.metrics}>{[{value:all.length,label:'Нийт хийсэн',icon:'check' as const},{value:Object.values(store.logs).filter(log => completedEntries(log).length).length,label:'Идэвхтэй өдөр',icon:'sun' as const},{value:totalPoints,label:'Нийт XP',icon:'challenge' as const}].map(item => <View key={item.label} style={styles.metric}><Icon name={item.icon} color={palette.accent} size={21} /><Text style={styles.metricValue}>{item.value}</Text><Text style={s.tiny}>{item.label}</Text></View>)}</View>
    <View style={s.card}><Section title="Сүүлийн 7 өдөр" /><View style={styles.chart}>{week.map(d => <View key={d.key} style={styles.column}><Text style={s.caption}>{d.count}</Text><View style={styles.barTrack}><View style={[styles.bar, { height: `${Math.max(d.count/max*100,3)}%`, backgroundColor: d.key === day ? palette.primary : palette.accent }]} /></View><Text style={s.tiny}>{Number(d.key.slice(-2))}</Text></View>)}</View><Text style={s.caption}>Багана бүр тухайн өдөр хийсэн дадлын тоог харуулна.</Text></View>
    {active.length > 0 && <View style={{ gap: 16 }}><Section title="Дадлын дараалал" />{active.map(h => { const count = streak(h,store.logs,day); return <View key={h.id} style={[s.card,s.row]}><Icon name={h.icon} color={h.color} /><View style={{ flex: 1, gap: 5 }}><Text style={s.rowTitle}>{h.title}</Text><Text style={s.caption}>Төлөвлөсөн өдрүүдийн дараалал</Text></View><Text style={[s.link,{fontSize:18}]}>{count} өдөр</Text></View>; })}<Text style={s.caption}>Амралтын өдрүүд дарааллыг таслахгүй.</Text></View>}
    <View style={{ gap: 16 }}><Section title="Тэмдгүүд" /><View style={styles.metrics}>{[{threshold:1,title:'1 дадал',icon:'sun' as const},{threshold:7,title:'7 дадал',icon:'flame' as const},{threshold:30,title:'30 дадал',icon:'trophy' as const}].map(b => <View key={b.title} style={styles.metric}><Icon name={b.icon} size={28} color={all.length >= b.threshold ? palette.primary : palette.muted} /><Text style={[s.caption,{textAlign:'center'}]}>{b.title}</Text><Text style={s.tiny}>{all.length >= b.threshold ? 'НЭЭГДСЭН ✓' : `${b.threshold} дадал`}</Text></View>)}</View></View>
    <Button label="Хийсэн даалгаврын түүх харах" onPress={() => router.navigate('/history')} />
  </Screen>;
}
const makeStyles = (palette: Palette) => StyleSheet.create({ summary: { padding:25, borderRadius:27, backgroundColor:palette.card, borderWidth:1, borderColor:palette.line, gap:16 }, big:{fontSize:70,fontWeight:'700',color:palette.primary,letterSpacing:-4}, percent:{fontSize:30,letterSpacing:0},track:{height:7,backgroundColor:palette.line,borderRadius:4,overflow:'hidden'},fill:{height:'100%',backgroundColor:palette.primary,borderRadius:4},metrics:{flexDirection:'row',gap:8},metric:{flex:1,paddingVertical:20,paddingHorizontal:6,borderRadius:20,backgroundColor:palette.card,alignItems:'center',gap:12},metricValue:{fontSize:25,fontWeight:'700',color:palette.text},chart:{height:160,flexDirection:'row',gap:12},column:{flex:1,alignItems:'center',gap:9},barTrack:{flex:1,width:'100%',backgroundColor:palette.track,borderRadius:8,justifyContent:'flex-end',overflow:'hidden'},bar:{width:'100%',borderRadius:8} });
