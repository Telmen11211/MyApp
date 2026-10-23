import { Palette } from './appearance';
import { useEffect, useState } from 'react';
import { AppState, Pressable, StyleSheet, Text, View } from 'react-native';
import { useActivity } from './activity-context';
import { Entry, formatDuration, Habit, timerElapsed } from './model';
import { useUI, useStyles, Icon } from './ui';
export function HabitTimer({ habit, entry, day }: { habit: Habit; entry?: Entry; day: string }) {
  const { palette, s } = useUI();
  const styles = useStyles(makeStyles);
  const { timerAction } = useActivity();
  const [now, setNow] = useState(Date.now);
  const running = entry?.timer?.runningSince !== undefined;
  const done = Boolean(entry && entry.amount >= entry.target);
  const goal = entry?.timer ? entry.target : habit.minutes * 60;
  const elapsed = done ? goal * 1000 : timerElapsed(entry, day, now);
  const ready = elapsed >= goal * 1000;
  const seconds = Math.floor(elapsed / 1000);
  useEffect(() => {
    if (!running || done) return;
    const tick = () => setNow(Date.now());
    const interval = setInterval(tick, 1000);
    const listener = AppState.addEventListener('change', state => { if (state === 'active') tick(); });
    return () => { clearInterval(interval); listener.remove(); };
  }, [running, done]);
  const label = done ? 'Дууссан' : ready ? 'Хугацаа дууссан' : running ? 'Хугацаа тоолж байна' : seconds ? 'Түр зогссон' : 'Эхлээгүй';
  return <View style={styles.panel}>
    <View style={s.between}><View style={{gap:5}}><Text style={s.caption}>{label}</Text><Text style={styles.time}>{formatDuration(seconds)}<Text style={styles.goal}> / {formatDuration(goal)}</Text></Text></View><Icon name={done ? 'check' : 'clock'} color={habit.color} size={26} /></View>
    <View accessibilityRole="progressbar" accessibilityLabel={`${habit.title} хугацааны явц`} accessibilityValue={{ min: 0, max: goal, now: seconds }} style={styles.track}><View style={[styles.fill, { width: `${Math.min(elapsed / (goal*1000)*100,100)}%`, backgroundColor: palette.accent }]} /></View>
    {done ? <Pressable accessibilityRole="button" onPress={() => { setNow(Date.now()); timerAction(habit,'reset'); }} style={styles.action}><Text style={s.caption}>Тэмдэглэгээг буцаах</Text></Pressable> : <>
      <Pressable accessibilityRole="button" accessibilityLabel={`${habit.title} ${ready ? 'дуусгах' : running ? 'түр зогсоох' : seconds ? 'үргэлжлүүлэх' : 'эхлүүлэх'}`} onPress={() => { setNow(Date.now()); timerAction(habit,ready ? 'finish' : running ? 'pause' : 'start'); }} style={[styles.action, { backgroundColor: running && !ready ? palette.selected : palette.primary }]}><Text style={{ color: running && !ready ? palette.text : palette.onAccent, fontWeight:'700', fontSize:13 }}>{ready ? 'Дуусгах' : running ? 'Түр зогсоох' : seconds ? 'Үргэлжлүүлэх' : 'Эхлүүлэх'}</Text></Pressable>
      {(running || elapsed > 0) && <Pressable accessibilityRole="button" accessibilityLabel={`${habit.title} цуцлах`} onPress={() => { setNow(Date.now()); timerAction(habit,'reset'); }} style={[styles.action, { borderWidth: 1, borderColor: palette.line }]}><Text style={{ color: palette.text, fontWeight: '600', fontSize: 13 }}>Цуцлах</Text></Pressable>}
      <Text style={styles.note}>Хугацаа дууссаны дараа дуусгана.{habit.icon === 'walk' ? ' Алхалтын хугацааг тоолно; алхам, байршил хэмжихгүй.' : ''}</Text>
    </>}
  </View>;
}
const makeStyles = (palette: Palette) => StyleSheet.create({ panel:{gap:14,paddingTop:12,borderTopWidth:1,borderTopColor:palette.line},time:{color:palette.text,fontSize:30,fontWeight:'600',fontVariant:['tabular-nums'],letterSpacing:-1},goal:{color:palette.muted,fontSize:15,letterSpacing:0},track:{height:6,backgroundColor:palette.line,borderRadius:4,overflow:'hidden'},fill:{height:'100%',borderRadius:4},action:{minHeight:46,alignItems:'center',justifyContent:'center',borderRadius:13,paddingHorizontal:14},note:{color:palette.muted,fontSize:11,lineHeight:17} });
