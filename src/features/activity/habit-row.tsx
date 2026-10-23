import { Palette } from './appearance';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useActivity } from './activity-context';
import { Habit, isTimedHabit, streak } from './model';
import { HabitTimer } from './habit-timer';
import { HabitEditor } from './habit-editor';
import { snoozeReminder } from './reminders';
import { useUI, useStyles, Icon } from './ui';
export function HabitRow({ habit }: { habit: Habit }) {
  const { palette, s } = useUI();
  const styles = useStyles(makeStyles);
  const { store, day, changeAmount } = useActivity();
  const [editing, setEditing] = useState(false);
  const [snoozed, setSnoozed] = useState(false);
  const [error, setError] = useState('');
  const entry = store.logs[day]?.entries[habit.id];
  const amount = entry?.amount ?? 0, target = entry?.target ?? habit.target;
  const unit = entry?.unit ?? habit.unit;
  const done = amount >= target;
  const timed = Boolean(entry?.timer) || isTimedHabit(habit);
  const chain = streak(habit, store.logs, day);
  return <View style={[styles.card, done && styles.done]}>
    <View style={s.row}>
      <View style={[s.iconBox, { backgroundColor: `${habit.color}18` }]}><Icon name={done ? 'check' : habit.icon} color={habit.color} size={25} /></View>
      <Pressable accessibilityRole="button" accessibilityLabel={`${habit.title}, тохиргоо засах`} onPress={() => setEditing(true)} style={{ flex: 1, gap: 5, minHeight: 48, justifyContent: 'center' }}><Text style={[s.rowTitle, done && { color: palette.muted }]}>{habit.title}</Text><Text style={s.caption}>{timed ? `${entry?.timer ? entry.target / 60 : habit.minutes} минут · ${done ? 'Дууссан' : entry?.timer?.runningSince !== undefined ? 'Явж байна' : 'Хугацаатай'}` : `${amount}/${target} ${unit}`}{chain ? ` · 🔥 ${chain} өдөр` : ''}</Text></Pressable>
      {!timed && <Pressable accessibilityRole="button" accessibilityLabel={done ? `${habit.title} тэмдэглэгээг буцаах` : `${habit.title} ${target > 1 ? 'нэгээр нэмэх' : 'хийсэн'}`} onPress={() => changeAmount(habit, done ? -amount : 1)} style={[styles.check, done && { backgroundColor: palette.primary, borderColor: palette.primary }]}><Icon name={done ? 'check' : 'plus'} color={done ? palette.onAccent : palette.accent} size={21} /></Pressable>}
    </View>
    {timed && <HabitTimer habit={habit} entry={entry} day={day} />}
    {!timed && target > 1 && <><View style={styles.track}><View style={[styles.fill, { width: `${amount / target * 100}%`, backgroundColor: palette.accent }]} /></View><View style={s.between}><Pressable accessibilityRole="button" accessibilityLabel="Хэмжээг нэгээр бууруулах" disabled={!amount} onPress={() => changeAmount(habit, -1)} style={{ minHeight: 44, justifyContent: 'center', opacity: amount ? 1 : 0.4 }}><Text style={s.caption}>−1 буцаах</Text></Pressable><Text style={s.tiny}>{done ? 'ӨНӨӨДРИЙН ЗОРИЛГО БИЕЛЛЭЭ' : `${target - amount} ${unit} үлдлээ`}</Text></View></>}
    {Boolean(habit.reminder) && !done && Platform.OS !== 'web' && <Pressable accessibilityRole="button" onPress={async () => { try { await snoozeReminder(habit); setSnoozed(true); } catch { setError('Сануулгыг хойшлуулж чадсангүй.'); } }} style={{ minHeight: 44, justifyContent: 'center' }}><Text style={s.caption}>{snoozed ? '10 минутын дараа сануулна ✓' : `${habit.reminder} · 10 минутын дараа сануулах`}</Text></Pressable>}
    {error ? <Text style={s.caption}>{error}</Text> : null}
    {editing && <HabitEditor habit={habit} onClose={() => setEditing(false)} />}
  </View>;
}
const makeStyles = (palette: Palette) => StyleSheet.create({ card: { padding: 16, borderRadius: 22, backgroundColor: palette.card, borderWidth: 1, borderColor: palette.line, gap: 10 }, done: { backgroundColor: palette.done, borderColor: palette.doneBorder }, check: { width: 46, height: 46, borderRadius: 17, borderWidth: 1, borderColor: palette.selectedBorder, justifyContent: 'center', alignItems: 'center' }, track: { height: 5, backgroundColor: palette.line, borderRadius: 3, overflow: 'hidden' }, fill: { height: '100%', borderRadius: 3 } });
